export default function About() {
  return (
    <section id="about" className="about section">
      <div className="container">
        <div className="about-grid">
          <div className="about-content">
            <h3>Utah's Premier Nightlife Experience</h3>

            <p className="about-text">
              Volcano has been igniting Salt Lake City's nightlife scene since 2018.
              Our venue combines stunning architecture with cutting-edge sound and
              lighting technology to create an unmatched party atmosphere.
            </p>

            <p className="about-text">
              From intimate lounge settings to our explosive main dance floor,
              every corner of Volcano is designed to elevate your night out.
              Join us and discover why we're Utah's most talked-about destination.
            </p>

            <a href="#events" className="about-link">
              More about us →
            </a>
          </div>

          <div className="about-images">
            <div className="about-image large">🌋</div>
            <div className="about-image">🎧</div>
            <div className="about-image">✨</div>
          </div>
        </div>
      </div>
    </section>
  )
}
