import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About',
  description:
    'UNRVLD is a Beverly Hills-based high-tech creative agency engineering unrivaled media, web, and AI systems for premium brands.',
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

const pillars = [
  {
    title: 'Highest-Tier Craft',
    body: 'Cinematic media, premium web design, and brand systems engineered at the same level as the brands we build for.',
  },
  {
    title: 'High-Tech Execution',
    body: 'AI agents, automated workflows, and modern tooling let us move faster and deliver sharper than legacy agencies.',
  },
  {
    title: 'Built to Command',
    body: 'Every asset is engineered to elevate perception, drive inquiries, and turn presence into market leverage.',
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="border-b border-white/10 px-6 pb-20 pt-20 md:pt-28">
        <div className="mx-auto max-w-7xl">
          <p className="mb-6 text-xs uppercase tracking-[0.4em] text-red-500/80">
            Beverly Hills // Digital
          </p>
          <h1 className="max-w-4xl text-4xl font-medium leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            <span className="bg-gradient-to-br from-red-500 to-red-900 bg-clip-text text-transparent">
              Unrivaled.
            </span>
            <br />
            By Design.
          </h1>
          <p className="mt-10 max-w-2xl text-base leading-8 text-white/60 md:text-lg">
            UNRVLD is a high-tech creative agency engineering the visual presence,
            digital infrastructure, and AI systems that separate the elite from the
            average. We exist to make our clients impossible to compete with.
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
                Most brands settle. They invest in shoots that don&apos;t move the needle,
                websites that look generic, and digital systems built on yesterday&apos;s
                tools. UNRVLD exists to operate at a different standard.
              </p>
              <p className="text-base leading-8 text-white/60 md:text-lg">
                We work with founders, operators, and brands serious about how they
                present themselves — and ready to compete at the level the world&apos;s top
                names compete at.
              </p>
            </div>

            <div className="space-y-10">
              {values.map((v) => (
                <div key={v.title}>
                  <div className="mb-5 h-px w-8 bg-red-600" />
                  <h3 className="text-lg font-medium">{v.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-white/50">{v.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The Standard */}
      <section className="border-y border-white/10 px-6 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <p className="mb-6 text-xs uppercase tracking-[0.4em] text-red-500/80">
            The Standard
          </p>
          <h2 className="max-w-4xl text-3xl font-medium leading-tight md:text-5xl">
            Built to be{' '}
            <span className="bg-gradient-to-br from-red-500 to-red-900 bg-clip-text text-transparent">
              Unrivaled
            </span>{' '}
            — in craft, in tech, in result.
          </h2>

          <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] md:grid-cols-3">
            {pillars.map((p) => (
              <div key={p.title} className="bg-black p-8 md:p-10">
                <div className="mb-6 h-px w-8 bg-red-600" />
                <h3 className="text-xl font-medium">{p.title}</h3>
                <p className="mt-4 text-sm leading-7 text-white/55">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <p className="mb-10 text-xs uppercase tracking-[0.4em] text-white/35">
            Founder
          </p>
          <div className="grid gap-10 md:grid-cols-[1fr_2fr] md:items-end">
            <div>
              <div className="mb-5 h-px w-8 bg-red-600" />
              <h3 className="text-2xl font-medium md:text-3xl">Alex Erwin</h3>
              <p className="mt-2 text-xs uppercase tracking-[0.25em] text-white/45">
                Founder · Creative Director
              </p>
            </div>
            <p className="text-base leading-8 text-white/55 md:text-lg">
              UNRVLD was founded in Beverly Hills on a single conviction: brands that
              want to operate at the top need a partner who already operates there.
              Every project, deliverable, and system we ship is built around that
              standard.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10 px-6 py-20 text-center">
        <p className="mb-5 text-xs uppercase tracking-[0.4em] text-red-500/80">
          Let&apos;s Build
        </p>
        <h2 className="text-3xl font-medium md:text-5xl">Ready to Work With Us?</h2>
        <p className="mx-auto mt-7 max-w-md text-base leading-7 text-white/55">
          We take on a limited number of clients each quarter to ensure every project
          gets the focus it deserves.
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
