import Link from 'next/link'

const capabilities = [
  'Videography',
  'Photography',
  'Web Design',
  'AI Tools',
  'Media Strategy',
  'Creative Direction',
]

const services = [
  {
    number: '01',
    title: 'Media',
    cta: 'View Work',
    href: '/work',
    body: 'Cinematic visuals, social-first reels, and premium content built to make brands look expensive.',
  },
  {
    number: '02',
    title: 'Web',
    cta: 'See Services',
    href: '/work',
    body: 'Modern websites designed to position your brand properly and convert attention into inquiries.',
  },
  {
    number: '03',
    title: 'Strategy',
    cta: 'Learn More',
    href: '/about',
    body: 'AI workflows, creative systems, and digital positioning that help brands move faster and operate sharper.',
  },
]

const featured = [
  { title: 'Luxury Automotive Campaign', category: 'Cinematic Reel' },
  { title: 'Premium Brand Website', category: 'Web Design' },
  { title: 'Founder Personal Brand Launch', category: 'Media Strategy' },
  { title: 'High-End Product Shoot', category: 'Photography' },
]

export default function HomePage() {
  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(100,0,0,0.18),transparent_55%)]" />

      {/* Hero */}
      <section className="relative flex min-h-[90vh] items-end overflow-hidden">
        {/* Desktop video (landscape) */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 hidden h-full w-full object-cover md:block"
        >
          <source src="/copy_D63E6BF3-0FEF-4704-8DD2-1E5821AF1126.mov" type="video/mp4" />
          <source src="/copy_D63E6BF3-0FEF-4704-8DD2-1E5821AF1126.mov" type="video/quicktime" />
        </video>

        {/* Mobile video (vertical) */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 block h-full w-full object-cover md:hidden"
        >
          <source src="/copy_88BA4376-9531-4C22-B01D-7521382366F6.mov" type="video/mp4" />
          <source src="/copy_88BA4376-9531-4C22-B01D-7521382366F6.mov" type="video/quicktime" />
        </video>
        {/* Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.4)_50%,rgba(0,0,0,0.2)_100%)]" />

        {/* Content */}
        <div className="relative w-full px-6 pb-20 pt-40">
          <div className="mx-auto max-w-7xl">
            <p className="mb-8 text-xs uppercase tracking-[0.4em] text-white/50">
              Beverly Hills // Digital
            </p>
            <h1 className="max-w-4xl text-5xl font-medium leading-[0.9] tracking-tight md:text-7xl lg:text-[6rem]">
              Where Presence
              <br />
              Becomes Power.
            </h1>
            <p className="mt-10 max-w-lg text-base leading-7 text-white/65 md:text-lg">
              UNRVLD builds premium media, websites, and digital systems for brands
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
                className="rounded-full border border-white/30 px-7 py-3 text-xs uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-black"
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
                <span className="text-white/15">·</span>
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

          <div className="grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] md:grid-cols-3">
            {services.map((s) => (
              <div key={s.number} className="bg-black p-8 md:p-10">
                <div className="mb-6 h-px w-8 bg-red-800/70" />
                <p className="text-xs text-white/25">{s.number}</p>
                <h3 className="mt-5 text-3xl font-medium">{s.title}</h3>
                <p className="mt-5 text-sm leading-7 text-white/55">{s.body}</p>
                <Link
                  href={s.href}
                  className="mt-8 inline-block text-xs uppercase tracking-[0.25em] text-white/70 underline-offset-4 transition hover:text-white hover:underline"
                >
                  {s.cta}
                </Link>
              </div>
            ))}
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
                Built To Look Untouchable
              </h2>
            </div>
            <Link
              href="/work"
              className="hidden shrink-0 text-xs uppercase tracking-[0.25em] text-white/45 transition hover:text-white md:block"
            >
              View All →
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {featured.map((item, i) => (
              <Link
                key={i}
                href="/work"
                className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] transition hover:border-white/20"
              >
                <div className="aspect-[16/10] bg-[linear-gradient(135deg,rgba(90,0,0,0.3),rgba(255,255,255,0.02),rgba(0,0,0,0.7))] transition group-hover:opacity-90" />
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
              className="text-xs uppercase tracking-[0.25em] text-white/45 transition hover:text-white"
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
              We Build Presence.
            </h2>
          </div>

          <div>
            <p className="text-base leading-8 text-white/60 md:text-lg">
              UNRVLD is a premium media and digital brand that helps businesses, founders,
              and operators present themselves at a higher level. Through cinematic visuals,
              modern web design, and strategic systems, we create assets that strengthen
              perception and turn attention into leverage.
            </p>
            <Link
              href="/about"
              className="mt-7 inline-block text-xs uppercase tracking-[0.25em] text-white/50 transition hover:text-white"
            >
              Read Our Story →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-7xl rounded-3xl border border-white/10 bg-[linear-gradient(135deg,rgba(100,0,0,0.15),rgba(255,255,255,0.03))] p-10 md:p-16">
          <p className="mb-6 text-xs uppercase tracking-[0.4em] text-white/35">
            Ready To Build?
          </p>
          <h2 className="max-w-3xl text-3xl font-medium leading-tight md:text-6xl">
            If your brand looks average,
            <br />
            it gets treated average.
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
