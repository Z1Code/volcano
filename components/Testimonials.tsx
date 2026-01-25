interface Testimonial {
  quote: string
  name: string
  location: string
}

const testimonials: Testimonial[] = [
  {
    quote: "Best nightclub in Utah, hands down. The energy is unmatched and the DJs always deliver.",
    name: "Sarah M.",
    location: "Salt Lake City, UT",
  },
  {
    quote: "The VIP experience at Volcano is incredible. Great service, amazing atmosphere.",
    name: "Mike T.",
    location: "Park City, UT",
  },
  {
    quote: "Finally a club that matches the vibe of big cities. Volcano is the real deal.",
    name: "Jessica L.",
    location: "Provo, UT",
  },
]

export default function Testimonials() {
  return (
    <section className="testimonials section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Testimonials</span>
          <h2 className="section-title">Don't Take Our Word for It</h2>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="testimonial-quote">"</div>
              <p className="testimonial-text">{testimonial.quote}</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">👤</div>
                <div className="testimonial-info">
                  <h4>{testimonial.name}</h4>
                  <span>{testimonial.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
