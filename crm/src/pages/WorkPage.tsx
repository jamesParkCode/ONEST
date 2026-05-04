import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchInquiries } from '../lib/api'
import type { Inquiry } from '../lib/types'
import '../styles/Work.css'

export default function WorkPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInquiries()
      .then(setInquiries)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
  }

  return (
    <div className="work-page">
      <nav className="work-nav">
        <Link to="/" className="nav-logo">ONEST</Link>
        <Link to="/work/write" className="work-write-btn" id="work-write-btn">
          문의하기
        </Link>
      </nav>

      <div className="work-container">
        <div className="work-header">
          <span className="section-label">Work</span>
          <h1 className="work-title">문의 게시판</h1>
          <p className="work-subtitle">프로젝트 관련 문의를 남겨주세요.</p>
        </div>

        {loading ? (
          <div className="work-loading">
            <div className="work-loading-spinner" />
          </div>
        ) : inquiries.length === 0 ? (
          <div className="work-empty">
            <p>등록된 문의가 없습니다.</p>
            <Link to="/work/write" className="work-empty-btn">첫 번째 문의 남기기</Link>
          </div>
        ) : (
          <div className="work-list">
            <div className="work-list-header">
              <span className="work-col-num">No.</span>
              <span className="work-col-title">제목</span>
              <span className="work-col-author">작성자</span>
              <span className="work-col-date">날짜</span>
            </div>
            {inquiries.map((inquiry, index) => (
              <Link
                to={`/work/${inquiry.id}`}
                key={inquiry.id}
                className="work-list-item"
                id={`inquiry-${inquiry.id}`}
              >
                <span className="work-col-num">{inquiries.length - index}</span>
                <span className="work-col-title">
                  {inquiry.is_secret && <span className="work-secret-icon">🔒</span>}
                  {inquiry.is_secret ? '비밀글입니다' : inquiry.title}
                </span>
                <span className="work-col-author">{inquiry.author_name}</span>
                <span className="work-col-date">{formatDate(inquiry.created_at)}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
