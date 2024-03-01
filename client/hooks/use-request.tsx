import axios from 'axios'
import { useState } from 'react'

// TODO - remove or update with correct types

const useRequest = ({
  url,
  method,
  body,
  onSuccess,
}: {
  url: string
  method: 'get' | 'post' | 'put' | 'patch' | 'delete'
  body: any
  onSuccess: any
}) => {
  const [errors, setErrors] = useState<React.ReactNode | null>(null)

  const doRequest = async () => {
    try {
      axios.get
      setErrors(null)
      const response = await axios[method](url, body)

      if (onSuccess) {
        onSuccess(response.data)
      }

      return response.data
    } catch (err) {
      setErrors(
        <div className="alert alert-danger">
          <h4>Ooops....</h4>
          <ul className="my-0">
            {(err as any)?.response.data.errors.map((err: any) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      )
    }
  }

  return { doRequest, errors }
}

export default useRequest
