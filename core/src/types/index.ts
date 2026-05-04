// ===== Database Types =====

export interface Project {
  id: string
  title: string
  category: string
  year: string
  description: string | null
  image_url: string | null
  sort_order: number
  is_visible: boolean
  created_at: string
  updated_at: string
}

export interface Member {
  id: string
  name: string
  role: string
  bio: string | null
  avatar_url: string | null
  sort_order: number
  is_visible: boolean
  created_at: string
  updated_at: string
}

export interface SiteContent {
  id: string
  section_key: string
  title: string | null
  subtitle: string | null
  body: string | null
  image_url: string | null
  updated_at: string
}

export interface Inquiry {
  id: string
  author_name: string
  password_hash: string
  title: string
  content: string
  is_secret: boolean
  created_at: string
  updated_at: string
}

/** Inquiry without password_hash for client display */
export type InquiryListItem = Omit<Inquiry, 'password_hash' | 'content'> & {
  reply_count: number
}

export interface InquiryReply {
  id: string
  inquiry_id: string
  admin_id: string | null
  admin_name: string
  content: string
  created_at: string
}

export interface Admin {
  id: string
  email: string
  name: string
  created_at: string
}
