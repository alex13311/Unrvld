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
    const isMobile = window.innerWidth < 768
    const video = isMobile ? mobileRef.current : desktopRef.current
    if (!video) return

    video.muted = true
    video.play().catch(() => {})

    const unlock = () => video.play().catch(() => {})
    document.addEventListener('touchstart', unlock, { once: true })
    document.addEventListener('pointerdown', unlock, { once: true })

    return () => {
      document.removeEventListener('touchstart', unlock)
      document.removeEventListener('pointerdown', unlock)
    }
  }, [])

  return (
    <>
      <div className="absolute inset-0 bg-zinc-950" />

      <video
        ref={desktopRef}
        src={desktopSrc}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={{ pointerEvents: 'none' }}
        className="absolute inset-0 hidden h-full w-full object-cover md:block"
      />

      <video
        ref={mobileRef}
        src={mobileSrc}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={{ pointerEvents: 'none' }}
        className="absolute inset-0 block h-full w-full object-cover md:hidden"
      />
    </>
  )
}
