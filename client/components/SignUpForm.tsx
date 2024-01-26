'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import axios from 'axios'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4).max(50),
})

export function SignUpForm() {
  const [errors, setErrors] = useState<CustomError[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    try {
      const response = await axios.post('/api/users/signup', values)
      console.log(response.data)
    } catch (err) {
      setErrors((err as { response: { data: { errors: CustomError[] } } }).response.data.errors)
    }
  }

  return (
    <Form {...form}>
      <h1 className="font-semibold text-xl">Sign in</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="email" {...field} />
              </FormControl>
              <FormDescription>This is your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="password" type="password" {...field} />
              </FormControl>
              <FormDescription>This is your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* TODO - Use the field property to display the error under the relative field and create a re-usable component for it */}
        {errors?.map((error) => (
          <p key={error.message} className="text-red-700">
            {error.message}
          </p>
        ))}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
