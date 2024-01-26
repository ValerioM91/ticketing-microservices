import '@/styles/globals.css'
import type { AppProps } from 'next/app'

declare global {
  interface CustomError {
    message: string
    field?: string
  }
}

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
