import React from 'react'
import { Box, Markdown as GrommetMarkdown, Paragraph, ParagraphProps, Heading } from 'grommet'
import { MarginType } from 'grommet/utils'
import { merge } from '../../lib/merge'

const ListItem: React.FC = ({ children, ...styleProps }) => {
  return (
    <li>
      <Paragraph fill={true} margin="none" {...styleProps}>
        {children}
      </Paragraph>
    </li>
  )
}

interface Props {
  size?: ParagraphProps['size']
  margin?: MarginType
}

export const Markdown: React.FC<Props> = ({ margin, size, children }) => {
  // Grommet allows you to override what React component is used for various
  // HTML elements. It handles a few components by default, but there are a few
  // extra cases we want to handle (or customize).
  const headings = [1, 2, 3, 4, 5, 6].map((n) => ({
    [`h${n}`]: {
      /* eslint-disable-next-line react/display-name */
      component: (props: any) => <Heading level={n as any} {...props} />,
      props: merge({ margin: { vertical: n > 4 ? 'none' : 'small' } }, { margin, size }),
    },
  }))
  return (
    <Box className="markdown">
      <GrommetMarkdown
        components={merge(
          {
            li: {
              component: ListItem,
              props: merge({ margin, size }),
            },
            p: {
              component: Paragraph,
              props: merge({ fill: true }, { margin, size }),
            },
            span: {
              component: Paragraph,
              props: merge({ fill: true, size: 'small' }, { margin, size }),
            },
            a: {
              props: { target: '_blank', rel: 'noopener noreferrer' },
            },
          },
          ...headings
        )}
      >
        {children}
      </GrommetMarkdown>
    </Box>
  )
}
