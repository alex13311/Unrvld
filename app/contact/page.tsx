import type { Metadata } from 'next'
import { Mail, MapPin, Instagram } from 'lucide-react'
import ContactForm from '@/components/contact-form'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with UNRVLD — premium media, web design, and digital strategy based in Beverly Hills.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-16 md:grid-cols-[1fr_1.2fr]">
          {/* Left — Info */}
          <div>
            <p className="mb-6 text-xs uppercase tracking-[0.4em] text-red-500/80">
              Get In Touch
            </p>
            <h1 className="text-4xl font-medium leading-tight md:text-5xl lg:text-6xl">
              Let&apos;s Build
              <br />
              Something{' '}
              <span className="bg-gradient-to-br from-red-500 to-red-900 bg-clip-text text-transparent">
                Unrivaled.
              </span>
            </h1>
            <p className="mt-8 max-w-sm text-base leading-7 text-white/55">
              Tell us about your project. We review every inquiry and respond within
              24–48 business hours.
            </p>

            <div className="mt-14 space-y-6">
              <a
                href="mailto:unrvldllc@gmail.com"
                className="flex items-center gap-4 text-sm text-white/55 transition hover:text-white"
              >
                <Mail className="size-4 shrink-0 text-white/30" />
                unrvldllc@gmail.com
              </a>
              <a
                href="mailto:alex@unrvldgroup.com"
                className="flex items-center gap-4 text-sm text-white/55 transition hover:text-white"
              >
                <Mail className="size-4 shrink-0 text-white/30" />
                alex@unrvldgroup.com
              </a>
              <a
                href="https://instagram.com/unrvldproductions"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 text-sm text-white/55 transition hover:text-white"
              >
                <Instagram className="size-4 shrink-0 text-white/30" />
                @unrvldproductions
              </a>
              <div className="flex items-center gap-4 text-sm text-white/35">
                <MapPin className="size-4 shrink-0 text-white/20" />
                Beverly Hills // CA
              </div>
            </div>

            <div className="mt-14 border-t border-white/10 pt-10">
              <p className="text-xs uppercase tracking-[0.25em] text-white/25">
                Response Time
              </p>
              <p className="mt-3 text-sm text-white/45">
                We respond within 24–48 hours on business days.
              </p>
            </div>
          </div>

          {/* Right — Form */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 md:p-10">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  )
}
