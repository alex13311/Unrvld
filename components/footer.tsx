import Link from 'next/link'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/work', label: 'Work' },
  { href: '/contact', label: 'Contact' },
]

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black px-6 py-14 text-sm text-white/55">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-4">
        <div>
          <Link href="/" className="text-base font-semibold tracking-[0.35em] text-white">
            UNRVLD
          </Link>
          <p className="mt-4 leading-7">Media. Design. AI.</p>
          <p className="mt-1 text-xs text-white/30">Beverly Hills // CA</p>
        </div>

        <div>
          <p className="mb-5 text-xs uppercase tracking-[0.25em] text-white/35">Navigate</p>
          <div className="space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-5 text-xs uppercase tracking-[0.25em] text-white/35">Contact</p>
          <div className="space-y-3">
            <a href="mailto:unrvldllc@gmail.com" className="block transition-colors hover:text-white">
              unrvldllc@gmail.com
            </a>
            <a href="mailto:alex@unrvldgroup.com" className="block transition-colors hover:text-white">
              alex@unrvldgroup.com
            </a>
            <a
              href="https://instagram.com/unrvldproductions"
              target="_blank"
              rel="noopener noreferrer"
              className="block transition-colors hover:text-white"
            >
              @unrvldproductions
            </a>
          </div>
        </div>

        <div>
          <p className="mb-5 text-xs uppercase tracking-[0.25em] text-white/35">
            Serious Inquiries
          </p>
          <p className="leading-7">
            Ready to elevate your brand? Let&apos;s build something that commands attention.
          </p>
          <Link
            href="/contact"
            className="mt-5 inline-block text-white/70 transition-colors hover:text-white"
          >
            Start a Project →
          </Link>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl border-t border-white/10 pt-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/25">
            © {new Date().getFullYear()} UNRVLD. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-white/25">
            <a href="#" className="transition-colors hover:text-white">
              Privacy
            </a>
            <a href="#" className="transition-colors hover:text-white">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
