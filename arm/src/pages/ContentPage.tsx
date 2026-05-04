import { useEffect, useState } from 'react'
import { fetchAllSiteContent, upsertSiteContent } from '../lib/api'
import type { SiteContent } from '../lib/types'

const SECTIONS = [
  { key: 'hero', label: 'Hero' },
  { key: 'about', label: 'About' },
  { key: 'contact', label: 'Contact' },
]

export default function ContentPage() {
  const [contents, setContents] = useState<Record<string, SiteContent>>({})
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState('hero')
  const [form, setForm] = useState({ title: '', subtitle: '', body: '', image_url: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchAllSiteContent().then(data => {
      const map: Record<string, SiteContent> = {}
      data.forEach(d => { map[d.section_key] = d })
      setContents(map)
      if (map['hero']) loadSec('hero', map)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const loadSec = (key: string, src?: Record<string, SiteContent>) => {
    const c = (src || contents)[key]
    setActive(key)
    setForm({ title: c?.title || '', subtitle: c?.subtitle || '', body: c?.body || '', image_url: c?.image_url || '' })
  }

  const save = async () => {
    setSaving(true)
    try {
      const r = await upsertSiteContent({ section_key: active, title: form.title || null, subtitle: form.subtitle || null, body: form.body || null, image_url: form.image_url || null })
      setContents(p => ({ ...p, [active]: r }))
      alert('저장 완료')
    } catch { alert('저장 실패') }
    finally { setSaving(false) }
  }

  if (loading) return <div className="dash-page"><div className="dash-loading">로딩 중...</div></div>

  return (
    <div className="dash-page">
      <h1 className="dash-page-title">콘텐츠 관리</h1>
      <div className="dash-tabs">
        {SECTIONS.map(s => (
          <button key={s.key} className={`dash-tab ${active === s.key ? 'dash-tab-active' : ''}`} onClick={() => loadSec(s.key)}>{s.label}</button>
        ))}
      </div>
      <div className="dash-form">
        <div className="dash-form-group"><label>제목</label><input value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} /></div>
        <div className="dash-form-group"><label>부제목</label><input value={form.subtitle} onChange={e => setForm(p => ({...p, subtitle: e.target.value}))} /></div>
        <div className="dash-form-group"><label>본문</label><textarea value={form.body} onChange={e => setForm(p => ({...p, body: e.target.value}))} rows={8} /></div>
        <div className="dash-form-group"><label>이미지 URL</label><input value={form.image_url} onChange={e => setForm(p => ({...p, image_url: e.target.value}))} /></div>
        <div className="dash-form-actions"><button className="dash-btn dash-btn-primary" onClick={save} disabled={saving}>{saving ? '저장 중...' : '저장'}</button></div>
      </div>
    </div>
  )
}
