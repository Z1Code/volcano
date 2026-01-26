'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { SocialConfig, defaultSocialConfig, socialLabels } from '@/lib/sections-config'

const PHONE_NUMBER = '+1 (786) 830 - 0315'
const WHATSAPP_LINK = 'https://wa.me/17868300315'

const footerLinks = {
  pages: [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#events', label: 'Events' },
    { href: '#gallery', label: 'Gallery' },
  ],
  utility: [
    { href: '#', label: 'Privacy Policy', external: false },
    { href: '#', label: 'Terms of Service', external: false },
    { href: WHATSAPP_LINK, label: 'Contact Us', external: true },
  ],
}

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const [socialConfig, setSocialConfig] = useState<SocialConfig>(defaultSocialConfig)

  useEffect(() => {
    const fetchSocialConfig = async () => {
      try {
        const res = await fetch('/api/social')
        const data = await res.json()
        setSocialConfig(data)
      } catch (error) {
        console.error('Error fetching social config:', error)
      }
    }
    fetchSocialConfig()
  }, [])

  const socialKeys = Object.keys(socialConfig) as Array<keyof SocialConfig>
  const enabledSocials = socialKeys.filter(key => socialConfig[key].enabled && socialConfig[key].url)

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
                    <a
                      href={link.href}
                      {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {enabledSocials.length > 0 && (
              <div className="footer-column">
                <h4>Follow Us</h4>
                <div className="footer-social">
                  {enabledSocials.map((key) => (
                    <a
                      key={key}
                      href={socialConfig[key].url}
                      className="social-link"
                      aria-label={socialLabels[key].title}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {socialLabels[key].short}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Volcano. All rights reserved.</p>
          <p>Salt Lake City, Utah</p>
          <p>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#9ca3af', textDecoration: 'none' }}
            >
              {PHONE_NUMBER}
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
