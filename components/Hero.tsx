'use client'

export default function Hero() {
  const handleScrollClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const targetId = href.replace('#', '')
    const targetElement = document.getElementById(targetId)

    if (targetElement) {
      const navHeight = 80
      const targetPosition = targetElement.offsetTop - navHeight

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      })
    }
  }

  return (
    <section id="home" className="hero">
      <div className="hero-content">
        <span className="hero-tagline">Let's Dance & Party</span>

        <h1 className="hero-title">
          Good Vibes,<br />
          Here at Volcano
        </h1>

        <div className="hero-buttons">
          <a
            href="#events"
            className="btn btn-primary"
            onClick={(e) => handleScrollClick(e, '#events')}
          >
            Buy Tickets
          </a>
          <a
            href="#about"
            className="btn btn-outline"
            onClick={(e) => handleScrollClick(e, '#about')}
          >
            <span className="play-icon"></span>
            Watch Video
          </a>
        </div>
      </div>

      <div className="scroll-indicator">
        <span>Scroll</span>
        <div className="scroll-arrow"></div>
      </div>
    </section>
  )
}
