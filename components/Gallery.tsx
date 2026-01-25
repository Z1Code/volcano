'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

export default function Gallery() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in')
          }
        })
      },
      { threshold: 0.1 }
    )

    const elements = sectionRef.current?.querySelectorAll('.gallery-animate')
    elements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="gallery" className="gallery-section">
      <div className="container">
        <div className="gallery-layout">
          {/* Left side - Header */}
          <div className="gallery-header gallery-animate">
            <span className="section-tag">Our Gallery</span>
            <h2 className="gallery-title">
              Feel The<br />
              <span className="text-gradient">Experience</span>
            </h2>
            <a href="#events" className="btn btn-primary">Buy Tickets</a>
          </div>

          {/* Right side - Images grid */}
          <div className="gallery-images">
            {/* Large image - top right */}
            <div className="gallery-img gallery-img-large gallery-animate" style={{ transitionDelay: '0.1s' }}>
              <Image
                src="/1.jpg"
                alt="Club atmosphere"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>

            {/* Bottom left small */}
            <div className="gallery-img gallery-img-small gallery-animate" style={{ transitionDelay: '0.2s' }}>
              <Image
                src="/2.jpg"
                alt="Party people"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>

            {/* Bottom right tall */}
            <div className="gallery-img gallery-img-tall gallery-animate" style={{ transitionDelay: '0.3s' }}>
              <Image
                src="/3.jpg"
                alt="DJ booth"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>

            {/* Bottom left second */}
            <div className="gallery-img gallery-img-small gallery-animate" style={{ transitionDelay: '0.4s' }}>
              <Image
                src="/4.jpg"
                alt="Dance floor"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
