import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchInquiry, fetchReplies, verifyInquiryPassword } from '../lib/api'
import type { Inquiry, InquiryReply } from '../lib/types'
import '../styles/Work.css'

export default function WorkDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [inquiry, setInquiry] = useState<Inquiry | null>(null)
  const [replies, setReplies] = useState<InquiryReply[]>([])
  const [loading, setLoading] = useState(true)
  const [verified, setVerified] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')

  useEffect(() => {
    if (!id) return
    Promise.all([fetchInquiry(id), fetchReplies(id)])
      .then(([inq, reps]) => {
        setInquiry(inq)
        setReplies(reps)
        if (inq && !inq.is_secret) {
          setVerified(true)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  const handleVerify = async () => {
    if (!id || !password) return
    setPasswordError('')
    const ok = await verifyInquiryPassword(id, password)
    if (ok) {
      setVerified(true)
    } else {
      setPasswordError('비밀번호가 일치하지 않습니다.')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleVerify()
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleDateString('ko-KR', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="work-page">
        <nav className="work-nav">
          <Link to="/" className="nav-logo">ONEST</Link>
        </nav>
        <div className="work-container">
          <div className="work-loading"><div className="work-loading-spinner" /></div>
        </div>
      </div>
    )
  }

  if (!inquiry) {
    return (
      <div className="work-page">
        <nav className="work-nav">
          <Link to="/" className="nav-logo">ONEST</Link>
        </nav>
        <div className="work-container">
          <div className="work-empty">
            <p>문의를 찾을 수 없습니다.</p>
            <Link to="/work" className="work-empty-btn">목록으로</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="work-page">
      <nav className="work-nav">
        <Link to="/" className="nav-logo">ONEST</Link>
        <Link to="/work" className="work-back-btn">← 목록</Link>
      </nav>

      <div className="work-container">
        {inquiry.is_secret && !verified ? (
          <div className="work-password-gate">
            <div className="work-password-icon">🔒</div>
            <h2>비밀글입니다</h2>
            <p>내용을 확인하려면 비밀번호를 입력하세요.</p>
            <div className="work-password-form">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="비밀번호"
                className="work-password-input"
                id="secret-password-input"
                autoFocus
              />
              <button onClick={handleVerify} className="work-password-submit" id="secret-password-submit">
                확인
              </button>
            </div>
            {passwordError && <p className="work-password-error">{passwordError}</p>}
          </div>
        ) : (
          <>
            <article className="work-detail">
              <div className="work-detail-header">
                <div className="work-detail-meta">
                  <span className="work-detail-author">{inquiry.author_name}</span>
                  <span className="work-detail-date">{formatDate(inquiry.created_at)}</span>
                  {inquiry.is_secret && <span className="work-detail-secret">🔒 비밀글</span>}
                </div>
                <h1 className="work-detail-title">{inquiry.title}</h1>
              </div>
              <div className="work-detail-body">
                {inquiry.content.split('\n').map((line, i) => (
                  <p key={i}>{line || '\u00A0'}</p>
                ))}
              </div>
            </article>

            {replies.length > 0 && (
              <div className="work-replies">
                <h3 className="work-replies-title">답변 ({replies.length})</h3>
                {replies.map((reply) => (
                  <div key={reply.id} className="work-reply" id={`reply-${reply.id}`}>
                    <div className="work-reply-header">
                      <span className="work-reply-admin">{reply.admin_name}</span>
                      <span className="work-reply-date">{formatDate(reply.created_at)}</span>
                    </div>
                    <div className="work-reply-content">
                      {reply.content.split('\n').map((line, i) => (
                        <p key={i}>{line || '\u00A0'}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
