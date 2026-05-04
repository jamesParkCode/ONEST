import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchProjects, fetchMembers } from '../lib/api'
import type { Project, Member } from '../lib/types'

const fallbackProjects: Project[] = [
  { id: '1', title: 'Brand Identity', category: 'Branding', year: '2026', description: null, image_url: null, sort_order: 0, is_visible: true, created_at: '', updated_at: '' },
  { id: '2', title: 'Digital Platform', category: 'Web Design', year: '2025', description: null, image_url: null, sort_order: 1, is_visible: true, created_at: '', updated_at: '' },
  { id: '3', title: 'Space Design', category: 'Interior', year: '2025', description: null, image_url: null, sort_order: 2, is_visible: true, created_at: '', updated_at: '' },
  { id: '4', title: 'Campaign Film', category: 'Marketing', year: '2026', description: null, image_url: null, sort_order: 3, is_visible: true, created_at: '', updated_at: '' },
]

const fallbackMembers: Member[] = [
  { id: '1', name: 'Kim Minjun', role: 'Creative Director', bio: null, avatar_url: null, sort_order: 0, is_visible: true, created_at: '', updated_at: '' },
  { id: '2', name: 'Lee Soyeon', role: 'Design Lead', bio: null, avatar_url: null, sort_order: 1, is_visible: true, created_at: '', updated_at: '' },
  { id: '3', name: 'Park Jihoon', role: 'Developer', bio: null, avatar_url: null, sort_order: 2, is_visible: true, created_at: '', updated_at: '' },
  { id: '4', name: 'Choi Yuna', role: 'Project Manager', bio: null, avatar_url: null, sort_order: 3, is_visible: true, created_at: '', updated_at: '' },
]

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [projects, setProjects] = useState<Project[]>(fallbackProjects)
  const [members, setMembers] = useState<Member[]>(fallbackMembers)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    fetchProjects().then(setProjects).catch(() => {})
    fetchMembers().then(setMembers).catch(() => {})
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [projects, members])

  return (
    <div className={`app ${isLoaded ? 'loaded' : ''}`}>
      {/* Navigation */}
      <nav className="nav" id="nav-main">
        <a href="#" className="nav-logo">ONEST</a>
        <ul className="nav-links">
          <li><a href="#about">ABOUT</a></li>
          <li><a href="#projects">PROJECTS</a></li>
          <li><a href="#members">MEMBERS</a></li>
          <li><Link to="/work">WORK</Link></li>
          <li><a href="#contact">CONTACT</a></li>
        </ul>
        <button className="nav-lang" id="lang-toggle">KOREA/EN</button>
      </nav>

      {/* Hero Section */}
      <section className="hero" id="hero">
        <div className="hero-light">
          <span className="selected-works">Selected works</span>
          <h1 className="hero-title">PROJ</h1>
        </div>
        <div className="hero-dark">
          <div className="hero-scroll-hint">
            <span>Scroll</span>
            <div className="scroll-line" />
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="projects-section" id="projects">
        <div className="projects-header">
          <span className="section-label">Selected Works</span>
          <span className="projects-count">({String(projects.length).padStart(2, '0')})</span>
        </div>
        <div className="projects-grid">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="project-card animate-on-scroll"
              style={{ transitionDelay: `${index * 0.15}s` }}
              id={`project-card-${project.id}`}
            >
              <div className="project-thumbnail" data-index={index % 4}>
                {project.image_url ? (
                  <img src={project.image_url} alt={project.title} className="project-thumbnail-img" />
                ) : (
                  <div className="project-thumbnail-inner" />
                )}
                <div className="project-overlay">
                  <span className="project-overlay-text">View Project</span>
                </div>
              </div>
              <div className="project-info">
                <span className="project-category">{project.category}</span>
                <h3 className="project-title">{project.title}</h3>
                <span className="project-year">{project.year}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="about-section" id="about">
        <div className="about-content animate-on-scroll">
          <span className="section-label">About</span>
          <h2 className="about-heading">
            We create meaningful<br />
            design experiences.
          </h2>
          <p className="about-text">
            ONEST is a creative studio focused on brand identity,
            digital experiences, and spatial design. We believe in the
            power of thoughtful design to transform businesses and
            create lasting impressions.
          </p>
        </div>
      </section>

      {/* Members Section */}
      <section className="members-section" id="members">
        <span className="section-label animate-on-scroll">Members</span>
        <div className="members-grid">
          {members.map((member, index) => (
            <div
              key={member.id}
              className="member-card animate-on-scroll"
              style={{ transitionDelay: `${index * 0.1}s` }}
              id={`member-${index}`}
            >
              {member.avatar_url ? (
                <img src={member.avatar_url} alt={member.name} className="member-avatar-img" />
              ) : (
                <div className="member-avatar" />
              )}
              <h3 className="member-name">{member.name}</h3>
              <span className="member-role">{member.role}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Work CTA Section */}
      <section className="work-cta-section" id="work">
        <div className="work-cta-content animate-on-scroll">
          <span className="section-label">Work</span>
          <h2 className="work-cta-heading">
            Have a question?<br />Leave us a message.
          </h2>
          <Link to="/work" className="work-cta-button" id="work-cta-btn">
            문의 게시판 →
          </Link>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section" id="contact">
        <div className="contact-content animate-on-scroll">
          <span className="section-label">Contact</span>
          <h2 className="contact-heading">
            Let's work<br />together.
          </h2>
          <a href="mailto:hello@onest.studio" className="contact-email" id="contact-email">
            hello@onest.studio
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer" id="footer">
        <div className="footer-content">
          <span className="footer-logo">ONEST</span>
          <span className="footer-copyright">© 2026 ONEST. All rights reserved.</span>
        </div>
      </footer>
    </div>
  )
}
