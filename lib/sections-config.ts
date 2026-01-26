export interface SectionsConfig {
  about: boolean
  events: boolean
  testimonials: boolean
}

export const defaultConfig: SectionsConfig = {
  about: true,
  events: true,
  testimonials: true,
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
