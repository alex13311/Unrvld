// app/page.tsx
import React from "react";

const brands = [
  "VIDEOGRAPHY",
  "PHOTOGRAPHY",
  "WEB DESIGN",
  "AI TOOLS",
  "MEDIA STRATEGY",
  "CREATIVE DIRECTION",
];

const features = [
  {
    number: "01",
    title: "Media",
    cta: "View Work",
    href: "#work",
    text: "Cinematic visuals, social-first reels, and premium content built to make brands look expensive.",
  },
  {
    number: "02",
    title: "Web",
    cta: "See Services",
    href: "#services",
    text: "Modern websites designed to position your brand properly and convert attention into inquiries.",
  },
  {
    number: "03",
    title: "Strategy",
    cta: "Learn More",
    href: "#brand",
    text: "AI workflows, creative systems, and digital positioning that help brands move faster and operate sharper.",
  },
];

const portfolio = [
  {
    title: "Luxury Automotive Campaign",
    category: "Cinematic Reel",
  },
  {
    title: "Premium Brand Website",
    category: "Web Design",
  },
  {
    title: "Founder Personal Brand Launch",
    category: "Media Strategy",
  },
  {
    title: "High-End Product Shoot",
    category: "Photography",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(120,0,0,0.22),transparent_35%),linear-gradient(to_bottom,#090909,#000)]" />

      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="#" className="text-lg font-semibold tracking-[0.35em]">
            UNRVLD
          </a>

          <nav className="hidden gap-8 text-sm uppercase tracking-[0.2em] md:flex">
            <a href="#services" className="text-white/80 transition hover:text-white">
              Services
            </a>
            <a href="#work" className="text-white/80 transition hover:text-white">
              Work
            </a>
            <a href="#brand" className="text-white/80 transition hover:text-white">
              Our Brand
            </a>
            <a href="#contact" className="text-white/80 transition hover:text-white">
              Contact
            </a>
          </nav>

          <a
            href="#contact"
            className="rounded-full border border-white/20 px-5 py-2 text-xs uppercase tracking-[0.2em] text-white transition hover:border-white hover:bg-white hover:text-black"
          >
            Book a Call
          </a>
        </div>
      </header>

      <section className="relative overflow-hidden px-6 pb-24 pt-20 md:pb-32 md:pt-28">
        <div className="mx-auto grid max-w-7xl gap-14 md:grid-cols-[1.2fr_0.8fr] md:items-end">
          <div>
            <p className="mb-6 text-xs uppercase tracking-[0.35em] text-white/45">
              Los Angeles / Digital
            </p>

            <h1 className="max-w-4xl text-5xl font-medium leading-[0.92] tracking-tight md:text-7xl lg:text-[6.5rem]">
              Where Presence
              <br />
              Becomes Power.
            </h1>

            <p className="mt-8 max-w-xl text-base leading-7 text-white/70 md:text-lg">
              UNRVLD builds premium media, websites, and digital systems for brands
              that want to look sharper, move faster, and command attention.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#work"
                className="rounded-full bg-white px-6 py-3 text-sm font-medium uppercase tracking-[0.18em] text-black transition hover:opacity-90"
              >
                View Work
              </a>
              <a
                href="#contact"
                className="rounded-full border border-white/20 px-6 py-3 text-sm uppercase tracking-[0.18em] text-white transition hover:border-white hover:bg-white hover:text-black"
              >
                Start Project
              </a>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end">
            <div className="aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
              <div className="flex h-full items-end bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.08))] p-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-white/45">
                    UNRVLD Standard
                  </p>
                  <p className="mt-3 max-w-xs text-sm leading-6 text-white/75">
                    Built for brands that do not want to look average.
                  </p>
                </div>
              </div>
            </div>

            <span className="mt-5 text-xs uppercase tracking-[0.3em] text-white/35">
              Scroll
            </span>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 py-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-6">
          {brands.map((brand) => (
            <span
              key={brand}
              className="text-sm uppercase tracking-[0.3em] text-white/40"
            >
              {brand}
            </span>
          ))}
        </div>
      </section>

      <section id="services" className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="mb-12 text-xs uppercase tracking-[0.35em] text-white/40">
            What We Do
          </p>

          <div className="grid gap-px overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 md:grid-cols-3">
            {features.map((item) => (
              <div key={item.number} className="bg-black p-8 md:p-10">
                <div className="text-sm text-white/35">{item.number}</div>
                <h3 className="mt-6 text-3xl font-medium">{item.title}</h3>
                <p className="mt-5 max-w-sm text-sm leading-7 text-white/65">
                  {item.text}
                </p>
                <a
                  href={item.href}
                  className="mt-8 inline-block text-sm uppercase tracking-[0.2em] text-white underline-offset-4 hover:underline"
                >
                  {item.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="work" className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex items-end justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-white/40">
                Selected Work
              </p>
              <h2 className="mt-4 text-3xl font-medium md:text-5xl">
                Built To Look Untouchable
              </h2>
            </div>
            <a
              href="#contact"
              className="hidden text-sm uppercase tracking-[0.2em] text-white/70 md:block"
            >
              Let’s Work
            </a>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {portfolio.map((item, idx) => (
              <div
                key={`${item.title}-${idx}`}
                className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03]"
              >
                <div className="aspect-[16/10] bg-[linear-gradient(135deg,rgba(110,0,0,0.28),rgba(255,255,255,0.03),rgba(0,0,0,0.8))]" />
                <div className="p-6">
                  <p className="text-xs uppercase tracking-[0.25em] text-white/40">
                    {item.category}
                  </p>
                  <h3 className="mt-3 text-2xl font-medium transition group-hover:text-white/80">
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="brand"
        className="border-y border-white/10 px-6 py-20 md:py-28"
      >
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-white/40">
              Our Brand
            </p>
            <h2 className="mt-4 text-3xl font-medium md:text-5xl">
              We Don’t Make Content.
              <br />
              We Build Presence.
            </h2>
          </div>

          <div className="max-w-2xl text-base leading-8 text-white/70 md:text-lg">
            UNRVLD is a premium media and digital brand focused on helping businesses,
            founders, and operators present themselves at a higher level. Through
            cinematic visuals, modern web design, and strategic systems, we create
            assets that strengthen perception and turn attention into leverage.
          </div>
        </div>
      </section>

      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(120,0,0,0.18),rgba(255,255,255,0.04))] p-8 md:p-14">
          <p className="text-xs uppercase tracking-[0.35em] text-white/40">
            Ready To Build?
          </p>
          <h2 className="mt-5 max-w-4xl text-3xl font-medium leading-tight md:text-6xl">
            If your brand looks average,
            <br />
            it gets treated average.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/70">
            Whether you need content, a site, or a sharper digital presence, UNRVLD
            builds assets designed to elevate perception and drive serious inquiries.
          </p>
          <a
            href="#contact"
            className="mt-10 inline-flex rounded-full bg-white px-7 py-3 text-sm font-medium uppercase tracking-[0.18em] text-black transition hover:opacity-90"
          >
            Start Your Project
          </a>
        </div>
      </section>

      <footer
        id="contact"
        className="border-t border-white/10 px-6 py-14 text-sm text-white/65"
      >
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-4">
          <div>
            <div className="text-lg font-semibold tracking-[0.35em] text-white">
              UNRVLD
            </div>
            <p className="mt-4 max-w-xs leading-7 text-white/55">
              Media. Design. Strategy.
            </p>
          </div>

          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.25em] text-white/40">
              Quick Nav
            </p>
            <div className="space-y-3">
              <a href="#services" className="block hover:text-white">
                Services
              </a>
              <a href="#work" className="block hover:text-white">
                Work
              </a>
              <a href="#brand" className="block hover:text-white">
                Our Brand
              </a>
            </div>
          </div>

          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.25em] text-white/40">
              Contact
            </p>
            <div className="space-y-3">
              <a href="mailto:hello@unrvldgroup.com" className="block hover:text-white">
                hello@unrvldgroup.com
              </a>
              <a href="https://instagram.com/unrvldgroup" className="block hover:text-white">
                @unrvldgroup
              </a>
            </div>
          </div>

          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.25em] text-white/40">
              Serious Inquiries
            </p>
            <p className="leading-7 text-white/55">
              Use the contact form or email directly to discuss media, websites,
              strategy, or custom retainers.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}