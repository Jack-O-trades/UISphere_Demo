import React from 'react';
import { Cake, Mail, ExternalLink, GraduationCap, Trash2 } from 'lucide-react';
import { formatDOB, calculateAge, getDaysUntilBirthday, getTeamMeta, getBranchMeta } from '../utils/memberUtils';

const MemberCard = ({ member, onView, onDelete }) => {
  const teamMeta = getTeamMeta(member.team);
  const branchMeta = getBranchMeta(member.branch);
  const age = calculateAge(member.dob);
  const daysUntilBday = getDaysUntilBirthday(member.dob);
  const isUpcomingBday = daysUntilBday <= 30;

  return (
    <div 
      className="member-card glass-panel"
      onClick={() => onView(member)}
      style={{
        '--card-accent': teamMeta.color,
        '--card-shadow': teamMeta.shadow,
      }}
    >
      {/* Top Banner Accent */}
      <div 
        className="card-top-accent" 
        style={{ background: teamMeta.gradient }}
      />

      <div className="card-header">
        <div className="card-avatar-wrapper">
          <img 
            src={member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=111&color=fff`} 
            alt={member.name}
            className="card-avatar"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=111&color=fff`;
            }}
          />
          <span 
            className="card-status-dot" 
            style={{ 
              background: member.status === 'Lead' ? '#ffb800' : member.status === 'Core' ? '#00e5ff' : '#22c55e',
              boxShadow: `0 0 8px ${member.status === 'Lead' ? '#ffb800' : member.status === 'Core' ? '#00e5ff' : '#22c55e'}`
            }}
            title={`Status: ${member.status}`}
          />
        </div>

        <div className="card-badges">
          <span 
            className="team-badge"
            style={{
              color: teamMeta.color,
              background: teamMeta.bgColor,
              borderColor: teamMeta.borderColor
            }}
          >
            {member.team}
          </span>
          <span 
            className="branch-badge"
            style={{
              color: branchMeta.color,
              background: branchMeta.bg,
              border: `1px solid ${branchMeta.color}40`
            }}
          >
            {member.branch}
          </span>
        </div>
      </div>

      <div className="card-body">
        <h3 className="card-name" title={member.name}>{member.name}</h3>
        <p className="card-role" title={member.role}>{member.role}</p>

        {/* Member Birthday Info */}
        <div className={`card-dob-row ${isUpcomingBday ? 'bday-highlight' : ''}`}>
          <div className="dob-details">
            <Cake size={16} className="dob-icon" />
            <span className="dob-date">{formatDOB(member.dob)}</span>
            {age !== null && <span className="dob-age">({age} yrs)</span>}
          </div>
          {isUpcomingBday && (
            <span className="bday-countdown-badge">
              {daysUntilBday === 0 ? 'Today! 🎂' : `in ${daysUntilBday}d 🎈`}
            </span>
          )}
        </div>

        {/* Academic Year */}
        <div className="card-year-row">
          <GraduationCap size={15} color="var(--text-muted)" />
          <span className="card-year-text">{member.year}</span>
        </div>

        {/* Skills Pills */}
        {member.skills && member.skills.length > 0 && (
          <div className="card-skills">
            {member.skills.slice(0, 3).map((skill, idx) => (
              <span key={idx} className="skill-pill">{skill}</span>
            ))}
            {member.skills.length > 3 && (
              <span className="skill-pill more">+{member.skills.length - 3}</span>
            )}
          </div>
        )}
      </div>

      {/* Card Actions Footer */}
      <div className="card-footer" onClick={(e) => e.stopPropagation()}>
        <a 
          href={`mailto:${member.email}`}
          className="card-action-btn email-btn" 
          title={`Email ${member.name}`}
          onClick={(e) => e.stopPropagation()}
        >
          <Mail size={15} />
          <span>Email</span>
        </a>

        <div className="card-footer-right">
          <button 
            type="button" 
            className="card-action-btn view-btn"
            onClick={() => onView(member)}
            title="View Full Profile"
          >
            <ExternalLink size={15} />
            <span>Profile</span>
          </button>

          {onDelete && (
            <button 
              type="button" 
              className="card-action-btn delete-btn"
              onClick={() => onDelete(member)}
              title="Remove Member"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberCard;
