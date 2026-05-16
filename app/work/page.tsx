import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Work',
  description: 'Selected work from UNRVLD — videography, photography, and brand strategy.',
}

const videographySections = [
  {
    title: 'Premium Automotive',
    tagline: 'Cinematic car content engineered to generate leads and stop the scroll.',
    videos: [
      { mobileSrc: '/Diablo UNRVLD (1).mp4', desktopSrc: null },
      { mobileSrc: '/copy_198A9F6B-1AE5-4ECF-81BE-38850451BF73 (1).mov', desktopSrc: null },
      { mobileSrc: '/iceman 2 (1).mp4', desktopSrc: null },
    ],
  },
  {
    title: 'Personal Branding',
    tagline: 'High-impact content that positions you as the authority in your space.',
    videos: [null, null, null],
  },
  {
    title: 'Brand & Commercial Films',
    tagline: 'Story-driven visuals built to make your brand unforgettable.',
    videos: [null, null, null],
  },
]

export default function WorkPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="border-b border-white/10 px-6 pb-16 pt-20 md:pt-28">
        <div className="mx-auto max-w-7xl">
          <p className="mb-6 text-xs uppercase tracking-[0.4em] text-white/35">
            Selected Work
          </p>
          <h1 className="max-w-3xl text-4xl font-medium leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            Built To Look
            <br />
            Untouchable.
          </h1>
          <p className="mt-8 max-w-xl text-base leading-7 text-white/55">
            Premium visual content for brands that refuse to blend in.
          </p>
        </div>
      </section>

      {/* Videography */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="mb-2 text-xs uppercase tracking-[0.4em] text-white/35">01</p>
          <h2 className="mb-16 text-3xl font-medium md:text-5xl">Videography</h2>

          <div className="space-y-20">
            {videographySections.map((section) => (
              <div key={section.title}>
                <div className="mb-8 border-t border-white/10 pt-8">
                  <h3 className="text-xl font-medium">{section.title}</h3>
                  <p className="mt-2 max-w-lg text-sm leading-6 text-white/45">
                    {section.tagline}
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {section.videos.map((video, i) =>
                    video ? (
                      <div key={i} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
                        {/* Mobile */}
                        {video.mobileSrc ? (
                          <div className="relative aspect-[9/16] w-full overflow-hidden md:hidden">
                            <video
                              src={video.mobileSrc}
                              autoPlay muted loop playsInline preload="auto"
                              style={{ pointerEvents: 'none' }}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex aspect-[9/16] items-center justify-center md:hidden">
                            <p className="text-xs uppercase tracking-[0.25em] text-white/20">Coming Soon</p>
                          </div>
                        )}
                        {/* Desktop */}
                        {video.desktopSrc ? (
                          <div className="relative hidden aspect-video w-full overflow-hidden md:block">
                            <video
                              src={video.desktopSrc}
                              autoPlay muted loop playsInline preload="auto"
                              style={{ pointerEvents: 'none' }}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="hidden md:flex aspect-video items-center justify-center">
                            <p className="text-xs uppercase tracking-[0.25em] text-white/20">Coming Soon</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div
                        key={i}
                        className="flex aspect-video items-center justify-center overflow-hidden rounded-2xl border border-dashed border-white/10 bg-white/[0.01]"
                      >
                        <p className="text-xs uppercase tracking-[0.25em] text-white/20">
                          Coming Soon
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photography */}
      <section className="border-t border-white/10 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="mb-2 text-xs uppercase tracking-[0.4em] text-white/35">02</p>
          <h2 className="mb-4 text-3xl font-medium md:text-5xl">Photography</h2>
          <p className="mb-16 max-w-lg text-sm leading-6 text-white/45">
            High-end imagery that makes your brand impossible to ignore.
          </p>

          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`mb-5 flex break-inside-avoid items-center justify-center overflow-hidden rounded-2xl border border-dashed border-white/10 bg-white/[0.01] ${
                  i % 3 === 1 ? 'aspect-[3/4]' : 'aspect-[4/3]'
                }`}
              >
                <p className="text-xs uppercase tracking-[0.25em] text-white/20">
                  Coming Soon
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media & Strategy */}
      <section className="border-t border-white/10 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="mb-2 text-xs uppercase tracking-[0.4em] text-white/35">03</p>
          <h2 className="mb-4 text-3xl font-medium md:text-5xl">
            Social Media & Brand Strategy
          </h2>
          <p className="max-w-xl text-sm leading-7 text-white/45">
            We build the system behind your brand — content calendars, positioning,
            and strategy that keeps you consistent, relevant, and ahead.
          </p>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              {
                title: 'Content Strategy',
                body: 'A clear plan for what to post, when, and why — built around your goals.',
              },
              {
                title: 'Brand Positioning',
                body: 'Define how you show up in the market and why clients choose you over anyone else.',
              },
              {
                title: 'Social Management',
                body: 'We handle the execution so you stay focused on running your business.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-7"
              >
                <div className="mb-5 h-px w-8 bg-red-800/70" />
                <h3 className="font-medium">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/45">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10 px-6 py-20 text-center">
        <p className="mb-5 text-xs uppercase tracking-[0.4em] text-white/35">
          Ready to Create?
        </p>
        <h2 className="text-3xl font-medium md:text-4xl">Let&apos;s Build Something Premium</h2>
        <Link
          href="/contact"
          className="mt-8 inline-flex rounded-full bg-white px-8 py-3 text-xs font-medium uppercase tracking-[0.2em] text-black transition hover:opacity-85"
        >
          Start a Project
        </Link>
      </section>
    </div>
  )
}
