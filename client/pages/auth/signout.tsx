import axios from 'axios'
import Router from 'next/router'
import { useEffect } from 'react'

const Signout = () => {
  useEffect(() => {
    axios.post('/api/users/signout').then(() => {
      Router.push('/')
    })
  }, [])

  // 2. Define a submit handler.

  return <div>Signing out...</div>
}
export default Signout
