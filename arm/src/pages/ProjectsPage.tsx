import { useEffect, useState } from 'react'
import { fetchProjects, createProject, updateProject, deleteProject, uploadImage } from '../lib/api'
import type { Project } from '../lib/types'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Project | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    title: '', category: '', year: '', description: '', image_url: '',
    sort_order: 0, is_visible: true,
  })
  const [uploading, setUploading] = useState(false)

  const load = () => {
    setLoading(true)
    fetchProjects().then(setProjects).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const resetForm = () => {
    setForm({ title: '', category: '', year: '', description: '', image_url: '', sort_order: 0, is_visible: true })
    setEditing(null)
    setShowForm(false)
  }

  const startEdit = (p: Project) => {
    setEditing(p)
    setForm({
      title: p.title, category: p.category, year: p.year,
      description: p.description || '', image_url: p.image_url || '',
      sort_order: p.sort_order, is_visible: p.is_visible,
    })
    setShowForm(true)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadImage(file, 'projects')
      setForm(prev => ({ ...prev, image_url: url }))
    } catch { alert('이미지 업로드 실패') }
    finally { setUploading(false) }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.category || !form.year) return
    try {
      if (editing) {
        await updateProject(editing.id, form)
      } else {
        await createProject(form)
      }
      resetForm()
      load()
    } catch { alert('저장 실패') }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return
    try { await deleteProject(id); load() }
    catch { alert('삭제 실패') }
  }

  return (
    <div className="dash-page">
      <div className="dash-page-header">
        <h1 className="dash-page-title">프로젝트 관리</h1>
        <button className="dash-btn dash-btn-primary" onClick={() => { resetForm(); setShowForm(true) }}>
          + 새 프로젝트
        </button>
      </div>

      {showForm && (
        <div className="dash-modal-overlay" onClick={resetForm}>
          <div className="dash-modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editing ? '프로젝트 수정' : '새 프로젝트'}</h2>
            <form onSubmit={handleSubmit} className="dash-form">
              <div className="dash-form-row">
                <div className="dash-form-group">
                  <label>제목</label>
                  <input value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} required />
                </div>
                <div className="dash-form-group">
                  <label>카테고리</label>
                  <input value={form.category} onChange={e => setForm(p => ({...p, category: e.target.value}))} required />
                </div>
              </div>
              <div className="dash-form-row">
                <div className="dash-form-group">
                  <label>연도</label>
                  <input value={form.year} onChange={e => setForm(p => ({...p, year: e.target.value}))} required />
                </div>
                <div className="dash-form-group">
                  <label>정렬 순서</label>
                  <input type="number" value={form.sort_order} onChange={e => setForm(p => ({...p, sort_order: parseInt(e.target.value) || 0}))} />
                </div>
              </div>
              <div className="dash-form-group">
                <label>설명</label>
                <textarea value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} rows={3} />
              </div>
              <div className="dash-form-group">
                <label>이미지</label>
                <div className="dash-image-upload">
                  {form.image_url && <img src={form.image_url} alt="preview" className="dash-image-preview" />}
                  <label className="dash-upload-btn">
                    {uploading ? '업로드 중...' : '이미지 선택'}
                    <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
                  </label>
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
      ) : projects.length === 0 ? (
        <div className="dash-empty">등록된 프로젝트가 없습니다.</div>
      ) : (
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>이미지</th>
                <th>제목</th>
                <th>카테고리</th>
                <th>연도</th>
                <th>표시</th>
                <th>순서</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(p => (
                <tr key={p.id}>
                  <td>
                    {p.image_url ? (
                      <img src={p.image_url} alt="" className="dash-table-thumb" />
                    ) : (
                      <div className="dash-table-thumb-empty" />
                    )}
                  </td>
                  <td className="dash-td-title">{p.title}</td>
                  <td>{p.category}</td>
                  <td>{p.year}</td>
                  <td><span className={`dash-badge ${p.is_visible ? 'dash-badge-on' : 'dash-badge-off'}`}>{p.is_visible ? '표시' : '숨김'}</span></td>
                  <td>{p.sort_order}</td>
                  <td>
                    <div className="dash-actions">
                      <button className="dash-btn dash-btn-sm" onClick={() => startEdit(p)}>수정</button>
                      <button className="dash-btn dash-btn-sm dash-btn-danger" onClick={() => handleDelete(p.id)}>삭제</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
