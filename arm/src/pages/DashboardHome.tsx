export default function DashboardHome() {
  return (
    <div className="dash-page">
      <h1 className="dash-page-title">대시보드</h1>
      <div className="dash-cards">
        <div className="dash-card">
          <span className="dash-card-icon">🎨</span>
          <h3>프로젝트</h3>
          <p>프로젝트를 관리하고 클라이언트 사이트에 표시합니다.</p>
        </div>
        <div className="dash-card">
          <span className="dash-card-icon">👥</span>
          <h3>멤버</h3>
          <p>팀 멤버 정보를 관리합니다.</p>
        </div>
        <div className="dash-card">
          <span className="dash-card-icon">📝</span>
          <h3>콘텐츠</h3>
          <p>사이트 섹션별 콘텐츠를 수정합니다.</p>
        </div>
        <div className="dash-card">
          <span className="dash-card-icon">💬</span>
          <h3>문의관리</h3>
          <p>클라이언트 문의를 확인하고 답변합니다.</p>
        </div>
      </div>
    </div>
  )
}
