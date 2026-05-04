import { useEffect, useState } from 'react'
import { fetchMembers, createMember, updateMember, deleteMember, uploadImage } from '../lib/api'
import type { Member } from '../lib/types'

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Member | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: '', role: '', bio: '', avatar_url: '',
    sort_order: 0, is_visible: true,
  })
  const [uploading, setUploading] = useState(false)

  const load = () => {
    setLoading(true)
    fetchMembers().then(setMembers).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const resetForm = () => {
    setForm({ name: '', role: '', bio: '', avatar_url: '', sort_order: 0, is_visible: true })
    setEditing(null)
    setShowForm(false)
  }

  const startEdit = (m: Member) => {
    setEditing(m)
    setForm({
      name: m.name, role: m.role, bio: m.bio || '', avatar_url: m.avatar_url || '',
      sort_order: m.sort_order, is_visible: m.is_visible,
    })
    setShowForm(true)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadImage(file, 'members')
      setForm(prev => ({ ...prev, avatar_url: url }))
    } catch { alert('이미지 업로드 실패') }
    finally { setUploading(false) }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.role) return
    try {
      if (editing) {
        await updateMember(editing.id, form)
      } else {
        await createMember(form)
      }
      resetForm()
      load()
    } catch { alert('저장 실패') }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return
    try { await deleteMember(id); load() }
    catch { alert('삭제 실패') }
  }

  return (
    <div className="dash-page">
      <div className="dash-page-header">
        <h1 className="dash-page-title">멤버 관리</h1>
        <button className="dash-btn dash-btn-primary" onClick={() => { resetForm(); setShowForm(true) }}>
          + 새 멤버
        </button>
      </div>

      {showForm && (
        <div className="dash-modal-overlay" onClick={resetForm}>
          <div className="dash-modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editing ? '멤버 수정' : '새 멤버'}</h2>
            <form onSubmit={handleSubmit} className="dash-form">
              <div className="dash-form-row">
                <div className="dash-form-group">
                  <label>이름</label>
                  <input value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} required />
                </div>
                <div className="dash-form-group">
                  <label>역할</label>
                  <input value={form.role} onChange={e => setForm(p => ({...p, role: e.target.value}))} required />
                </div>
              </div>
              <div className="dash-form-group">
                <label>소개</label>
                <textarea value={form.bio} onChange={e => setForm(p => ({...p, bio: e.target.value}))} rows={3} />
              </div>
              <div className="dash-form-group">
                <label>프로필 이미지</label>
                <div className="dash-image-upload">
                  {form.avatar_url && <img src={form.avatar_url} alt="preview" className="dash-image-preview dash-image-avatar" />}
                  <label className="dash-upload-btn">
                    {uploading ? '업로드 중...' : '이미지 선택'}
                    <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
                  </label>
                </div>
              </div>
              <div className="dash-form-row">
                <div className="dash-form-group">
                  <label>정렬 순서</label>
                  <input type="number" value={form.sort_order} onChange={e => setForm(p => ({...p, sort_order: parseInt(e.target.value) || 0}))} />
                </div>
              </div>
              <label className="dash-checkbox">
                <input type="checkbox" checked={form.is_visible} onChange={e => setForm(p => ({...p, is_visible: e.target.checked}))} />
                <span>사이트에 표시</span>
              </label>
              <div className="dash-form-actions">
                <button type="button" className="dash-btn" onClick={resetForm}>취소</button>
                <button type="submit" className="dash-btn dash-btn-primary">저장</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="dash-loading">로딩 중...</div>
      ) : members.length === 0 ? (
        <div className="dash-empty">등록된 멤버가 없습니다.</div>
      ) : (
        <div className="dash-members-grid">
          {members.map(m => (
            <div key={m.id} className="dash-member-card">
              {m.avatar_url ? (
                <img src={m.avatar_url} alt={m.name} className="dash-member-avatar" />
              ) : (
                <div className="dash-member-avatar-empty" />
              )}
              <div className="dash-member-info">
                <h3>{m.name}</h3>
                <p>{m.role}</p>
                {m.bio && <p className="dash-member-bio">{m.bio}</p>}
                <span className={`dash-badge ${m.is_visible ? 'dash-badge-on' : 'dash-badge-off'}`}>
                  {m.is_visible ? '표시' : '숨김'}
                </span>
              </div>
              <div className="dash-member-actions">
                <button className="dash-btn dash-btn-sm" onClick={() => startEdit(m)}>수정</button>
                <button className="dash-btn dash-btn-sm dash-btn-danger" onClick={() => handleDelete(m.id)}>삭제</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
