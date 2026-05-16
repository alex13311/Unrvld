'use client'

import { useEffect, useRef, useState } from 'react'

interface HeroVideoProps {
  desktopSrc: string
  mobileSrc: string
}

export default function HeroVideo({ desktopSrc, mobileSrc }: HeroVideoProps) {
  const desktopRef = useRef<HTMLVideoElement>(null)
  const mobileRef = useRef<HTMLVideoElement>(null)
  const [desktopPlaying, setDesktopPlaying] = useState(false)
  const [mobilePlaying, setMobilePlaying] = useState(false)

  useEffect(() => {
    const setup = (
      video: HTMLVideoElement | null,
      setPlaying: (v: boolean) => void,
    ) => {
      if (!video) return
      video.muted = true

      const tryPlay = () => {
        video.play().then(() => setPlaying(true)).catch(() => {})
      }

      video.addEventListener('canplay', tryPlay, { once: true })
      video.addEventListener('playing', () => setPlaying(true))
      tryPlay()

      // Unlock on first interaction
      const onInteract = () => { tryPlay() }
      document.addEventListener('touchstart', onInteract, { once: true })
      document.addEventListener('click', onInteract, { once: true })
    }

    setup(desktopRef.current, setDesktopPlaying)
    setup(mobileRef.current, setMobilePlaying)
  }, [])

  return (
    <>
      {/* Fallback dark background — shown until video plays */}
      <div className="absolute inset-0 bg-zinc-950" />

      {/* Desktop (landscape) — hidden until playing so no play button shows */}
      <video
        ref={desktopRef}
        src={desktopSrc}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={{ pointerEvents: 'none' }}
        className={`absolute inset-0 hidden h-full w-full object-cover transition-opacity duration-700 md:block ${
          desktopPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Mobile (vertical) — hidden until playing so no play button shows */}
      <video
        ref={mobileRef}
        src={mobileSrc}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={{ pointerEvents: 'none' }}
        className={`absolute inset-0 block h-full w-full object-cover transition-opacity duration-700 md:hidden ${
          mobilePlaying ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </>
  )
}
