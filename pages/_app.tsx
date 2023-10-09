import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import {theme} from "../src/chakra/theme"
import Layout from '../src/components/Layout/Layout'
import { RecoilRoot } from 'recoil'
import "@/styles/globals.css"
import useCommunityData from '@/src/hooks/useCommunityData'

export default function App({ Component, pageProps }: AppProps) {


  return (
    <RecoilRoot>
      <ChakraProvider theme={theme} portalZIndex={64}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </RecoilRoot>
  )
}