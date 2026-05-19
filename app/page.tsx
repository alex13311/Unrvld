import Link from 'next/link'
import Image from 'next/image'
import HeroVideo from '@/components/hero-video'

const capabilities = [
  'Videography',
  'Photography',
  'Brand Strategy',
  'AI Systems',
]

const services = [
  {
    number: '01',
    title: 'Videography',
    cta: 'View Work',
    href: '/work',
    body: 'Cinematic car content, personal brand films, and commercial visuals that make your brand impossible to ignore.',
  },
  {
    number: '02',
    title: 'Photography',
    cta: 'View Work',
    href: '/work',
    body: 'High-end imagery for automotive, personal branding, and commercial campaigns.',
  },
  {
    number: '03',
    title: 'Social & Brand Strategy',
    cta: 'Learn More',
    href: '/about',
    body: 'Content strategy, brand positioning, and social management that keeps you consistent, relevant, and ahead.',
  },
  {
    number: '04',
    title: 'AI Systems',
    cta: 'Build With AI',
    href: '/contact',
    body: 'AI-built websites delivered in days, plus custom agents trained on your brand to qualify leads and answer prospects 24/7.',
  },
]

const featured = [
  { title: 'Premium Automotive Reels', category: 'Automotive Videography', image: null, video: '/Reels homepage2.mp4', href: '/work#premium-automotive-reels' },
  { title: 'Mercedes Benz USA Shoot', category: 'Automotive Videography', image: null, video: '/g550 9.mp4', href: '/work#mercedes-benz-usa-shoot' },
  { title: 'Premium Brand Campaign', category: 'Commercial Film', image: null, video: '/copy_D63E6BF3-0FEF-4704-8DD2-1E5821AF1126.mp4', href: '/work' },
  { title: 'High-End Product Shoot', category: 'Photography', image: { src: '/IMG_7778.webp', width: 1800, height: 1200 }, video: null, href: '/work' },
]

