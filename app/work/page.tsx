import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Work',
  description: 'Selected projects from UNRVLD — videography, photography, web design, and strategy.',
}

type Category = 'Videography' | 'Photography' | 'Web Design' | 'Strategy'
type Orientation = 'landscape' | 'portrait'

interface Project {
  title: string
  category: Category
  year: string
  desc: string
  orientation: Orientation
}

const projects: Project[] = [
  {
    title: 'Luxury Automotive Campaign',
    category: 'Videography',
    year: '2024',
    desc: 'Cinematic brand film for a high-end Beverly Hills dealership.',
    orientation: 'landscape',
  },
  {
    title: 'Executive Portrait Series',
    category: 'Photography',
    year: '2024',
    desc: 'Editorial portraits for a founder preparing a public-facing rebrand.',
    orientation: 'portrait',
  },
  {
    title: 'Premium Brand Website',
    category: 'Web Design',
    year: '2024',
    desc: 'Full brand identity site for a boutique consulting firm.',
    orientation: 'landscape',
  },
  {
    title: 'Founder Personal Brand Launch',
    category: 'Strategy',
    year: '2024',
    desc: 'End-to-end brand positioning and digital launch campaign.',
    orientation: 'landscape',
  },
  {
    title: 'Lifestyle Brand Editorial',
    category: 'Photography',
    year: '2023',
    desc: 'Aspirational editorial campaign for a premium wellness brand.',
    orientation: 'portrait',
  },
  {
    title: 'Restaurant Brand Identity Film',
    category: 'Videography',
    year: '2023',
    desc: 'Identity film for an upscale Beverly Hills dining concept.',
    orientation: 'landscape',
  },
  {
    title: 'E-Commerce Platform Redesign',
    category: 'Web Design',
    year: '2023',
    desc: 'Full redesign of a premium retail storefront with conversion focus.',
    orientation: 'landscape',
  },
  {
    title: 'Real Estate Developer Campaign',
    category: 'Photography',
    year: '2024',
    desc: 'Property campaign visuals for a luxury residential development.',
    orientation: 'landscape',
  },
  {
    title: 'AI Content Strategy System',
    category: 'Strategy',
    year: '2024',
    desc: 'Custom content workflow built with AI automation for a media brand.',
    orientation: 'landscape',
  },
  {
    title: 'Fashion Campaign Cinematics',
    category: 'Videography',
    year: '2023',
    desc: 'Campaign visuals and BTS content for a luxury clothing brand.',
    orientation: 'portrait',
  },
  {
    title: 'SaaS Product Launch Site',
    category: 'Web Design',
    year: '2024',
    desc: 'Conversion-focused launch site for a B2B SaaS platform.',
    orientation: 'landscape',
  },
  {
    title: 'Executive Personal Brand',
    category: 'Strategy',
    year: '2024',
    desc: 'Social and media strategy for a C-suite executive going public.',
    orientation: 'landscape',
  },
]

const categoryGradients: Record<Category, string> = {
  Videography: 'from-red-950/60 to-zinc-950',
  Photography: 'from-zinc-800/50 to-zinc-950',
  'Web Design': 'from-blue-950/50 to-zinc-950',
  Strategy: 'from-violet-950/50 to-zinc-950',
}

const filters: Array<{ label: string; value: string }> = [
  { label: 'All', value: 'all' },
  { label: 'Videography', value: 'Videography' },
  { label: 'Photography', value: 'Photography' },
  { label: 'Web Design', value: 'Web Design' },
  { label: 'Strategy', value: 'Strategy' },
]

interface WorkPageProps {
  searchParams: Promise<{ category?: string }>
}

export default async function WorkPage({ searchParams }: WorkPageProps) {
  const params = await searchParams
  const activeCategory = params.category ?? 'all'

  const filtered =
    activeCategory === 'all'
      ? projects
      : projects.filter((p) => p.category === activeCategory)

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
            Campaigns, websites, and brand systems for clients who don&apos;t accept average.
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="border-b border-white/10 px-6 py-6">
        <div className="mx-auto flex max-w-7xl flex-wrap gap-3">
          {filters.map((f) => {
            const isActive = activeCategory === f.value
            return (
              <Link
                key={f.value}
                href={f.value === 'all' ? '/work' : `/work?category=${encodeURIComponent(f.value)}`}
                className={`rounded-full border px-5 py-2 text-[11px] uppercase tracking-[0.2em] transition ${
                  isActive
                    ? 'border-white bg-white text-black'
                    : 'border-white/20 text-white/55 hover:border-white/50 hover:text-white'
                }`}
              >
                {f.label}
              </Link>
            )
          })}
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="px-6 py-12 pb-28">
        <div className="mx-auto max-w-7xl">
          {filtered.length === 0 ? (
            <p className="py-20 text-center text-sm text-white/40">No projects found.</p>
          ) : (
            <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
              {filtered.map((project, i) => (
                <div
                  key={i}
                  className="group mb-5 break-inside-avoid overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition hover:border-white/20"
                >
                  {/* Image container — portrait/landscape aware */}
                  <div
                    className={`relative w-full overflow-hidden ${
                      project.orientation === 'portrait'
                        ? 'aspect-[3/4]'
                        : 'aspect-[4/3]'
                    }`}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-b ${categoryGradients[project.category]} transition group-hover:opacity-80`}
                    />
                    <div className="absolute left-4 top-4">
                      <span className="rounded-full border border-white/15 bg-black/40 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/60 backdrop-blur-sm">
                        {project.category}
                      </span>
                    </div>
                  </div>

                  {/* Card Info */}
                  <div className="p-5">
                    <h3 className="font-medium leading-snug">{project.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/45">{project.desc}</p>
                    <p className="mt-3 text-[11px] tabular-nums text-white/25">{project.year}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10 px-6 py-20 text-center">
        <p className="mb-5 text-xs uppercase tracking-[0.4em] text-white/35">
          Have a Project?
        </p>
        <h2 className="text-3xl font-medium md:text-4xl">Let&apos;s Talk</h2>
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
