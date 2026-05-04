import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchInquiry, fetchReplies, createReply, deleteReply } from '../lib/api'
import { useAuth } from '../lib/auth'
import type { Inquiry, InquiryReply } from '../lib/types'

export default function InquiryDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { admin } = useAuth()
  const [inquiry, setInquiry] = useState<Inquiry | null>(null)
  const [replies, setReplies] = useState<InquiryReply[]>([])
  const [loading, setLoading] = useState(true)
  const [replyText, setReplyText] = useState('')
  const [sending, setSending] = useState(false)

  const load = () => {
    if (!id) return
    Promise.all([fetchInquiry(id), fetchReplies(id)])
      .then(([inq, reps]) => { setInquiry(inq); setReplies(reps) })
      .catch(() => {}).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [id])

  const handleReply = async () => {
    if (!replyText.trim() || !id || !admin) return
    setSending(true)
    try {
      await createReply({ inquiry_id: id, admin_id: admin.id, admin_name: admin.name, content: replyText.trim() })
      setReplyText('')
      const reps = await fetchReplies(id)
      setReplies(reps)
    } catch { alert('답변 등록 실패') }
    finally { setSending(false) }
  }

  const handleDeleteReply = async (rid: string) => {
    if (!confirm('답변을 삭제하시겠습니까?')) return
    await deleteReply(rid).catch(() => {})
    if (id) { const reps = await fetchReplies(id); setReplies(reps) }
  }

  const fmt = (d: string) => d ? new Date(d).toLocaleString('ko-KR') : ''

  if (loading) return <div className="dash-page"><div className="dash-loading">로딩 중...</div></div>
  if (!inquiry) return <div className="dash-page"><div className="dash-empty">문의를 찾을 수 없습니다.</div></div>

  return (
    <div className="dash-page">
      <Link to="/dashboard/inquiries" className="dash-back">← 목록</Link>
      <div className="dash-detail-card">
        <div className="dash-detail-meta">
          <span><strong>{inquiry.author_name}</strong></span>
          <span>{fmt(inquiry.created_at)}</span>
          {inquiry.is_secret && <span className="dash-badge dash-badge-warn">🔒 비밀글</span>}
        </div>
        <h2 className="dash-detail-title">{inquiry.title}</h2>
        <div className="dash-detail-body">{inquiry.content.split('\n').map((l, i) => <p key={i}>{l || '\u00A0'}</p>)}</div>
      </div>

      <div className="dash-replies-section">
        <h3>답변 ({replies.length})</h3>
        {replies.map(r => (
          <div key={r.id} className="dash-reply-card">
            <div className="dash-reply-header">
              <span className="dash-reply-admin">{r.admin_name}</span>
              <span className="dash-reply-date">{fmt(r.created_at)}</span>
              <button className="dash-btn dash-btn-sm dash-btn-danger" onClick={() => handleDeleteReply(r.id)}>삭제</button>
            </div>
            <div className="dash-reply-body">{r.content.split('\n').map((l, i) => <p key={i}>{l || '\u00A0'}</p>)}</div>
          </div>
        ))}

        <div className="dash-reply-form">
          <textarea value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="답변을 입력하세요..." rows={4} />
          <button className="dash-btn dash-btn-primary" onClick={handleReply} disabled={sending || !replyText.trim()}>
            {sending ? '등록 중...' : '답변 등록'}
          </button>
        </div>
      </div>
    </div>
  )
}
