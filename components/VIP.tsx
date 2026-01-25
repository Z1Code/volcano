'use client'

interface Package {
  name: string
  price: string
  details: string
  featured?: boolean
}

const perks = [
  'Entrada Prioritaria',
  'Mesa Reservada',
  'Botellas Premium',
  'Host Personal',
]

const packages: Package[] = [
  { name: 'SILVER', price: '$500', details: 'Mesa + 1 Botella' },
  { name: 'GOLD', price: '$1,000', details: 'Mesa Premium + 2 Botellas', featured: true },
  { name: 'PLATINUM', price: '$2,500', details: 'Suite VIP + Open Bar' },
]

export default function VIP() {
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
    <section id="vip" className="vip section">
      <div className="vip-bg">
        <div className="vip-gradient"></div>
      </div>

      <div className="container">
        <div className="vip-content reveal">
          <div className="vip-badge">
            <span className="badge-icon">◆</span>
            <span className="badge-text">EXCLUSIVO</span>
          </div>

          <h2 className="vip-title">
            EXPERIENCIA
            <br />
            <span className="neon-text">VIP</span>
          </h2>

          <p className="vip-description">
            Eleva tu noche al siguiente nivel. Acceso exclusivo a la terraza privada
            con vista panorámica, servicio de botella premium, anfitrión personal
            y entrada prioritaria sin filas.
          </p>

          <div className="vip-perks">
            {perks.map((perk) => (
              <div key={perk} className="perk">
                <div className="perk-icon">⊕</div>
                <span>{perk}</span>
              </div>
            ))}
          </div>

          <div className="vip-packages">
            {packages.map((pkg) => (
              <div key={pkg.name} className={`package ${pkg.featured ? 'featured' : ''}`}>
                {pkg.featured && <div className="package-badge">POPULAR</div>}
                <h4 className="package-name">{pkg.name}</h4>
                <div className="package-price">{pkg.price}</div>
                <span className="package-details">{pkg.details}</span>
              </div>
            ))}
          </div>

          <a
            href="#reservations"
            className="btn btn-primary btn-glow btn-lg"
            onClick={(e) => handleScrollClick(e, '#reservations')}
          >
            <span>Reservar Experiencia VIP</span>
            <div className="btn-shine"></div>
          </a>
        </div>
      </div>
    </section>
  )
}
