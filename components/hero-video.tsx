'use client'

import { useEffect, useRef } from 'react'

interface HeroVideoProps {
  desktopSrc: string
  mobileSrc: string
}

export default function HeroVideo({ desktopSrc, mobileSrc }: HeroVideoProps) {
  const desktopRef = useRef<HTMLVideoElement>(null)
  const mobileRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const tryPlay = (video: HTMLVideoElement | null) => {
      if (!video) return
      video.muted = true
      video.play().catch(() => {
        // Retry once on interaction
        const handler = () => {
          video.play().catch(() => {})
          document.removeEventListener('touchstart', handler)
          document.removeEventListener('click', handler)
        }
        document.addEventListener('touchstart', handler, { once: true })
        document.addEventListener('click', handler, { once: true })
      })
    }

    tryPlay(desktopRef.current)
    tryPlay(mobileRef.current)
  }, [])

  return (
    <>
      {/* Desktop (landscape) */}
      <video
        ref={desktopRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 hidden h-full w-full object-cover md:block"
      >
        <source src={desktopSrc} type="video/mp4" />
        <source src={desktopSrc} type="video/quicktime" />
      </video>

      {/* Mobile (vertical) */}
      <video
        ref={mobileRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 block h-full w-full object-cover md:hidden"
      >
        <source src={mobileSrc} type="video/mp4" />
        <source src={mobileSrc} type="video/quicktime" />
      </video>
    </>
  )
}
