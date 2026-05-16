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
    const videos = [desktopRef.current, mobileRef.current].filter(Boolean) as HTMLVideoElement[]

    const playAll = () => videos.forEach((v) => { v.muted = true; v.play().catch(() => {}) })

    // Try immediately
    playAll()

    // Retry after a short delay (handles slow network / late hydration)
    const t1 = setTimeout(playAll, 500)
    const t2 = setTimeout(playAll, 1500)

    // Retry on any user interaction (unlocks autoplay on restrictive browsers)
    const onInteract = () => playAll()
    document.addEventListener('touchstart', onInteract, { once: true })
    document.addEventListener('click', onInteract, { once: true })
    document.addEventListener('scroll', onInteract, { once: true })

    // Retry when tab becomes visible again
    const onVisible = () => { if (document.visibilityState === 'visible') playAll() }
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      document.removeEventListener('touchstart', onInteract)
      document.removeEventListener('click', onInteract)
      document.removeEventListener('scroll', onInteract)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])

  return (
    <>
      {/* Desktop (landscape) */}
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
      {/* Mobile (vertical) */}
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
