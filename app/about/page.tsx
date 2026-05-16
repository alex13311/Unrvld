import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About',
  description:
    'UNRVLD is a Beverly Hills-based premium media and digital agency founded by Alex Erwin.',
}

const values = [
  {
    title: 'Precision',
    body: 'Every deliverable is crafted with intention — no filler, no average.',
  },
  {
    title: 'Premium',
    body: 'We raise the standard of what your brand looks like at every touchpoint.',
  },
  {
    title: 'Positioning',
    body: 'Great work means nothing if the market sees you wrong. We fix that.',
  },
]

const milestones = [
  {
    year: '2022',
    title: 'Founded',
    body: 'UNRVLD launched with a focus on cinematic media for premium brands in Los Angeles.',
  },
  {
    year: '2023',
    title: 'Expanded',
    body: 'Added web design and digital strategy to serve founder-led businesses end-to-end.',
  },
  {
    year: '2024',
    title: 'Elevated',
    body: 'Integrated AI-powered content systems and brand workflows for faster, sharper execution.',
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="border-b border-white/10 px-6 pb-20 pt-20 md:pt-28">
        <div className="mx-auto max-w-7xl">
          <p className="mb-6 text-xs uppercase tracking-[0.4em] text-white/35">
            Beverly Hills // Digital
          </p>
          <h1 className="max-w-4xl text-4xl font-medium leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            We Build Presence,
            <br />
            Not Content.
          </h1>
          <p className="mt-10 max-w-2xl text-base leading-8 text-white/60 md:text-lg">
            UNRVLD is a Beverly Hills-based creative agency that helps ambitious brands look
            as powerful as they are. We specialize in media, web, and strategy — the three
            pillars that define how the world sees you.
          </p>
        </div>
      </section>

      {/* Mission + Values */}
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <p className="mb-14 text-xs uppercase tracking-[0.4em] text-white/35">
            Our Mission
          </p>
          <div className="grid gap-16 md:grid-cols-2">
            <div className="space-y-6">
              <p className="text-base leading-8 text-white/60 md:text-lg">
                Most brands are producing content without a real strategy. They invest in
                shoots that don&apos;t move the needle, websites that look generic, and social
                content that blends in. UNRVLD exists to solve that.
              </p>
              <p className="text-base leading-8 text-white/60 md:text-lg">
                We work with founders, businesses, and emerging brands that are serious about
                how they present themselves — and ready to operate at a level that commands
                respect.
              </p>
            </div>

            <div className="space-y-10">
              {values.map((v) => (
                <div key={v.title}>
                  <div className="mb-5 h-px w-8 bg-red-800/70" />
                  <h3 className="text-lg font-medium">{v.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-white/50">{v.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Story Timeline */}
      <section className="border-y border-white/10 px-6 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <p className="mb-5 text-xs uppercase tracking-[0.4em] text-white/35">The Story</p>
          <h2 className="mb-16 text-3xl font-medium md:text-5xl">
            Built From the Ground Up
          </h2>

          <div className="space-y-0">
            {milestones.map((m, i) => (
              <div
                key={m.year}
                className={`flex gap-10 border-t border-white/10 py-10 ${
                  i === milestones.length - 1 ? 'border-b' : ''
                }`}
              >
                <span className="w-14 shrink-0 pt-0.5 text-sm tabular-nums text-white/25">
                  {m.year}
                </span>
                <div>
                  <h3 className="font-medium">{m.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-white/50">{m.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* CTA */}
      <section className="border-t border-white/10 px-6 py-20 text-center">
        <p className="mb-5 text-xs uppercase tracking-[0.4em] text-white/35">
          Let&apos;s Build
        </p>
        <h2 className="text-3xl font-medium md:text-5xl">Ready to Work With Us?</h2>
        <p className="mx-auto mt-7 max-w-md text-base leading-7 text-white/55">
          We work with a limited number of clients each quarter to ensure every project gets
          the focus it deserves.
        </p>
        <Link
          href="/contact"
          className="mt-10 inline-flex rounded-full bg-white px-8 py-3 text-xs font-medium uppercase tracking-[0.2em] text-black transition hover:opacity-85"
        >
          Get In Touch
        </Link>
      </section>
    </div>
  )
}
