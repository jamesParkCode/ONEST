import { supabase } from './supabaseClient'
import bcrypt from 'bcryptjs'
import type { Project, Member, SiteContent, Inquiry, InquiryReply } from './types'

// ===== Projects =====
export async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('is_visible', true)
    .order('sort_order', { ascending: true })

  if (error) throw error
  return data || []
}

// ===== Members =====
export async function fetchMembers(): Promise<Member[]> {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('is_visible', true)
    .order('sort_order', { ascending: true })

  if (error) throw error
  return data || []
}

// ===== Site Content =====
export async function fetchSiteContent(sectionKey: string): Promise<SiteContent | null> {
  const { data, error } = await supabase
    .from('site_content')
    .select('*')
    .eq('section_key', sectionKey)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

// ===== Inquiries =====
export async function fetchInquiries(): Promise<Inquiry[]> {
  const { data, error } = await supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function fetchInquiry(id: string): Promise<Inquiry | null> {
  const { data, error } = await supabase
    .from('inquiries')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function createInquiry(params: {
  author_name: string
  password: string
  title: string
  content: string
  is_secret: boolean
}): Promise<Inquiry> {
  const password_hash = await bcrypt.hash(params.password, 10)

  const { data, error } = await supabase
    .from('inquiries')
    .insert({
      author_name: params.author_name,
      password_hash,
      title: params.title,
      content: params.content,
      is_secret: params.is_secret,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function verifyInquiryPassword(id: string, password: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('inquiries')
    .select('password_hash')
    .eq('id', id)
    .single()

  if (error || !data) return false
  return bcrypt.compare(password, data.password_hash)
}

// ===== Inquiry Replies =====
export async function fetchReplies(inquiryId: string): Promise<InquiryReply[]> {
  const { data, error } = await supabase
    .from('inquiry_replies')
    .select('*')
    .eq('inquiry_id', inquiryId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data || []
}
