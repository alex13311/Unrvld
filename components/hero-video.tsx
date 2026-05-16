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
    ;[desktopRef.current, mobileRef.current].forEach((v) => {
      if (!v) return
      v.muted = true
      v.play().catch(() => {})
    })
  }, [])

  return (
    <>
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
