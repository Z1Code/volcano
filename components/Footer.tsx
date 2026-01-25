import Link from 'next/link'
import Image from 'next/image'

const footerLinks = {
  pages: [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#events', label: 'Events' },
    { href: '#gallery', label: 'Gallery' },
  ],
  utility: [
    { href: '#', label: 'Privacy Policy' },
    { href: '#', label: 'Terms of Service' },
    { href: '#', label: 'FAQ' },
  ],
}

const socialLinks = [
  { label: 'Instagram', short: 'IG' },
  { label: 'Facebook', short: 'FB' },
  { label: 'Twitter', short: 'X' },
  { label: 'TikTok', short: 'TT' },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <Link href="/" className="logo">
              <Image
                src="/logo.svg"
                alt="Volcano"
                width={195}
                height={38}
              />
            </Link>
            <p className="footer-tagline">
              Utah's premier nightlife destination. Experience the heat.
            </p>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h4>Pages</h4>
              <ul>
                {footerLinks.pages.map((link) => (
                  <li key={link.label}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-column">
              <h4>Utility</h4>
              <ul>
                {footerLinks.utility.map((link) => (
                  <li key={link.label}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-column">
              <h4>Follow Us</h4>
              <div className="footer-social">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href="#"
                    className="social-link"
                    aria-label={social.label}
                  >
                    {social.short}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Volcano. All rights reserved.</p>
          <p>Salt Lake City, Utah</p>
        </div>
      </div>
    </footer>
  )
}
