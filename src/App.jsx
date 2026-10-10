import React, { useState, useEffect } from 'react';
import { Calendar, Users, Target, Rocket, ChevronRight, Award, Megaphone } from 'lucide-react';
import './index.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        <a href="#" className="nav-logo gradient-text" style={{ display: 'flex', alignItems: 'center', fontSize: '1.4rem' }}>
          <img src="/gdg-logo.png" alt="GDG Logo" style={{ height: '35px', marginRight: '10px' }} />
          Google Developers Group ITER
        </a>
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#notice">Recruitment</a>
          <a href="#meets">Meets</a>
          <a href="#gallery">Gallery</a>
          <a href="#achievements">Achievements</a>
          <a href="#members">Members</a>
        </div>
      </div>
    </nav>
  );
};

const Hero = () => (
  <section className="hero" id="about">
    <img src="/hero_bg.jpg" alt="Tech Background" className="hero-bg" />
    <div className="container">
      <h1 className="glow-text-blue">Google Developer Groups</h1>
      <h2 className="glow-text-purple" style={{ fontSize: '2rem', marginBottom: '20px' }}>Connect. Learn. Grow.</h2>
      <p>
        Welcome to Google Developers Group ITER! We are a community of passionate developers exploring the latest in tech, 
        building innovative projects, and sharing knowledge. Join us in shaping the future.
      </p>
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
        <a href="#join"><button className="btn-primary">Join Community</button></a>
        <a href="#meets"><button className="btn-3d">Upcoming Meets</button></a>
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

const Members = () => {
  const membersList = [
    { name: 'Alex Johnson', role: 'Lead Organizer' },
    { name: 'Sarah Williams', role: 'Tech Lead' },
    { name: 'Michael Chen', role: 'Design Lead' },
    { name: 'Priya Sharma', role: 'Community Manager' },
    { name: 'David Kim', role: 'Web Developer' },
    { name: 'Emma Watson', role: 'ML Engineer' },
  ];

  return (
    <section id="members">
      <div className="container">
        <h2 className="section-title glow-text-blue">Meet Our Members</h2>
        <div className="grid">
          {membersList.map((member, i) => (
            <div key={i} className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
              <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-purple))', borderRadius: '50%', margin: '0 auto 15px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px var(--neon-purple)' }}>
                <Users size={32} color="#fff" />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '5px' }}>{member.name}</h3>
              <p style={{ color: 'var(--accent-glow)' }}>{member.role}</p>
            </div>
          ))}
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
      <button className="btn-primary" style={{ fontSize: '1.3rem', padding: '16px 40px' }}>Join the Community <ChevronRight size={24} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '10px' }}/></button>
    </div>
  </section>
);

const Footer = () => (
  <footer style={{ textAlign: 'center', padding: '30px 0', borderTop: '1px solid var(--glass-border)', background: 'var(--primary)' }}>
    <p style={{ color: 'var(--text-muted)' }}>© 2026 Google Developers Group ITER. All rights reserved.</p>
  </footer>
);

const App = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <Notice />
      <Meets />
      <Gallery />
      <Achievements />
      <Members />
      <JoinCTA />
      <Footer />
    </>
  );
};

export default App;
