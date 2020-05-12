import { Question, Values, Form, Section, Option } from '../lib/types'

export function getSections(
  sectionIds: Question['sections'],
  form: Form,
  values: Values
): Array<{ section: Section; options: Option[] }> {
  const { sections } = form
  if (!sections || !sectionIds) {
    return []
  }

  // If we are just directly specifying the list of sections (a Single Select),
  // just return that.
  if (sectionIds.include) {
    return sectionIds.include.map((id) => ({
      section: sections[id],
      options: [],
    }))
  }

  // Otherwise, we're producing this list of sections from a Multiselect.
  // In this case, the logic is a bit more complicated.
  //
  // We'll produce an ordered list of sections that should be shown.
  // Each option will provide an ordered list of sections to enable,
  // which we'll merge together, for example:
  //
  //  Option A: ['UA', 'UI-NJ', 'ESL']
  //  Option B: ['UI-NJ', 'ESL', 'ESIJ']
  //
  // Would produce: ['UA', 'UI-NJ', 'ESL', 'ESIJ'].
  //
  // You could imagine this as a graph, where every section is a node, and
  // order is represented by edges between these nodes:
  //
  //   Option A: UA <- UI-NJ
  //   Option B:            <- ESL <- ESIJ
  //
  // However, what happens if Option B did not have 'ESL'? In that case, it
  // wouldn't be clear whether we should place 'ESL' or 'ESIJ' first.
  //
  // In that case, we rely on the ordering of sections, as defined in form.yml,
  // to break ties. We'll refer to this as the section's "priority".

  // 1. Look up the priority of all sections:
  const priorities: Record<string, number> = {}
  Object.keys(sections).forEach((id, i) => {
    priorities[id] = i
  })

  // 2. Produce an ordered list of sections by option:
  const ordering: Record<string, string[]> = {}
  // TODO: cleanup this values representation. It can just be a list of options.
  const value = (values[sectionIds.id!] as Record<string, Option[]>) || {}
  for (const options of Object.values(value)) {
    for (const option of options) {
      // Options can appear more than once, but we only need to pull their list of sections
      // once, thus the if statement here.
      if (!ordering[option.id]) {
        const sectionIDs = (option[sectionIds.id!] as string).split(',')
        ordering[option.id] = sectionIDs
      }
    }
  }

  const sorted = sortSections(ordering, priorities)

  return sorted.map((id) => ({ section: sections[id], options: value[id] }))
}

export function sortSections(ordering: Record<string, string[]>, priorities: Record<string, number>): string[] {
  // console.log(ordering, priorities)

  // Note: for our use-cases, the number of sections is small. So this just needs to work, not be efficient.
  const unblocked = new Set<string>()
  const nonEmptySections = Object.values(ordering).filter((sections) => sections.length > 0)
  if (nonEmptySections.length === 0) {
    // Recursive base case.
    return []
  }

  for (const s1 of nonEmptySections) {
    const first = s1[0]
    const blocked = nonEmptySections.some((s2) => s2.indexOf(first) > 0)
    if (!blocked) {
      unblocked.add(first)
    }
  }

  let section: string
  if (unblocked.size > 0) {
    // We found one or more sections that we could choose next, which don't have
    // an ordering constraint on another section.
    // In this case, choose the section from this list with lowest priority.
    section = [...unblocked][0]
    for (const other of unblocked) {
      if (priorities[other] < priorities[section]) {
        section = other
      }
    }
  } else {
    // In this case, we found at least one cycle which means there are no sections
    // without an ordering constraint that prevents us from selecting them. In that
    // case, we have to relax one of these ordering constraints.
    //
    // We'll do this by just picking the lowest priority section next. Technically,
    // this isn't right -- we should find the cycle and break it. But that's pretty
    // complicated -- a best-effort solution like this works fine for us.
    section = nonEmptySections[0][0]
    for (const sections of nonEmptySections) {
      const other = sections[0]
      if (priorities[other] < priorities[section]) {
        section = other
      }
    }
  }

  // console.log(section)
  for (const id of Object.keys(ordering)) {
    const i = ordering[id].indexOf(section)
    if (i >= 0) {
      ordering[id].splice(i, 1)
    }
  }
  // console.log(ordering, priorities)

  return [section, ...sortSections(ordering, priorities)]
}
