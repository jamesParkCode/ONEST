import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchInquiries, deleteInquiry } from '../lib/api'
import type { Inquiry } from '../lib/types'

export default function InquiriesPage() {
  const [list, setList] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    fetchInquiries().then(setList).catch(() => {}).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('삭제하시겠습니까?')) return
    await deleteInquiry(id).catch(() => alert('삭제 실패'))
    load()
  }

  const fmt = (d: string) => d ? new Date(d).toLocaleDateString('ko-KR') : ''

  return (
    <div className="dash-page">
      <h1 className="dash-page-title">문의 관리</h1>
      {loading ? <div className="dash-loading">로딩 중...</div> : list.length === 0 ? <div className="dash-empty">문의가 없습니다.</div> : (
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead><tr><th>제목</th><th>작성자</th><th>비밀글</th><th>날짜</th><th>관리</th></tr></thead>
            <tbody>
              {list.map(i => (
                <tr key={i.id}>
                  <td><Link to={`/dashboard/inquiries/${i.id}`} className="dash-link">{i.title}</Link></td>
                  <td>{i.author_name}</td>
                  <td>{i.is_secret ? '🔒' : '-'}</td>
                  <td>{fmt(i.created_at)}</td>
                  <td><button className="dash-btn dash-btn-sm dash-btn-danger" onClick={() => handleDelete(i.id)}>삭제</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
