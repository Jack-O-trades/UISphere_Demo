import React, { useState, useEffect } from 'react';
import { 
  Calendar, Users, Target, Rocket, ChevronRight, Megaphone, 
  ArrowRight, Sparkles 
} from 'lucide-react';
import MemberManagement from './components/MemberManagement';
import './index.css';

const Navbar = ({ currentPage, onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, target) => {
    e.preventDefault();
    if (target === 'members') {
      onNavigate('members');
      window.location.hash = 'members';
    } else {
      onNavigate('home');
      window.location.hash = target === 'home' ? '' : target;
      if (target !== 'home') {
        setTimeout(() => {
          const el = document.getElementById(target);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        <a 
          href="#" 
          onClick={(e) => handleNavClick(e, 'home')} 
          className="nav-logo gradient-text" 
          style={{ display: 'flex', alignItems: 'center', fontSize: '1.4rem', cursor: 'pointer' }}
        >
          <img src="/gdg-logo.png" alt="GDG Logo" style={{ height: '35px', marginRight: '10px' }} />
          Google Developers Group ITER
        </a>

        <div className="nav-links">
          <a 
            href="#about" 
            onClick={(e) => handleNavClick(e, 'about')}
            className={currentPage === 'home' ? '' : 'nav-dim'}
          >
            About
          </a>
          <a 
            href="#notice" 
            onClick={(e) => handleNavClick(e, 'notice')}
            className={currentPage === 'home' ? '' : 'nav-dim'}
          >
            Recruitment
          </a>
          <a 
            href="#meets" 
            onClick={(e) => handleNavClick(e, 'meets')}
            className={currentPage === 'home' ? '' : 'nav-dim'}
          >
            Meets
          </a>
          <a 
            href="#gallery" 
            onClick={(e) => handleNavClick(e, 'gallery')}
            className={currentPage === 'home' ? '' : 'nav-dim'}
          >
            Gallery
          </a>
          <a 
            href="#achievements" 
            onClick={(e) => handleNavClick(e, 'achievements')}
            className={currentPage === 'home' ? '' : 'nav-dim'}
          >
            Achievements
          </a>
          <a 
            href="#members" 
            onClick={(e) => handleNavClick(e, 'members')}
            className={`nav-member-link ${currentPage === 'members' ? 'nav-active' : ''}`}
          >
            <span className="nav-member-indicator"></span>
            Members
            <span className="nav-badge-pill">60</span>
          </a>
        </div>
      </div>
    </nav>
  );
};

const Hero = ({ onExploreMembers }) => (
  <section className="hero" id="about">
    <img src="/hero_bg.jpg" alt="Tech Background" className="hero-bg" />
    <div className="container">
      <div className="hero-badge-pill">
        <Sparkles size={16} color="var(--neon-blue)" />
        <span>Largest Student Tech Community • 60+ Core Members</span>
      </div>
      <h1 className="glow-text-blue" style={{ marginTop: '15px' }}>Google Developer Groups</h1>
      <h2 className="glow-text-purple" style={{ fontSize: '2rem', marginBottom: '20px' }}>Connect. Learn. Grow.</h2>
      <p>
        Welcome to Google Developers Group ITER! We are a community of passionate developers exploring the latest in tech, 
        building innovative projects, and sharing knowledge. Join us in shaping the future.
      </p>
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <a href="#join"><button className="btn-primary">Join Community</button></a>
        <a href="#meets"><button className="btn-3d">Upcoming Meets</button></a>
        <button className="btn-3d btn-glow-blue" onClick={onExploreMembers}>
          <Users size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '8px' }} />
          Members Directory (60)
        </button>
      </div>
    </div>
  </section>
);

const Notice = () => (
  <section id="notice">
    <div className="container">
      <h2 className="section-title glow-text-blue">Notices & Recruitment</h2>
      <div className="grid">
        <div className="glass-panel" style={{ padding: '30px' }}>
          <Megaphone size={40} color="var(--neon-purple)" style={{ marginBottom: '20px' }} />
          <h3>Core Team Recruitment 2026</h3>
          <p style={{ marginTop: '15px', color: 'var(--text-muted)' }}>
            We are looking for enthusiastic developers, designers, and managers to lead our upcoming initiatives. Applications close on Oct 30th!
          </p>
          <button className="btn-3d" style={{ marginTop: '20px' }}>Apply Now</button>
        </div>
        <div className="glass-panel" style={{ padding: '30px' }}>
          <Target size={40} color="var(--neon-blue)" style={{ marginBottom: '20px' }} />
          <h3>Winter Hackathon Registrations</h3>
          <p style={{ marginTop: '15px', color: 'var(--text-muted)' }}>
            The biggest hackathon of the season is here. Form your team of 4 and start brainstorming!
          </p>
          <button className="btn-3d" style={{ marginTop: '20px' }}>Register Team</button>
        </div>
      </div>
    </div>
  </section>
);

const Meets = () => (
  <section id="meets" style={{ background: 'rgba(20, 20, 20, 0.4)' }}>
    <div className="container">
      <h2 className="section-title glow-text-purple">Upcoming Meets</h2>
      <div className="grid">
        {[
          { title: 'Intro to React 19', date: 'Oct 15, 2026', time: '5:00 PM', location: 'Virtual' },
          { title: 'AI/ML Bootcamp', date: 'Oct 22, 2026', time: '10:00 AM', location: 'Main Campus' },
          { title: 'Cloud Architecture', date: 'Nov 05, 2026', time: '4:00 PM', location: 'Auditorium' },
        ].map((meet, i) => (
          <div key={i} className="glass-panel" style={{ padding: '25px', borderLeft: '4px solid var(--neon-blue)' }}>
            <Calendar size={30} color="var(--neon-blue)" style={{ marginBottom: '15px' }} />
            <h3 style={{ marginBottom: '10px' }}>{meet.title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <strong>Date:</strong> {meet.date}<br/>
              <strong>Time:</strong> {meet.time}<br/>
              <strong>Location:</strong> {meet.location}
            </p>
            <button className="btn-3d" style={{ marginTop: '15px', padding: '8px 16px', fontSize: '0.8rem' }}>RSVP</button>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Gallery = () => {
  const [activeIndex, setActiveIndex] = useState(2);
  const images = [
    { src: '/gallery_1.jpg', title: "Tech Conf '24" },
    { src: '/gallery_3.jpg', title: "Robotics Lab" },
    { src: '/gallery_2.jpg', title: "Neon Hackathon" },
    { src: '/gallery_4.jpg', title: "Developer Summit" },
    { src: '/gallery_5.jpg', title: "Design Workshop" },
  ];

  const handleNext = () => setActiveIndex((prev) => (prev + 1) % images.length);
  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <section id="gallery" style={{ overflow: 'hidden' }}>
      <div className="container">
        <h2 className="section-title glow-text-blue">GDG Memories</h2>
        <div className="panorama-carousel">
          {images.map((img, index) => {
            let offset = index - activeIndex;
            if (offset < -2) offset += images.length;
            if (offset > 2) offset -= images.length;

            return (
              <div 
                key={index} 
                className={`panorama-item ${offset === 0 ? 'active' : ''}`}
                style={{ 
                  transform: `rotateY(${offset * -25}deg) translateZ(${Math.abs(offset) * -150}px) translateX(${offset * 25}%)`,
                  filter: `blur(${Math.abs(offset) * 2}px) brightness(${1 - Math.abs(offset) * 0.3})`,
                  zIndex: images.length - Math.abs(offset)
                }}
                onClick={() => setActiveIndex(index)}
              >
                <img src={img.src} alt={img.title} />
                <div className="panorama-caption">
                  <h3>{img.title}</h3>
                </div>
              </div>
            );
          })}
        </div>
        <div className="panorama-controls">
          <button className="btn-3d" onClick={handlePrev}>&lt; Prev</button>
          <button className="btn-3d" onClick={handleNext}>Next &gt;</button>
        </div>
      </div>
    </section>
  );
};

const Achievements = () => (
  <section id="achievements" style={{ background: 'rgba(20, 20, 20, 0.4)' }}>
    <div className="container">
      <h2 className="section-title glow-text-purple">Timeline of Excellence</h2>
      <div className="timeline">
        <div className="timeline-item left">
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 className="gradient-text">2026</h3>
            <p>Crossed 5,000 active community members globally.</p>
          </div>
        </div>
        <div className="timeline-item right">
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 className="gradient-text">2025</h3>
            <p>Hosted the largest student-led hackathon in the region with 1,200 participants.</p>
          </div>
        </div>
        <div className="timeline-item left">
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 className="gradient-text">2024</h3>
            <p>Won the Best Developer Community Award by Google Developers.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const MembersPreview = ({ onExploreMembers }) => {
  const previewLeaders = [
    { name: 'Aarav Sharma', role: 'Full Stack Lead', team: 'Tech', branch: 'CSE Core', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80' },
    { name: 'Arjun Reddy', role: 'Head of Media', team: 'Media', branch: 'CSE Core', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80' },
    { name: 'Tara D\'Souza', role: 'UI/UX Architect Lead', team: 'Design', branch: 'AIML', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80' },
    { name: 'Kunal Singhal', role: 'Community President', team: 'PR & Management', branch: 'CSE Core', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80' },
  ];

  return (
    <section id="members">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 className="section-title glow-text-blue" style={{ marginBottom: '15px' }}>Meet Our Core Leads</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '650px', margin: '0 auto' }}>
            Empowering 60+ dedicated student leaders across Tech, Media, Design, and PR & Management departments at ITER.
          </p>
        </div>

        <div className="grid">
          {previewLeaders.map((member, i) => (
            <div key={i} className="glass-panel" style={{ padding: '25px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ 
                width: '90px', 
                height: '90px', 
                borderRadius: '50%', 
                margin: '0 auto 15px', 
                overflow: 'hidden',
                border: '2px solid var(--neon-blue)',
                boxShadow: '0 0 15px rgba(0, 229, 255, 0.4)'
              }}>
                <img src={member.avatar} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '5px' }}>{member.name}</h3>
              <p style={{ color: 'var(--neon-blue)', fontSize: '0.9rem', marginBottom: '8px' }}>{member.role}</p>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', fontSize: '0.8rem' }}>
                <span className="team-badge" style={{ color: '#00e5ff', background: 'rgba(0, 229, 255, 0.1)', border: '1px solid rgba(0, 229, 255, 0.3)' }}>{member.team}</span>
                <span className="branch-badge" style={{ color: '#ffb800', background: 'rgba(255, 184, 0, 0.1)', border: '1px solid rgba(255, 184, 0, 0.3)' }}>{member.branch}</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA to open full 60 Members Management Page */}
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <button 
            className="btn-primary" 
            style={{ fontSize: '1.15rem', padding: '16px 36px', display: 'inline-flex', alignItems: 'center', gap: '10px' }}
            onClick={onExploreMembers}
          >
            <span>Open Member Management Page (60 Members)</span>
            <ArrowRight size={20} />
          </button>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '12px' }}>
            Full search, team & branch filters (CSE Core, AIML, IOT, CSIT), birthday tracking, and sorting
          </p>
        </div>
      </div>
    </section>
  );
};

const JoinCTA = () => (
  <section id="join" style={{ background: 'linear-gradient(180deg, transparent, rgba(10, 10, 10, 0.9))', paddingBottom: '150px' }}>
    <div className="container" style={{ textAlign: 'center' }}>
      <Rocket size={60} color="var(--neon-blue)" style={{ margin: '0 auto 30px', filter: 'drop-shadow(0 0 10px var(--neon-blue))' }} />
      <h2 className="glow-text-blue" style={{ fontSize: '3.5rem', marginBottom: '20px' }}>Want to be a part of GDG?</h2>
      <p style={{ fontSize: '1.3rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto 40px' }}>
        Please join our community and start your journey of exploring, learning, and building cool things together with amazing people!
      </p>
      <button className="btn-primary" style={{ fontSize: '1.3rem', padding: '16px 40px' }}>
        Join the Community <ChevronRight size={24} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '10px' }}/>
      </button>
    </div>
  </section>
);

const Footer = () => (
  <footer style={{ textAlign: 'center', padding: '30px 0', borderTop: '1px solid var(--glass-border)', background: 'var(--primary)' }}>
    <p style={{ color: 'var(--text-muted)' }}>© 2026 Google Developers Group ITER. All rights reserved.</p>
  </footer>
);

const App = () => {
  const [currentPage, setCurrentPage] = useState(() => {
    return window.location.hash === '#members' ? 'members' : 'home';
  });

  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#members') {
        setCurrentPage('members');
      } else {
        setCurrentPage('home');
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigateTo = (page) => {
    setCurrentPage(page);
    if (page === 'members') {
      window.location.hash = 'members';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.hash = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <Navbar currentPage={currentPage} onNavigate={navigateTo} />
      {currentPage === 'members' ? (
        <MemberManagement onNavigateHome={() => navigateTo('home')} />
      ) : (
        <>
          <Hero onExploreMembers={() => navigateTo('members')} />
          <Notice />
          <Meets />
          <Gallery />
          <Achievements />
          <MembersPreview onExploreMembers={() => navigateTo('members')} />
          <JoinCTA />
        </>
      )}
      <Footer />
    </>
  );
};

export default App;
