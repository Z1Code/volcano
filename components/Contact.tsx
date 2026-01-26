'use client'

export default function Contact() {
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
    <section id="contact" className="contact-section">
      <div className="contact-container">
        <div className="contact-left">
          <span className="contact-tag">Visit Us</span>
          <h2 className="contact-title">
            Come and Visit<br />
            <span className="text-gradient">Our Club</span>
          </h2>
          <div className="contact-buttons">
            <a
              href="#events"
              className="btn btn-primary"
              onClick={(e) => handleScrollClick(e, '#events')}
            >
              Buy Tickets
            </a>
            <a href="https://wa.me/17868300315" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              Contact Us
            </a>
          </div>
        </div>

        <div className="contact-right">
          <div className="contact-info-card">
            <div className="contact-info-item">
              <div className="contact-info-icon">📍</div>
              <div className="contact-info-text">
                <p>123 Main Street, Salt Lake City,<br />UT 84101, United States</p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-icon">✉️</div>
              <div className="contact-info-text">
                <a href="mailto:info@volcanoclub.com">info@volcanoclub.com</a>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-icon">📞</div>
              <div className="contact-info-text">
                <a href="https://wa.me/17868300315" target="_blank" rel="noopener noreferrer">+1 (786) 830 - 0315</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
