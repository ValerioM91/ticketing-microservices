import buildClient from '@/api/build-client'
// import { GetServerSideProps } from 'next'

export default function LandingPage({ currentUser }: { currentUser: User }) {
  return <main className={`flex min-h-screen flex-col items-center justify-between p-24`}></main>
}

// ! This should be `getServerSideProps: GetServerSideProps` but VS code crashes when I use it
// export const getServerSideProps = async (context: any) => {
//   const res = await buildClient(context).get('/api/users/currentUser')

//   return { props: res.data }
// }
