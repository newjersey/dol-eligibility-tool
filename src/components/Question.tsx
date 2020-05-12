import React, { useContext, useEffect } from 'react'
import { Question as QuestionInterface } from '../lib/types'
import { getComponent, getSwitch } from '../forms'
import { getSections } from '../lib/sections'
import { Box, Heading, Text } from 'grommet'
import { FormContext } from '../contexts/form'
import { Markdown } from './helper-components'

interface Props {
  question: QuestionInterface
  previous: QuestionInterface | undefined
}

const Question: React.FC<Props> = (props) => {
  const { question, previous } = props
  const Component = getComponent(question.type)

  const { values, errors, form, translateCopy, translateByID } = useContext(FormContext)

  const value = values[question.id]
  const error = errors[question.id]
  let switchComponent: HTMLDivElement | null

  useEffect(() => {
    if (value && form.variables?.autoscroll) {
      switchComponent?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [value])

  // If question is "sections" but there are no sections, don't render.
  if (question.type === 'sections' && getSections(question.sections, form, values).length === 0) {
    return <Box />
  }

  const isNote = ['instructions-only', 'warning-only'].includes(question.type)
  const isStriped = ['instructions-only', 'warning-only'].includes(question.type)

  return (
    <Box
      direction="row"
      // Remove margin between sections:
      margin={{ top: question.type == 'sections' && previous?.type === 'sections' ? 'none' : '48px' }}
    >
      {/* Optionally inserts a vertical stripe alongside the question: */}
      {isStriped && (
        <Box
          flex={{ grow: 0, shrink: 0 }}
          basis="8px"
          background={question.type === 'warning-only' ? '#FFAE00' : '#3A80C2'}
        />
      )}

      <Box direction="column" pad={{ vertical: isStriped ? '16px' : 'none' }}>
        {(question.name || question.instructions) && (
          <Box
            fill={true}
            className="question-heading-box"
            pad={{ horizontal: 'large' }}
            margin={{ bottom: isNote ? 'none' : '16px' }}
          >
            {question.name && (
              <Box direction="row" align="start">
                <Heading
                  style={{
                    maxWidth: 'none',
                  }}
                  level={isNote ? 2 : 4}
                  margin={{ horizontal: 'none', top: 'none', bottom: question.instructions ? '8px' : 'none' }}
                >
                  {translateCopy(question.name)}
                  {!question.required && !isNote && question.type !== 'sections' && (
                    <em> ({translateByID('optional')})</em>
                  )}
                </Heading>
              </Box>
            )}
            {question.instructions && <Markdown size="small">{translateCopy(question.instructions)}</Markdown>}
          </Box>
        )}

        <Component question={question} />
        {error && (
          <Box pad={{ horizontal: 'large' }}>
            {error.map((e) => (
              <Text key={e.en} margin={{ top: 'xsmall' }} color="#E42906">
                {translateCopy(e)}
              </Text>
            ))}
          </Box>
        )}
        <Box ref={(el) => (switchComponent = el)}>
          {question.switch &&
            getSwitch(question.switch, value as string | string[])?.map((q, i, all) => (
              <Question question={q} previous={i > 0 ? all[i - 1] : undefined} key={q.id} />
            ))}
        </Box>
      </Box>
    </Box>
  )
}

export default Question
