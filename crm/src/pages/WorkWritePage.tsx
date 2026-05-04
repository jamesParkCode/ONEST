import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createInquiry } from '../lib/api'
import '../styles/Work.css'

export default function WorkWritePage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    author_name: '',
    password: '',
    title: '',
    content: '',
    is_secret: false,
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, is_secret: e.target.checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.author_name.trim()) return setError('작성자 이름을 입력하세요.')
    if (!form.password.trim()) return setError('비밀번호를 입력하세요.')
    if (!form.title.trim()) return setError('제목을 입력하세요.')
    if (!form.content.trim()) return setError('내용을 입력하세요.')

    setSubmitting(true)
    try {
      await createInquiry({
        author_name: form.author_name.trim(),
        password: form.password,
        title: form.title.trim(),
        content: form.content.trim(),
        is_secret: form.is_secret,
      })
      navigate('/work')
    } catch {
      setError('문의 등록에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="work-page">
      <nav className="work-nav">
        <Link to="/" className="nav-logo">ONEST</Link>
        <Link to="/work" className="work-back-btn">← 목록</Link>
      </nav>

      <div className="work-container">
        <div className="work-header">
          <span className="section-label">Work</span>
          <h1 className="work-title">문의하기</h1>
        </div>

        <form className="work-form" onSubmit={handleSubmit} id="inquiry-form">
          <div className="work-form-row work-form-row-half">
            <div className="work-form-group">
              <label htmlFor="author_name">작성자</label>
              <input
                type="text"
                id="author_name"
                name="author_name"
                value={form.author_name}
                onChange={handleChange}
                placeholder="이름을 입력하세요"
                maxLength={50}
              />
            </div>
            <div className="work-form-group">
              <label htmlFor="password">비밀번호</label>
              <input
                type="password"
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="비밀번호"
                maxLength={100}
              />
            </div>
          </div>

          <div className="work-form-group">
            <label htmlFor="title">제목</label>
            <input
              type="text"
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="제목을 입력하세요"
              maxLength={200}
            />
          </div>

          <div className="work-form-group">
            <label htmlFor="content">내용</label>
            <textarea
              id="content"
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder="문의 내용을 입력하세요"
              rows={10}
            />
          </div>

          <div className="work-form-check">
            <label className="work-checkbox-label">
              <input
                type="checkbox"
                checked={form.is_secret}
                onChange={handleCheckbox}
                id="is_secret"
              />
              <span className="work-checkbox-custom" />
              <span>🔒 비밀글로 작성</span>
            </label>
          </div>

          {error && <p className="work-form-error">{error}</p>}

          <div className="work-form-actions">
            <Link to="/work" className="work-form-cancel">취소</Link>
            <button
              type="submit"
              className="work-form-submit"
              disabled={submitting}
              id="inquiry-submit"
            >
              {submitting ? '등록 중...' : '문의 등록'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
