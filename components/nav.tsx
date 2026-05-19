'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/work', label: 'Work' },
  { href: '/contact', label: 'Contact' },
]

export default function Nav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-base font-semibold tracking-[0.35em] text-white">
          UNRVLD
        </Link>

        <nav className="hidden gap-8 text-xs uppercase tracking-[0.2em] md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative pb-1 transition-colors duration-200 ${
                isActive(link.href) ? 'text-white' : 'text-white/50 hover:text-white'
              }`}
            >
              {link.label}
              <span
                className={`pointer-events-none absolute -bottom-0.5 left-0 h-px bg-gradient-to-r from-red-500 to-red-800 transition-all duration-300 ${
                  isActive(link.href) ? 'w-full' : 'w-0'
                }`}
              />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/contact"
            className="hidden rounded-full border border-white/25 px-5 py-2 text-xs uppercase tracking-[0.2em] text-white transition hover:border-red-600 hover:bg-red-700 hover:text-white sm:inline-flex"
          >
            Book a Call
          </Link>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button className="md:hidden" aria-label="Open menu">
                <Menu className="size-5 text-white" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="flex w-72 flex-col border-r border-white/10 bg-black px-8 py-8"
            >
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <Link
                href="/"
                className="text-base font-semibold tracking-[0.35em] text-white"
                onClick={() => setOpen(false)}
              >
                UNRVLD
              </Link>

              <nav className="mt-12 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 py-3 text-sm uppercase tracking-[0.2em] transition-colors ${
                      isActive(link.href) ? 'text-white' : 'text-white/50'
                    }`}
                  >
                    {isActive(link.href) && (
                      <span className="h-px w-5 bg-gradient-to-r from-red-500 to-red-800" />
                    )}
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto">
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="inline-flex rounded-full border border-white/25 px-5 py-3 text-xs uppercase tracking-[0.2em] text-white transition hover:border-red-600 hover:bg-red-700 hover:text-white"
                >
                  Book a Call
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
