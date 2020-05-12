import React, { ReactNode } from 'react'
import { Page, Text, View, Document, StyleSheet, Font, Link } from '@react-pdf/renderer'
import { Form, Values, Question, Option } from '../lib/types'
import { getFlattenedQuestions } from '../forms'
import { getSections } from '../lib/sections'
import { FormState } from '../contexts/form'
import moment from 'moment'
import regular from '../fonts/Roboto-Regular.ttf'
import medium from '../fonts/Roboto-Medium.ttf'
import bold from '../fonts/Roboto-Bold.ttf'

Font.register({
  family: 'Roboto',
  fonts: [
    { src: regular, fontWeight: 'normal' },
    { src: medium, fontWeight: 'medium' },
    { src: bold, fontWeight: 'bold' },
  ],
})

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: 'white',
    fontFamily: 'Roboto',
  },
  pageContent: {
    padding: '48px',
    flexGrow: 1,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  questionTitle: {
    fontSize: 14,
    fontWeight: 'medium',
    marginBottom: 8,
  },
  questionAnswer: {
    fontSize: 12,
  },
  section: {
    padding: 12,
    border: '1px solid black',
    backgroundColor: '#F8F8F8',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    marginBottom: 8,
    fontWeight: 'medium',
  },
  sectionContent: { fontSize: 10 },
  questionSection: {
    paddingTop: 12,
    borderTop: '1px solid black',
  },
})

const linkRegex = /\[([^[]+)\](\(.*\))/gm
const urlRegex = /\((http[^)]+)\)/

function stripBasicMarkdown(content: string) {
  if (!content) {
    return content
  }

  content = content.replace('#', '').replace(/\*/g, '')

  const contentParts: any[] = content.split(linkRegex)
  const finalParts: any[] = []

  contentParts.forEach((part, i) => {
    if (urlRegex.test(part)) {
      const url = part.replace(/[{()}]/g, '')
      finalParts.push(': ')
      finalParts.push(
        <Link style={{ marginLeft: 8, color: '#7D4CDB' }} src={url}>
          {url}
        </Link>
      )
      return
    }
    finalParts.push(part)
  })

  return finalParts
}

interface Props {
  form: Form
  values: Values
  translateCopy: FormState['translateCopy']
}

const Icon: React.FC<{ option: Option }> = ({ option }) => {
  return (
    <View
      key={option.id}
      style={{
        marginRight: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: option.icon ? option.icon.color : 'grey',
        height: 20,
        width: 20,
        borderRadius: 10,
      }}
    >
      <Text style={{ fontSize: 12 }}>{option.icon?.label}</Text>
    </View>
  )
}

const PDF: React.FC<Props> = (props) => {
  const { translateCopy, form, values } = props
  let questions: Question[] = []

  form.pages.forEach((p) => {
    questions = questions.concat(getFlattenedQuestions(p.questions, values))
  })

  function getValue(question: Question, values: Values): string | ReactNode {
    if (question.type === 'multiselect' && values[question.id]) {
      const multiselectAnswers = (values[question.id] as string[]).map((optionId) => {
        const option = question.options!.find((o) => o.id === optionId)
        if (!option) {
          return <View />
        }
        if (!option.icon) {
          return `\n• ${translateCopy(option.name)}`
        }
        return (
          <View
            style={{ alignItems: 'flex-start', marginBottom: 8, display: 'flex', flexDirection: 'row' }}
            key={question.id}
          >
            <Icon option={option} />
            <Text style={{ fontSize: 12, width: '90%' }}>{translateCopy(option.name)}</Text>
          </View>
        )
      })
      return <View>{multiselectAnswers}</View>
    }
    if (question.type === 'single-select') {
      const option = question.options!.find((o) => o.id === values[question.id])
      if (option) {
        return <Text style={styles.questionAnswer}>{translateCopy(option.name)}</Text>
      }
    }
    if (question.type === 'checkbox') {
      return <Text style={styles.questionAnswer}>{translateCopy(question.options![0].name)}</Text>
    }
    if (question.type === 'sections') {
      return (
        <View>
          <Text style={styles.questionTitle}>{translateCopy(question.sections?.name)}</Text>
          {getSections(question.sections, form, values).map(({ section, options }, i) => (
            <View style={styles.section} key={`${translateCopy(section.title)}_${i}`}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 12,
                }}
              >
                <Text style={styles.sectionTitle}>{translateCopy(section.title)}</Text>
                <View style={{ display: 'flex', flexDirection: 'row' }}>
                  {options.map((o) => (
                    <Icon key={o.id} option={o} />
                  ))}
                </View>
              </View>
              <Text style={styles.sectionContent}>{stripBasicMarkdown(translateCopy(section.content))}</Text>
            </View>
          ))}
        </View>
      )
    }

    return <View />
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.pageContent}>
          <Text style={styles.heading}>{translateCopy(form.title)}</Text>
          <Text style={{ fontSize: 12, marginBottom: 20 }}>Completed {moment().format('MMMM DD, YYYY')}</Text>
          <Text style={{ fontSize: 12, marginBottom: 20 }}>
            Below is a summary of your responses and the benefits and protections that may be relevant for you, based on
            the answers you provided.
          </Text>

          {questions.map((q, i) => {
            const value = getValue(q, values)
            const name = translateCopy(q.name)
            const isPresentationalQuestion = q.type === 'sections' || q.type === 'instructions-only'
            if (!value || (q.type === 'sections' && getSections(q.sections, form, values).length === 0)) {
              return <View />
            }
            return (
              <View style={{ marginBottom: 32 }} key={`${q.id}_${i}`}>
                <Text style={styles.questionTitle}>
                  {isPresentationalQuestion ? stripBasicMarkdown(translateCopy(q.instructions!)) : `${i + 1}. ${name}`}
                </Text>

                {value}
              </View>
            )
          })}
        </View>
      </Page>
    </Document>
  )
}

export default PDF
