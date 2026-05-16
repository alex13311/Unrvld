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
    const isMobile = window.innerWidth < 768
    const primary = isMobile ? mobileRef.current : desktopRef.current
    const secondary = isMobile ? desktopRef.current : mobileRef.current
    const setPrimary = isMobile ? setMobilePlaying : setDesktopPlaying

    const tryPlay = (video: HTMLVideoElement, setPlaying: (v: boolean) => void) => {
      video.muted = true
      video.load()
      const attempt = () => {
        video.play()
          .then(() => setPlaying(true))
          .catch(() => {})
      }
      attempt()
      video.addEventListener('loadedmetadata', attempt, { once: true })
      video.addEventListener('canplay', attempt, { once: true })
      video.addEventListener('playing', () => setPlaying(true), { once: true })
    }

    if (primary) tryPlay(primary, setPrimary)
    // Load secondary silently in background
    if (secondary) { secondary.muted = true; secondary.load() }

    // Unlock on any interaction
    const unlock = () => {
      if (primary) primary.play().then(() => setPrimary(true)).catch(() => {})
    }
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
        className={`absolute inset-0 hidden h-full w-full object-cover transition-opacity duration-500 md:block ${
          desktopPlaying ? 'opacity-100' : 'opacity-0'
        }`}
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
        className={`absolute inset-0 block h-full w-full object-cover transition-opacity duration-500 md:hidden ${
          mobilePlaying ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </>
  )
}