export default function HomePage() {
  return (
    <div className="relative min-h-screen">
      {/* Hero */}
      <section className="relative flex min-h-[90vh] items-end overflow-hidden">
        <HeroVideo
          desktopSrc="/copy_D63E6BF3-0FEF-4704-8DD2-1E5821AF1126.mp4"
          mobileSrc="/UNRVLD BACKROUND (1).mp4"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.4)_50%,rgba(0,0,0,0.2)_100%)]" />

        {/* Content */}
        <div className="relative w-full px-6 pb-20 pt-40">
          <div className="mx-auto max-w-7xl">
            <p className="mb-8 text-xs uppercase tracking-[0.4em] text-white/50">
              <span className="text-red-500/80">Beverly Hills</span> // Digital
            </p>
            <h1 className="max-w-4xl text-5xl font-medium leading-[0.9] tracking-tight md:text-7xl lg:text-[6rem]">
              Where Presence
              <br />
              Becomes{' '}
              <span className="bg-gradient-to-br from-red-500 to-red-900 bg-clip-text text-transparent">
                Power.
              </span>
            </h1>
            <p className="mt-10 max-w-lg text-base leading-7 text-white/65 md:text-lg">
              UNRVLD builds premium media, websites, and AI systems for brands
              that want to look sharper, move faster, and command attention.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/work"
                className="rounded-full bg-white px-7 py-3 text-xs font-medium uppercase tracking-[0.2em] text-black transition hover:opacity-85"
              >
                View Work
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-white/30 px-7 py-3 text-xs uppercase tracking-[0.2em] text-white transition hover:border-red-600 hover:bg-red-700 hover:text-white"
              >
                Start Project
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Capability Strip */}
      <section className="border-y border-white/10 py-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-6">
          {capabilities.map((cap, i) => (
            <span key={cap} className="flex items-center gap-8">
              <span className="text-[11px] uppercase tracking-[0.3em] text-white/35">
                {cap}
              </span>
              {i < capabilities.length - 1 && (
                <span className="text-red-700/40">·</span>
              )}
            </span>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <p className="mb-14 text-xs uppercase tracking-[0.4em] text-white/35">
            What We Do
          </p>

          <div className="grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <div key={s.number} className="bg-black p-8 md:p-10">
                <div className="mb-6 h-px w-8 bg-red-600" />
                <p className="text-xs text-white/25">{s.number}</p>
                <h3 className="mt-5 text-2xl font-medium md:text-3xl">{s.title}</h3>
                <p className="mt-5 text-sm leading-7 text-white/55">{s.body}</p>
                <Link
                  href={s.href}
                  className="mt-8 inline-block text-xs uppercase tracking-[0.25em] text-white/70 underline-offset-4 transition hover:text-red-500 hover:underline"
                >
                  {s.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Systems Highlight */}
      <section className="px-6 pb-24 md:pb-32">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-3xl border border-red-900/40 bg-[linear-gradient(135deg,rgba(120,10,30,0.20)_0%,rgba(0,0,0,0.6)_55%,rgba(140,15,35,0.14)_100%)] p-10 md:p-16">
            <div className="pointer-events-none absolute -right-32 -top-32 size-72 rounded-full bg-red-700/20 blur-3xl" />
            <div className="pointer-events-none absolute -left-24 -bottom-24 size-64 rounded-full bg-red-900/20 blur-3xl" />

            <p className="mb-6 text-xs uppercase tracking-[0.4em] text-red-500">
              Now Building // AI Systems
            </p>
            <h2 className="max-w-3xl text-3xl font-medium leading-tight md:text-5xl">
              AI Websites & Custom Agents.
              <br />
              <span className="bg-gradient-to-br from-red-500 to-red-900 bg-clip-text text-transparent">
                Unrivaled
              </span>{' '}
              execution.
            </h2>
            <p className="mt-7 max-w-2xl text-base leading-7 text-white/60 md:text-lg">
              We build AI-powered websites in days — not weeks — and deploy custom agents
              that qualify leads, book calls, and answer prospects on autopilot. Trained on
              your brand, your voice, your offer.
            </p>

            <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] md:grid-cols-2">
              <div className="bg-black/80 p-7">
                <div className="mb-4 h-px w-8 bg-red-600" />
                <h3 className="font-medium">AI-Built Websites</h3>
                <p className="mt-3 text-sm leading-7 text-white/55">
                  Custom premium sites delivered in days. Modern stack, top-tier
                  performance, fully yours to own.
                </p>
              </div>
              <div className="bg-black/80 p-7">
                <div className="mb-4 h-px w-8 bg-red-600" />
                <h3 className="font-medium">Custom AI Agents</h3>
                <p className="mt-3 text-sm leading-7 text-white/55">
                  Brand-trained agents for lead qualification, booking, and
                  always-on client conversations.
                </p>
              </div>
            </div>

            <Link
              href="/contact"
              className="mt-10 inline-flex rounded-full bg-red-700 px-7 py-3 text-xs font-medium uppercase tracking-[0.2em] text-white transition hover:bg-red-600"
            >
              Build With AI
            </Link>
          </div>
        </div>
      </section>

      {/* Portfolio Teaser */}
      <section className="px-6 pb-24 md:pb-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex items-end justify-between gap-6">
            <div>
              <p className="mb-4 text-xs uppercase tracking-[0.4em] text-white/35">
                Selected Work
              </p>
              <h2 className="text-3xl font-medium md:text-5xl">
                Built To Look{' '}
                <span className="bg-gradient-to-br from-red-500 to-red-900 bg-clip-text text-transparent">
                  Untouchable
                </span>
              </h2>
            </div>
            <Link
              href="/work"
              className="hidden shrink-0 text-xs uppercase tracking-[0.25em] text-white/45 transition hover:text-red-500 md:block"
            >
              View All →
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {featured.map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] transition hover:border-red-900/50"
              >
                {item.video ? (
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <video src={item.video} autoPlay muted loop playsInline preload="auto" style={{ pointerEvents: 'none' }} className="h-full w-full object-cover transition group-hover:opacity-90" />
                  </div>
                ) : item.image ? (
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image src={item.image.src} alt={item.title} fill className="object-cover transition group-hover:opacity-90" />
                  </div>
                ) : (
                  <div className="aspect-[16/10] bg-[linear-gradient(135deg,rgba(90,0,0,0.3),rgba(255,255,255,0.02),rgba(0,0,0,0.7))] transition group-hover:opacity-90" />
                )}
                <div className="p-6">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-white/35">
                    {item.category}
                  </p>
                  <h3 className="mt-2 text-xl font-medium transition group-hover:text-white/80">
                    {item.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link
              href="/work"
              className="text-xs uppercase tracking-[0.25em] text-white/45 transition hover:text-red-500"
            >
              View All Work →
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="border-y border-white/10 px-6 py-24 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <div>
            <p className="mb-5 text-xs uppercase tracking-[0.4em] text-white/35">Our Brand</p>
            <h2 className="text-3xl font-medium leading-tight md:text-5xl">
              We Don&apos;t Make Content.
              <br />
              We Build{' '}
              <span className="bg-gradient-to-br from-red-500 to-red-900 bg-clip-text text-transparent">
                Unrivaled
              </span>{' '}
              Presence.
            </h2>
          </div>

          <div>
            <p className="text-base leading-8 text-white/60 md:text-lg">
              UNRVLD is a premium media and digital brand that helps businesses, founders,
              and operators present themselves at a higher level. Through cinematic visuals,
              modern web design, and AI-powered systems, we create assets that strengthen
              perception and turn attention into leverage.
            </p>
            <Link
              href="/about"
              className="mt-7 inline-block text-xs uppercase tracking-[0.25em] text-white/50 transition hover:text-red-500"
            >
              Read Our Story →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-7xl rounded-3xl border border-white/10 bg-[linear-gradient(135deg,rgba(140,15,35,0.18),rgba(255,255,255,0.02))] p-10 md:p-16">
          <p className="mb-6 text-xs uppercase tracking-[0.4em] text-red-500/80">
            Ready To Build?
          </p>
          <h2 className="max-w-3xl text-3xl font-medium leading-tight md:text-6xl">
            If your brand looks average,
            <br />
            it gets treated{' '}
            <span className="bg-gradient-to-br from-red-500 to-red-900 bg-clip-text text-transparent">
              average.
            </span>
          </h2>
          <p className="mt-7 max-w-xl text-base leading-7 text-white/55">
            Whether you need content, a site, or a sharper digital presence — UNRVLD
            builds assets designed to elevate perception and drive serious inquiries.
          </p>
          <Link
            href="/contact"
            className="mt-10 inline-flex rounded-full bg-white px-8 py-3 text-xs font-medium uppercase tracking-[0.2em] text-black transition hover:opacity-85"
          >
            Start Your Project
          </Link>
        </div>
      </section>
    </div>
  )
}
