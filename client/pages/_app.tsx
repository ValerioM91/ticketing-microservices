import buildClient from '@/api/build-client'
import Header from '@/components/Header'
import '@/styles/globals.css'
import type { AppContext, AppProps } from 'next/app'

declare global {
  interface CustomError {
    message: string
    field?: string
  }

  interface User {
    id: string
    email: string
  }
}

export default function AppComponent({
  Component,
  pageProps,
  currentUser,
}: AppProps & { currentUser: User }) {
  console.log('pageProps', pageProps)
  console.log('currentUser', currentUser)

  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />
    </div>
  )
}

AppComponent.getInitialProps = async (appContext: AppContext) => {
  const res = await buildClient(appContext.ctx).get('/api/users/currentUser')

  const pageProps = await appContext.Component.getInitialProps?.(appContext.ctx)

  return {
    pageProps,
    ...res.data,
  }
}
