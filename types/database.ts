export type UserRole = 'customer' | 'employee' | 'admin'
export type TicketStatus = 'valid' | 'used' | 'cancelled' | 'expired'
export type OrderStatus = 'pending' | 'completed' | 'failed' | 'refunded'

export interface Profile {
  id: string
  full_name: string | null
  phone: string | null
  role: UserRole
  created_at: string
}

export interface Event {
  id: string
  title: string
  description: string | null
  date: string
  image_url: string | null
  is_active: boolean
  created_at: string
}

export interface TicketType {
  id: string
  event_id: string
  name: string
  price: number
  description: string | null
  perks: string[]
  quantity_available: number
  quantity_sold: number
  stripe_price_id: string | null
}

export interface Ticket {
  id: string
  user_id: string
  ticket_type_id: string
  event_id: string
  qr_code: string
  status: TicketStatus
  purchase_date: string
  validated_at: string | null
  validated_by: string | null
  stripe_payment_id: string | null
  price_paid: number
}

export interface Order {
  id: string
  user_id: string
  stripe_session_id: string | null
  stripe_payment_intent: string | null
  total: number
  status: OrderStatus
  created_at: string
}

// Extended types with relations
export interface TicketWithDetails extends Ticket {
  ticket_type: TicketType
  event: Event
  profile?: Profile
}

export interface EventWithTicketTypes extends Event {
  ticket_types: TicketType[]
}

export interface TicketTypeWithEvent extends TicketType {
  event: Event
}

// Database type for Supabase
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at'> & { created_at?: string }
        Update: Partial<Omit<Profile, 'id'>>
      }
      events: {
        Row: Event
        Insert: Omit<Event, 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<Omit<Event, 'id'>>
      }
      ticket_types: {
        Row: TicketType
        Insert: Omit<TicketType, 'id' | 'quantity_sold'> & { id?: string; quantity_sold?: number }
        Update: Partial<Omit<TicketType, 'id'>>
      }
      tickets: {
        Row: Ticket
        Insert: Omit<Ticket, 'id' | 'purchase_date'> & { id?: string; purchase_date?: string }
        Update: Partial<Omit<Ticket, 'id'>>
      }
      orders: {
        Row: Order
        Insert: Omit<Order, 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<Omit<Order, 'id'>>
      }
    }
  }
}
