import React, { useState } from 'react';
import { 
  X, Cake, Mail, Phone, GraduationCap, Briefcase, UserPlus, 
  ShieldAlert, Lock, Users, Check, Copy 
} from 'lucide-react';
import { formatDOB, calculateAge, getDaysUntilBirthday, getTeamMeta, getBranchMeta } from '../utils/memberUtils';
import { TEAMS, BRANCHES } from '../data/membersData';

export const MemberDetailModal = ({ member, onClose, onEdit, onDelete }) => {
  if (!member) return null;

  const teamMeta = getTeamMeta(member.team);
  const branchMeta = getBranchMeta(member.branch);
  const age = calculateAge(member.dob);
  const daysUntilBday = getDaysUntilBirthday(member.dob);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container glass-panel" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="modal-header-hero" style={{ background: teamMeta.gradient }}>
          <div className="modal-avatar-box">
            <img 
              src={member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=111&color=fff`} 
              alt={member.name}
              className="modal-avatar"
            />
            <span 
              className="modal-status-badge"
              style={{
                background: member.status === 'Lead' ? '#ffb800' : member.status === 'Core' ? '#00e5ff' : '#22c55e',
                boxShadow: `0 0 10px ${member.status === 'Lead' ? '#ffb800' : member.status === 'Core' ? '#00e5ff' : '#22c55e'}`
              }}
            >
              {member.status}
            </span>
          </div>
        </div>

        <div className="modal-content-body">
          <div className="modal-title-row">
            <div>
              <h2 className="modal-member-name">{member.name}</h2>
              <p className="modal-member-role">{member.role}</p>
            </div>
            <div className="modal-tags">
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

          {member.bio && (
            <p className="modal-bio">"{member.bio}"</p>
          )}

          {/* Birthday Spotlight Box */}
          <div className="modal-dob-highlight-card">
            <div className="dob-highlight-left">
              <div className="bday-icon-circle">
                <Cake size={24} color="#ffb800" />
              </div>
              <div>
                <div className="bday-label">Date of Birth</div>
                <div className="bday-value">
                  {formatDOB(member.dob)} {age !== null && <span className="bday-age">({age} years old)</span>}
                </div>
              </div>
            </div>
            <div className="bday-highlight-right">
              <span className="days-left-chip">
                {daysUntilBday === 0 
                  ? "🎉 Today is their Birthday! 🎉" 
                  : daysUntilBday === 1 
                    ? "🎂 Birthday is tomorrow!" 
                    : `🎈 ${daysUntilBday} days until next birthday`}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="modal-details-grid">
            <div className="detail-item">
              <GraduationCap size={18} color="var(--neon-blue)" />
              <div>
                <span className="detail-label">Academic Branch</span>
                <span className="detail-text">{member.branch} • {member.year}</span>
              </div>
            </div>

            <div className="detail-item">
              <Mail size={18} color="var(--neon-blue)" />
              <div>
                <span className="detail-label">Email Address</span>
                <a href={`mailto:${member.email}`} className="detail-text link">{member.email}</a>
              </div>
            </div>

            <div className="detail-item">
              <Phone size={18} color="var(--neon-blue)" />
              <div>
                <span className="detail-label">Phone Number</span>
                <span className="detail-text">{member.phone || "Not provided"}</span>
              </div>
            </div>

            <div className="detail-item">
              <Briefcase size={18} color="var(--neon-blue)" />
              <div>
                <span className="detail-label">GDG Team Role</span>
                <span className="detail-text">{member.team} ({member.role})</span>
              </div>
            </div>
          </div>

          {/* Skills */}
          {member.skills && member.skills.length > 0 && (
            <div className="modal-skills-section">
              <span className="detail-label">Key Competencies & Technologies</span>
              <div className="modal-skill-chips">
                {member.skills.map((skill, i) => (
                  <span key={i} className="skill-chip">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="modal-footer-actions">
            <button 
              type="button"
              className="btn-danger-subtle"
              onClick={() => {
                onDelete(member);
                onClose();
              }}
            >
              Remove Member
            </button>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                type="button" 
                className="btn-3d" 
                onClick={() => {
                  onEdit(member);
                  onClose();
                }}
              >
                Edit Details
              </button>
              <button type="button" className="btn-primary" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AddEditMemberModal = ({ isOpen, onClose, onSave, editingMember }) => {
  const isEdit = Boolean(editingMember);
  const [formData, setFormData] = useState({
    name: editingMember?.name || '',
    team: editingMember?.team || 'Tech',
    branch: editingMember?.branch || 'CSE Core',
    dob: editingMember?.dob || '2004-06-15',
    role: editingMember?.role || '',
    year: editingMember?.year || '2nd Year',
    email: editingMember?.email || '',
    phone: editingMember?.phone || '',
    status: editingMember?.status || 'Active',
    skills: editingMember?.skills ? editingMember.skills.join(', ') : '',
    bio: editingMember?.bio || '',
    avatar: editingMember?.avatar || ''
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Member name is required';
    if (!formData.role.trim()) newErrors.role = 'Role/Title is required';
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'Please enter a valid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const skillsArray = formData.skills
      ? formData.skills.split(',').map((s) => s.trim()).filter(Boolean)
      : ['Tech Enthusiast', 'GDG Member'];

    const updatedData = {
      ...formData,
      skills: skillsArray,
      id: editingMember?.id || Date.now(),
      avatar: formData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=111&color=fff`
    };

    onSave(updatedData);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container glass-panel add-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="form-modal-header">
          <div className="form-icon-circle">
            <UserPlus size={24} color="var(--neon-blue)" />
          </div>
          <div>
            <h2 className="glow-text-blue" style={{ fontSize: '1.6rem' }}>
              {isEdit ? 'Edit Member Information' : 'Add New Community Member'}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              {isEdit ? `Update details for ${editingMember.name}` : 'Enter member data to register into GDG ITER management system.'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="member-form">
          <div className="form-grid">
            {/* Full Name */}
            <div className="form-group full-width">
              <label>Full Name *</label>
              <input 
                type="text" 
                placeholder="e.g. Samantha Patel"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={errors.name ? 'input-error' : ''}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            {/* Team */}
            <div className="form-group">
              <label>GDG Team *</label>
              <select 
                value={formData.team}
                onChange={(e) => setFormData({ ...formData, team: e.target.value })}
              >
                {TEAMS.filter((t) => t !== 'All').map((team) => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>
            </div>

            {/* Branch */}
            <div className="form-group">
              <label>Branch *</label>
              <select 
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
              >
                {BRANCHES.filter((b) => b !== 'All').map((branch) => (
                  <option key={branch} value={branch}>{branch}</option>
                ))}
              </select>
            </div>

            {/* Role */}
            <div className="form-group">
              <label>Role / Designation *</label>
              <input 
                type="text" 
                placeholder="e.g. UI/UX Designer, Cloud Lead"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className={errors.role ? 'input-error' : ''}
              />
              {errors.role && <span className="error-text">{errors.role}</span>}
            </div>

            {/* Date of Birth */}
            <div className="form-group">
              <label>Date of Birth (DOB) *</label>
              <input 
                type="date" 
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className={errors.dob ? 'input-error' : ''}
              />
              {errors.dob && <span className="error-text">{errors.dob}</span>}
            </div>

            {/* Academic Year */}
            <div className="form-group">
              <label>Academic Year</label>
              <select 
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>

            {/* Member Status */}
            <div className="form-group">
              <label>Membership Status</label>
              <select 
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Active">Active</option>
                <option value="Core">Core Team</option>
                <option value="Lead">Team Lead</option>
                <option value="Alumni">Alumni</option>
              </select>
            </div>

            {/* Email */}
            <div className="form-group">
              <label>Email Address *</label>
              <input 
                type="email" 
                placeholder="name@iter.ac.in"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={errors.email ? 'input-error' : ''}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            {/* Phone */}
            <div className="form-group">
              <label>Phone Number</label>
              <input 
                type="text" 
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            {/* Skills */}
            <div className="form-group full-width">
              <label>Skills (Comma-separated)</label>
              <input 
                type="text" 
                placeholder="e.g. React, Node.js, GCP, Figma"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              />
            </div>

            {/* Bio */}
            <div className="form-group full-width">
              <label>Short Bio / Note</label>
              <textarea 
                rows="2"
                placeholder="Brief summary of member passions and initiatives..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-3d" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {isEdit ? 'Save Changes' : 'Add Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const AdminContactModal = ({ member, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!member) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText('admin.gdg@iter.ac.in');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const mailtoSubject = encodeURIComponent(`Request to Delete Member: ${member.name} (ID: ${member.id})`);
  const mailtoBody = encodeURIComponent(
    `Hello GDG ITER Admin Team,\n\nI would like to request the removal of member "${member.name}" (${member.team} Team, ${member.branch}) from the GDG Member Management Directory.\n\nReason for request:\n[Please specify reason here]\n\nThank you,\nGDG Member Directory System`
  );

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container glass-panel admin-alert-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="admin-modal-banner">
          <div className="admin-shield-icon-wrapper">
            <ShieldAlert size={38} color="#ffb800" />
          </div>
          <span className="admin-security-pill">
            <Lock size={12} style={{ marginRight: '5px' }} />
            Protected Action • Admin Authorization Required
          </span>
          <h2 className="glow-text-purple" style={{ fontSize: '1.75rem', marginTop: '12px' }}>
            Contact an Admin to Delete
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '460px', margin: '8px auto 0' }}>
            Member records are locked to prevent unauthorized deletion. Only designated GDG ITER administrators can delete members from the system.
          </p>
        </div>

        <div className="admin-modal-content">
          <div className="targeted-member-chip">
            <img 
              src={member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=111&color=fff`} 
              alt={member.name} 
              className="target-avatar"
            />
            <div className="target-info">
              <span className="target-label">Targeted Member:</span>
              <strong className="target-name">{member.name}</strong>
              <span className="target-sub">{member.role} • {member.team} ({member.branch})</span>
            </div>
          </div>

          <div className="admin-contact-card">
            <h4 className="admin-contact-title">Designated Club Administrator:</h4>
            
            <div className="admin-person-row">
              <div className="admin-person-avatar">
                <Users size={18} color="var(--neon-blue)" />
              </div>
              <div className="admin-person-details">
                <span className="admin-person-name">Kunal Singhal</span>
                <span className="admin-person-role">President & Lead Administrator • GDG ITER</span>
              </div>
            </div>

            <div className="admin-email-row">
              <div className="admin-email-box">
                <Mail size={16} color="var(--neon-blue)" />
                <span className="admin-email-text">admin.gdg@iter.ac.in</span>
              </div>
              <button 
                type="button" 
                className="btn-copy-email"
                onClick={handleCopy}
                title="Copy admin email"
              >
                {copied ? <Check size={14} color="#22c55e" /> : <Copy size={14} />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div className="admin-modal-actions">
            <button 
              type="button" 
              className="btn-3d" 
              onClick={onClose}
            >
              Close
            </button>
            <a 
              href={`mailto:admin.gdg@iter.ac.in?subject=${mailtoSubject}&body=${mailtoBody}`}
              className="btn-primary"
              style={{ textDecoration: 'none' }}
              onClick={onClose}
            >
              <Mail size={16} style={{ marginRight: '8px' }} />
              Contact Admin
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
