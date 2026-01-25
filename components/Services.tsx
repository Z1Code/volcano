'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

const services = [
  {
    icon: '/lounge bar.svg',
    title: 'Lounge Bar',
    description: 'Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip.',
    position: 'left',
    size: 'tall',
  },
  {
    icon: '/vip.svg',
    title: 'VIP Zone',
    description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et.',
    position: 'right',
    size: 'short',
  },
  {
    icon: '/dancefloor.svg',
    title: 'Dance Floor',
    description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    position: 'left',
    size: 'short',
  },
  {
    icon: '/special events.svg',
    title: 'Special Events',
    description: 'Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit.',
    position: 'right',
    size: 'tall',
  },
]

export default function Services() {
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
      { threshold: 0.2 }
    )

    const cards = sectionRef.current?.querySelectorAll('.service-card')
    cards?.forEach((card) => observer.observe(card))

    const header = sectionRef.current?.querySelector('.services-header')
    if (header) observer.observe(header)

    const dots = sectionRef.current?.querySelectorAll('.services-timeline-dot')
    dots?.forEach((dot) => observer.observe(dot))

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="services-section section">
      <div className="container">
        <div className="services-header">
          <div className="services-header-left">
            <span className="section-tag">Our Services</span>
            <h2 className="services-title">
              What We Offer<br />
              In <span className="text-gradient">Our Club</span>
            </h2>
          </div>
          <div className="services-header-right">
            <a href="#events" className="btn btn-primary">Buy Tickets</a>
          </div>
        </div>

        <div className="services-grid-new">
          {/* Timeline */}
          <div className="services-timeline">
            <div className="services-timeline-dot" style={{ transitionDelay: '0.2s' }}></div>
            <div className="services-timeline-dot" style={{ transitionDelay: '0.5s' }}></div>
          </div>

          {services.map((service, index) => (
            <div
              key={service.title}
              className={`service-card card-${service.position} card-${service.size}`}
              style={{ transitionDelay: `${index * 0.15}s` }}
            >
              <div className="service-icon-svg">
                <Image src={service.icon} alt={service.title} width={64} height={64} />
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
