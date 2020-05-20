import React, { useContext } from 'react'
import { Box, Image, Paragraph, ResponsiveContext } from 'grommet'
import './USDR.css'

/**
 * The USDR component wraps an underlying component with USDR branding.
 */
export const USDR: React.FC = (props) => {
  /**
   * - Header with USDR logo, app name, link to GitHub
   * - Footer with "built by etc", links to socials
   */
  return (
    <Box direction="column" height={{ min: '100vh' }}>
      <Box>
        <Header />
      </Box>

      <Box flex={{ grow: 1 }} align="center">
        {props.children}
      </Box>

      <Box>
        <Footer />
      </Box>
    </Box>
  )
}

const Header: React.FC = () => {
  // For now, we will not render a header.
  return null

  // return (
  //   <Box background={{ color: '#FFFFFF' }} elevation="xsmall" align="center">
  //     <Box
  //       width="100%"
  //       justify="start"
  //       style={{ maxWidth: '1200px' }}
  //       pad={{ horizontal: 'medium', vertical: '16px' }}
  //       direction="row"
  //       align="center"
  //     >
  //       <a href="https://www.usdigitalresponse.org/" target="_blank" rel="noopener noreferrer" tabIndex={-1}>
  //         <Image style={{ display: 'block' }} width="32px" src="./USDR-icon-BW.png" margin={{ right: '12px' }} />
  //       </a>
  //       <Heading level={4} margin="none">
  //         Pandemic Unemployment Assistance Demo
  //       </Heading>
  //     </Box>
  //   </Box>
  // )
}

const Footer: React.FC = () => {
  const size = useContext(ResponsiveContext)

  return (
    <Box background={{ color: '#FFFFFF' }} elevation="medium" align="center">
      <Box
        width="100%"
        justify="between"
        style={{ maxWidth: size === 'large' ? '1200px' : '850px' }}
        pad={{ vertical: '16px', horizontal: 'medium' }}
        direction="row"
        align="center"
        className="usdr-box"
      >
        <Box justify="start" direction="row" align="center">
          <Paragraph style={{ fontWeight: 600, flexShrink: 0 }} size="small">
            Built by
          </Paragraph>
          <a href="https://www.usdigitalresponse.org/" target="_blank" rel="noopener noreferrer" tabIndex={-1}>
            <Image
              style={{ display: 'block' }}
              width="100px"
              src="./USDR-full-logo-color.png"
              margin={{ horizontal: '12px' }}
            />
          </a>
          <Paragraph size="small" style={{ flexShrink: 1 }}>
            a nonpartisan effort to assist the U.S. government.
          </Paragraph>
        </Box>

        <Box direction="row" align="center">
          <Paragraph size="small">
            Run with{' '}
            <span role="img" aria-label="love">
              ❤️
            </span>{' '}
            by the{' '}
            <a href="https://innovation.nj.gov/" style={{ color: 'inherit' }}>
              New Jersey Office of Innovation
            </a>
          </Paragraph>

          <a href="https://github.com/newjersey/dol-eligibility-tool/" style={{ margin: '4px 0 0 12px' }}>
            <svg height="20" viewBox="0 0 16 16" version="1.1" width="20" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
              ></path>
            </svg>
          </a>
        </Box>
      </Box>
    </Box>
  )
}
