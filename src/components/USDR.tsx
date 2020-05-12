import React, { useContext } from 'react'
import { Box, Image, Paragraph, ResponsiveContext } from 'grommet'

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
        justify="start"
        style={{ maxWidth: size === 'large' ? '1200px' : '850px' }}
        pad={{ vertical: '16px', horizontal: 'medium' }}
        direction="row"
        align="center"
      >
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
    </Box>
  )
}
