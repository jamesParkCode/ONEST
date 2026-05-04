import { supabase } from './supabaseClient'
import bcrypt from 'bcryptjs'
import type { Project, Member, SiteContent, Inquiry, InquiryReply } from './types'

// ===== Auth =====
export async function adminLogin(email: string, password: string): Promise<{ id: string; email: string; name: string } | null> {
  const { data, error } = await supabase
    .from('admins')
    .select('id, email, name, password_hash')
    .eq('email', email)
    .single()

  if (error || !data) return null
  const valid = await bcrypt.compare(password, data.password_hash)
  if (!valid) return null

  return { id: data.id, email: data.email, name: data.name }
}

// ===== Projects =====
export async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) throw error
  return data || []
}

export async function createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .insert(project)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) throw error
}

// ===== Members =====
export async function fetchMembers(): Promise<Member[]> {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) throw error
  return data || []
}

export async function createMember(member: Omit<Member, 'id' | 'created_at' | 'updated_at'>): Promise<Member> {
  const { data, error } = await supabase
    .from('members')
    .insert(member)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateMember(id: string, updates: Partial<Member>): Promise<Member> {
  const { data, error } = await supabase
    .from('members')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteMember(id: string): Promise<void> {
  const { error } = await supabase.from('members').delete().eq('id', id)
  if (error) throw error
}

// ===== Site Content =====
export async function fetchAllSiteContent(): Promise<SiteContent[]> {
  const { data, error } = await supabase
    .from('site_content')
    .select('*')
    .order('section_key', { ascending: true })

  if (error) throw error
  return data || []
}

export async function upsertSiteContent(content: Omit<SiteContent, 'id' | 'updated_at'>): Promise<SiteContent> {
  const { data, error } = await supabase
    .from('site_content')
    .upsert(
      { ...content, updated_at: new Date().toISOString() },
      { onConflict: 'section_key' }
    )
    .select()
    .single()

  if (error) throw error
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

export async function deleteInquiry(id: string): Promise<void> {
  const { error } = await supabase.from('inquiries').delete().eq('id', id)
  if (error) throw error
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

export async function createReply(params: {
  inquiry_id: string
  admin_id: string
  admin_name: string
  content: string
}): Promise<InquiryReply> {
  const { data, error } = await supabase
    .from('inquiry_replies')
    .insert(params)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteReply(id: string): Promise<void> {
  const { error } = await supabase.from('inquiry_replies').delete().eq('id', id)
  if (error) throw error
}

// ===== Image Upload =====
export async function uploadImage(file: File, folder: string = 'general'): Promise<string> {
  const ext = file.name.split('.').pop()
  const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`

  const { error } = await supabase.storage
    .from('images')
    .upload(fileName, file)

  if (error) throw error

  const { data } = supabase.storage.from('images').getPublicUrl(fileName)
  return data.publicUrl
}
