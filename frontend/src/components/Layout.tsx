import { Outlet } from 'react-router-dom'
import { Box } from '@chakra-ui/react'
import Header from './Header'
import Footer from './Footer'

export default function Layout() {
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header />
      <Box flex="1" as="main">
        <Outlet />
      </Box>
      <Footer />
    </Box>
  )
}
