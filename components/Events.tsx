interface Event {
  day: string
  month: string
  title: string
  time: string
  icon: string
}

const events: Event[] = [
  {
    day: '15',
    month: 'FEB',
    title: 'Neon Nights',
    time: '10PM - 4AM',
    icon: '🌙',
  },
  {
    day: '22',
    month: 'FEB',
    title: 'House Sessions',
    time: '10PM - 3AM',
    icon: '🎧',
  },
  {
    day: '01',
    month: 'MAR',
    title: 'Volcano Fridays',
    time: '9PM - 4AM',
    icon: '🔥',
  },
]

export default function Events() {
  return (
    <section id="events" className="events section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Upcoming Events</span>
          <h2 className="section-title">Don't Miss Out</h2>
        </div>

        <div className="events-grid">
          {events.map((event, index) => (
            <EventCard key={index} event={event} />
          ))}
        </div>

        <div className="events-cta">
          <a href="#" className="btn btn-outline">
            Browse All Events
          </a>
        </div>
      </div>
    </section>
  )
}

function EventCard({ event }: { event: Event }) {
  return (
    <div className="event-card">
      <div className="event-image">
        {event.icon}
        <div className="event-date">
          <span className="day">{event.day}</span>
          <span className="month">{event.month}</span>
        </div>
      </div>

      <div className="event-content">
        <h3 className="event-title">{event.title}</h3>
        <div className="event-info">
          <span>🕐 {event.time}</span>
        </div>
        <a href="#" className="event-link">
          Get tickets →
        </a>
      </div>
    </div>
  )
}
