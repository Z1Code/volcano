export interface SocialLink {
  enabled: boolean
  url: string
}

export interface SocialConfig {
  instagram: SocialLink
  facebook: SocialLink
  twitter: SocialLink
  tiktok: SocialLink
}

export interface SectionsConfig {
  about: boolean
  events: boolean
  testimonials: boolean
}

export interface SiteConfig {
  sections: SectionsConfig
  social: SocialConfig
}

export const defaultSectionsConfig: SectionsConfig = {
  about: true,
  events: true,
  testimonials: true,
}

export const defaultSocialConfig: SocialConfig = {
  instagram: { enabled: true, url: 'https://www.instagram.com/volcanoutah/' },
  facebook: { enabled: false, url: '' },
  twitter: { enabled: false, url: '' },
  tiktok: { enabled: false, url: '' },
}

export const defaultConfig: SectionsConfig = defaultSectionsConfig

export const defaultSiteConfig: SiteConfig = {
  sections: defaultSectionsConfig,
  social: defaultSocialConfig,
}

export const sectionLabels: Record<keyof SectionsConfig, { title: string; description: string }> = {
  about: {
    title: 'About Section',
    description: "Utah's Premier Nightlife Experience",
  },
  events: {
    title: 'Upcoming Events',
    description: 'Event calendar and ticket information',
  },
  testimonials: {
    title: 'Testimonials',
    description: 'Customer reviews and feedback',
  },
}

export const socialLabels: Record<keyof SocialConfig, { title: string; short: string }> = {
  instagram: { title: 'Instagram', short: 'IG' },
  facebook: { title: 'Facebook', short: 'FB' },
  twitter: { title: 'X (Twitter)', short: 'X' },
  tiktok: { title: 'TikTok', short: 'TT' },
}
