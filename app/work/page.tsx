import type { Metadata } from 'next'
import Image from 'next/image'
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
    title: 'Premium Brand Campaign',
    tagline: 'Story-driven visuals built to make your brand unforgettable.',
    landscape: true,
    videos: [
      { mobileSrc: '/copy_D63E6BF3-0FEF-4704-8DD2-1E5821AF1126.mp4', desktopSrc: '/copy_D63E6BF3-0FEF-4704-8DD2-1E5821AF1126.mp4' },
      null,
      null,
    ],
  },
  {
    title: 'Mercedes Benz USA Shoot',
    tagline: 'Cinematic automotive content for one of the most iconic brands in the world.',
    landscape: true,
    videos: [
      { mobileSrc: '/g550 9.mp4', desktopSrc: '/g550 9.mp4' },
      { mobileSrc: '/g51.mp4', desktopSrc: '/g51.mp4' },
      { mobileSrc: '/g52.mp4', desktopSrc: '/g52.mp4' },
    ],
  },
]

const photos = [
  { src: '/IMG_7774.jpeg', width: 1206, height: 1592 },
  { src: '/IMG_7775.jpeg', width: 1187, height: 1584 },
  { src: '/IMG_7776.jpeg', width: 1186, height: 1596 },
  { src: '/IMG_7778.webp', width: 1800, height: 1200 },
  { src: '/911gts1.webp', width: 1800, height: 1012 },
  { src: '/g63lawn.webp', width: 1800, height: 1202 },
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
                          <div className={`relative w-full overflow-hidden md:hidden ${section.landscape ? 'aspect-video' : 'aspect-[9/16]'}`}>
                            <video
                              src={video.mobileSrc}
                              autoPlay muted loop playsInline preload="auto"
                              style={{ pointerEvents: 'none' }}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className={`flex items-center justify-center md:hidden ${section.landscape ? 'aspect-video' : 'aspect-[9/16]'}`}>
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

          <div className="columns-1 gap-5 sm:columns-2">
            {photos.map((photo) => (
              <div key={photo.src} className="mb-5 break-inside-avoid overflow-hidden rounded-2xl">
                <Image
                  src={photo.src}
                  alt="UNRVLD Photography"
                  width={photo.width}
                  height={photo.height}
                  className="w-full h-auto"
                />
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
