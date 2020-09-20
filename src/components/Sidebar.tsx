import React, { useContext } from 'react'
import { Button } from './helper-components'
import { Card } from './helper-components'
import { Box, Text, Image, ResponsiveContext, Heading, Paragraph } from 'grommet'
import { LanguageContext } from '../contexts/language'
import { FormContext } from '../contexts/form'
import { range } from 'lodash'
import { StyledSelect } from './helper-components/StyledSelect'
import { FormTrash } from 'grommet-icons'
import amplitude from 'amplitude-js'

interface Props {
  pages: string[]
}

const languages = [
  { title: 'English', value: 'en' },
  // NJ isn't using Chinese language translations
  // { title: '中文', value: 'zh' },
  { title: 'Español', value: 'es' },
]

const Sidebar: React.FC<Props> = (props) => {
  const { pages } = props
  const { values, clearForm, translateByID, form, pageIndex, setPage, completion } = useContext(FormContext)
  const { language, setLanguage } = useContext(LanguageContext)
  const size = useContext(ResponsiveContext)

  const currentPage = pages[pageIndex]
  const maxCompletedPage = range(0, form.pages.length)
    .map<number>((i) => (completion[i] ? 1 : 0))
    .reduce((i, j) => i + j, 0)
  const percent = Math.floor((maxCompletedPage / pages.length) * 100)

  const canClickPage = (i: number) => {
    return range(0, i).every((index) => completion[index])
  }

  const onChangeLanguage = ({ value }: any) => {
    console.log('[Google Analytics] sending event: Change Language')
    gtag('event', 'Change Language', {
      prevLanguage: language,
      newLanguage: value,
    })
    amplitude.getInstance().logEvent('Change Language', {
      prevLanguage: language,
      newLanguage: value,
    })

    setLanguage(value)
  }

  return (
    <Box
      flex={{ shrink: 0 }}
      margin={size === 'large' ? { left: 'small' } : { top: 'small' }}
      direction="column"
      width={size === 'large' ? '350px' : '100%'}
      style={{ maxWidth: '850px' }}
    >
      <Card pad="medium" direction={size === 'medium' ? 'row' : 'column'}>
        {form.seal && (
          <Box margin={{ bottom: 'medium' }}>
            <Image src={form.seal} style={{ maxHeight: '175px', maxWidth: '100%', objectFit: 'contain' }} />
          </Box>
        )}
        <Box flex={{ grow: 1 }} margin={{ left: size === 'medium' ? '24px' : 'none' }}>
          <Box>
            <Heading level={4} margin="none">
              {translateByID('language')}
            </Heading>
            <StyledSelect
              a11yTitle="select language"
              margin={{ top: 'xsmall' }}
              options={languages}
              labelKey="title"
              valueKey={{ key: 'value', reduce: true }}
              value={language}
              onChange={onChangeLanguage}
            />
          </Box>
          <Box margin={{ top: '24px' }}>
            <Box direction="row" justify="between">
              <Heading level={4} margin="none">
                {translateByID('progress')}
              </Heading>
              <Paragraph margin="none">{percent}%</Paragraph>
            </Box>
            <Box
              margin={{ top: 'xsmall' }}
              style={{ width: '100%', height: '12px', borderRadius: '12px', background: '#F2F2F2' }}
            >
              <Box style={{ width: `${percent}%`, height: '100%', borderRadius: '12px', background: '#3A80C2' }} />
            </Box>
            <Box margin={{ top: '24px' }}>
              <Button
                onClick={clearForm}
                disabled={Object.keys(values).length === 0}
                label={translateByID('clear-form')}
                icon={<FormTrash style={{ marginRight: '4px' }} />}
              />
            </Box>
          </Box>
          <Box margin={{ top: '24px' }}>
            {size === 'large' ? (
              /* On larger screens, we show all section titles as a list */
              pages.map((page, i) => {
                return (
                  <Text
                    style={{
                      cursor: canClickPage(i) ? 'pointer' : 'not-allowed',
                      opacity: currentPage === page ? '100%' : canClickPage(i) ? '50%' : '20%',
                    }}
                    // TODO: In production, add a `canClickPage(i) && ` below to prevent folks from jumping forward.
                    onClick={() => canClickPage(i) && setPage(i)}
                    margin={{ bottom: 'xsmall' }}
                    key={page}
                  >
                    {page}
                  </Text>
                )
              })
            ) : (
              <>
                {/* On small screens, we collapse the section titles to a Select */}
                <Heading level={4} margin="none">
                  {translateByID('section')}
                </Heading>
                <StyledSelect
                  a11yTitle="select section"
                  margin={{ top: 'xsmall' }}
                  options={pages.map((page, i) => ({ page, i, disabled: !canClickPage(i) }))}
                  labelKey="page"
                  valueKey={{ key: 'i', reduce: true }}
                  disabledKey="disabled"
                  value={pageIndex as any} /* These type definitions don't support values as numbers */
                  // TODO: In production, add a `canClickPage(i) && ` below to prevent folks from jumping forward.
                  onChange={({ value: i }) => setPage(i)}
                />
              </>
            )}
          </Box>
        </Box>
      </Card>
    </Box>
  )
}

export default Sidebar
