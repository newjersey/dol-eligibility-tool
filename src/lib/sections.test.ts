import { sortSections } from './sections'

describe('sortSections', () => {
  const tests: Array<{
    name: string
    ordering: Record<string, string[]>
    priorities?: Record<string, number>
    expected: string[]
  }> = [
    {
      name: 'Merges multiple lists of non-cyclic sections',
      ordering: {
        a: ['A', 'C'],
        b: ['C', 'D'],
        c: ['B', 'C'],
        d: ['A', 'B'],
      },
      expected: ['A', 'B', 'C', 'D'],
    },
    {
      name: 'Merges multiple lists of non-cyclic sections with vague orderings',
      ordering: {
        a: ['A', 'C'],
        b: ['C', 'D'],
        c: ['A', 'B'],
      },
      // Without priorities, all of these are valid responses:
      //   A -> B -> C -> D
      //   A -> C -> B -> D
      //   A -> C -> D -> B
      priorities: {
        // Here, we just need to indicate that B should come before C:
        B: 1,
        C: 2,
      },
      expected: ['A', 'B', 'C', 'D'],
    },
    {
      name: 'Merges multiple lists of non-cyclic sections with cycles',
      ordering: {
        a: ['A', 'C'],
        b: ['C', 'A'],
      },
      // Without priorities, we'd have a cycle where neither ordering is valid.
      priorities: {
        // However, once we know that A > C, then we'll pop A when we identify the cycle:
        A: 1,
        C: 2,
      },
      expected: ['A', 'C'],
    },
  ]

  for (const t of tests) {
    test(t.name, () => {
      const actual = sortSections(t.ordering, t.priorities || {})
      expect(actual).toEqual(t.expected)
    })
  }
})
