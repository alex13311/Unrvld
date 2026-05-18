'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle } from 'lucide-react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  service: z.enum(['media', 'web', 'strategy', 'retainer', 'other'], {
    required_error: 'Please select a service',
  }),
  budget: z
    .enum(['under-5k', '5k-10k', '10k-25k', '25k-plus', 'not-sure'])
    .optional(),
  message: z.string().min(20, 'Please write at least 20 characters'),
})

type FormValues = z.infer<typeof schema>

const inputClass =
  'bg-white/[0.04] border-white/15 text-white placeholder:text-white/30 focus-visible:border-white/40 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-xl h-12'

const textareaClass =
  'bg-white/[0.04] border-white/15 text-white placeholder:text-white/30 focus-visible:border-white/40 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-xl min-h-[140px] resize-none'

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', message: '' },
  })

  const onSubmit = async (data: FormValues) => {
    setError(false)
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: 'ed2be87e-27a6-4304-a90d-a3b5cbb0b22f',
        name: data.name,
        email: data.email,
        service: data.service,
        budget: data.budget ?? 'Not provided',
        message: data.message,
        subject: `New Inquiry — ${data.name}`,
      }),
    })
    if (res.ok) {
      setSubmitted(true)
    } else {
      setError(true)
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <CheckCircle className="mb-6 size-12 text-white/40" />
        <h3 className="text-2xl font-medium">Message Received.</h3>
        <p className="mt-4 max-w-sm text-sm leading-7 text-white/55">
          We&apos;ll review your project details and be in touch within 24–48 business hours.
        </p>
        <button
          onClick={() => {
            setSubmitted(false)
            form.reset()
          }}
          className="mt-8 text-xs uppercase tracking-[0.25em] text-white/40 underline-offset-4 transition hover:text-white hover:underline"
        >
          Send Another
        </button>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs uppercase tracking-[0.2em] text-white/50">
                Name
              </FormLabel>
              <FormControl>
                <Input placeholder="Your name" className={inputClass} {...field} />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs uppercase tracking-[0.2em] text-white/50">
                Email
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  className={inputClass}
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="service"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs uppercase tracking-[0.2em] text-white/50">
                Service
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger
                    className={`${inputClass} data-[placeholder]:text-white/30`}
                  >
                    <SelectValue placeholder="What are you looking for?" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="border-white/15 bg-zinc-950 text-white">
                  <SelectItem value="media">Media Production</SelectItem>
                  <SelectItem value="web">Web Design</SelectItem>
                  <SelectItem value="strategy">Digital Strategy</SelectItem>
                  <SelectItem value="retainer">Monthly Retainer</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="budget"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs uppercase tracking-[0.2em] text-white/50">
                Budget{' '}
                <span className="normal-case tracking-normal text-white/25">(optional)</span>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger
                    className={`${inputClass} data-[placeholder]:text-white/30`}
                  >
                    <SelectValue placeholder="Select a range" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="border-white/15 bg-zinc-950 text-white">
                  <SelectItem value="under-5k">Under $5K</SelectItem>
                  <SelectItem value="5k-10k">$5K – $10K</SelectItem>
                  <SelectItem value="10k-25k">$10K – $25K</SelectItem>
                  <SelectItem value="25k-plus">$25K+</SelectItem>
                  <SelectItem value="not-sure">Not Sure Yet</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs uppercase tracking-[0.2em] text-white/50">
                Message
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about your project..."
                  className={textareaClass}
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        {error && (
          <p className="text-sm text-red-400">Something went wrong. Please try again or email us directly.</p>
        )}
        <button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full rounded-full bg-white py-3 text-xs font-medium uppercase tracking-[0.2em] text-black transition hover:opacity-85 disabled:opacity-50"
        >
          {form.formState.isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </Form>
  )
}
