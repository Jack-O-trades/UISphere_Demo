import React, { useState, useMemo } from 'react';
import { 
  Search, X, ArrowUpDown, UserPlus, 
  Download, LayoutGrid, Table, Cake, Sparkles, Users, Code, 
  Video, Palette, Briefcase, RefreshCw, ArrowLeft,
  CheckCircle, AlertCircle, AlertTriangle 
} from 'lucide-react';
import { INITIAL_MEMBERS, TEAMS, BRANCHES, SORT_OPTIONS } from '../data/membersData';
import MemberCard from './MemberCard';
import { MemberDetailModal, AddEditMemberModal, AdminContactModal } from './MemberModal';
import { 
  formatDOB, calculateAge, getDaysUntilBirthday, 
  getTeamMeta, getBranchMeta, exportMembersToCSV 
} from '../utils/memberUtils';

const MemberManagement = ({ onNavigateHome }) => {
  const [members, setMembers] = useState(() => {
    const saved = localStorage.getItem('gdg_members_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_MEMBERS;
      }
    }
    return INITIAL_MEMBERS;
  });

  // Filters and Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('All');
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [sortBy, setSortBy] = useState('name_asc');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Modals state
  const [viewingMember, setViewingMember] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [adminContactTarget, setAdminContactTarget] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync with LocalStorage helper
  const updateMembersList = (newList) => {
    setMembers(newList);
    localStorage.setItem('gdg_members_data', JSON.stringify(newList));
  };

  const showToast = (text, type = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Handlers for Add, Edit, Delete
  const handleSaveMember = (memberData) => {
    const exists = members.some((m) => m.id === memberData.id);
    let updated;
    if (exists) {
      updated = members.map((m) => (m.id === memberData.id ? memberData : m));
      showToast(`Updated profile for ${memberData.name}`);
    } else {
      updated = [memberData, ...members];
      showToast(`Successfully registered ${memberData.name}!`);
    }
    updateMembersList(updated);
    setEditingMember(null);
  };

  const handleDeleteMember = (memberToDelete) => {
    setAdminContactTarget(memberToDelete);
    showToast(`Action Restricted: Contact an admin to remove ${memberToDelete.name}`, 'warning');
  };

  const handleResetData = () => {
    if (window.confirm("Reset all member data back to the default 60 demo members?")) {
      updateMembersList(INITIAL_MEMBERS);
      setSearchQuery('');
      setSelectedTeam('All');
      setSelectedBranch('All');
      setSortBy('name_asc');
      showToast("Reset to default 60 GDG members!", "info");
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedTeam('All');
    setSelectedBranch('All');
    setSortBy('name_asc');
  };

  // Team counts for stats bar and badges
  const teamCounts = useMemo(() => {
    const counts = { All: members.length, Tech: 0, Media: 0, Design: 0, "PR & Management": 0 };
    members.forEach((m) => {
      if (counts[m.team] !== undefined) {
        counts[m.team]++;
      }
    });
    return counts;
  }, [members]);

  // Upcoming birthdays (within 30 days)
  const upcomingBirthdays = useMemo(() => {
    return members
      .map((m) => ({
        ...m,
        daysLeft: getDaysUntilBirthday(m.dob)
      }))
      .filter((m) => m.daysLeft <= 30)
      .sort((a, b) => a.daysLeft - b.daysLeft);
  }, [members]);

  // Filtered and Sorted Members
  const filteredMembers = useMemo(() => {
    let result = [...members];

    // Search query filter (search by name, or role/skills)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((m) => {
        const nameMatch = m.name.toLowerCase().includes(query);
        const roleMatch = m.role?.toLowerCase().includes(query);
        const branchMatch = m.branch?.toLowerCase().includes(query);
        const skillMatch = m.skills?.some((s) => s.toLowerCase().includes(query));
        return nameMatch || roleMatch || branchMatch || skillMatch;
      });
    }

    // Team filter
    if (selectedTeam !== 'All') {
      result = result.filter((m) => m.team === selectedTeam);
    }

    // Branch filter
    if (selectedBranch !== 'All') {
      result = result.filter((m) => m.branch === selectedBranch);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'name_asc') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'name_desc') {
        return b.name.localeCompare(a.name);
      }
      if (sortBy === 'dob_youngest') {
        // Youngest person has most recent DOB date
        return new Date(b.dob) - new Date(a.dob);
      }
      if (sortBy === 'dob_oldest') {
        // Oldest person has earliest DOB date
        return new Date(a.dob) - new Date(b.dob);
      }
      if (sortBy === 'upcoming_birthday') {
        return getDaysUntilBirthday(a.dob) - getDaysUntilBirthday(b.dob);
      }
      return 0;
    });

    return result;
  }, [members, searchQuery, selectedTeam, selectedBranch, sortBy]);

  const isFilteringActive = searchQuery.trim() !== '' || selectedTeam !== 'All' || selectedBranch !== 'All' || sortBy !== 'name_asc';

  return (
    <div className="members-page-wrapper">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`toast-notification ${toastMessage.type}`}>
          {toastMessage.type === 'success' ? (
            <CheckCircle size={18} />
          ) : toastMessage.type === 'warning' ? (
            <AlertTriangle size={18} />
          ) : (
            <AlertCircle size={18} />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Banner Navigation */}
      <div className="members-header-bar">
        <div className="container members-nav-flex">
          <button 
            type="button" 
            className="btn-back-home" 
            onClick={onNavigateHome}
          >
            <ArrowLeft size={18} />
            <span>Back to Home</span>
          </button>

          <div className="header-breadcrumbs">
            <span onClick={onNavigateHome} className="crumb-link">GDG ITER</span>
            <span className="crumb-sep">/</span>
            <span className="crumb-current">Member Management System</span>
          </div>

          <div className="header-quick-actions">
            <button 
              type="button" 
              className="btn-3d btn-sm"
              onClick={() => exportMembersToCSV(filteredMembers)}
              title="Export Current List to CSV"
            >
              <Download size={15} style={{ marginRight: '6px' }} />
              Export CSV
            </button>
            <button 
              type="button" 
              className="btn-primary btn-sm"
              onClick={() => {
                setEditingMember(null);
                setIsAddModalOpen(true);
              }}
            >
              <UserPlus size={15} style={{ marginRight: '6px' }} />
              Add Member
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '30px', paddingBottom: '100px' }}>
        {/* Page Hero */}
        <div className="members-hero-card glass-panel">
          <div className="members-hero-content">
            <div className="hero-badge">
              <Sparkles size={16} color="var(--neon-blue)" />
              <span>GDG Community Roster & Administration</span>
            </div>
            <h1 className="glow-text-blue" style={{ fontSize: '2.8rem', marginTop: '10px', marginBottom: '10px' }}>
              Members Management Directory
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '750px' }}>
              Search, filter by branch & team, track birthdays, and manage records for all <strong>{members.length}</strong> active Google Developers Group ITER community members.
            </p>
          </div>

          {/* Quick Team Stat Cards */}
          <div className="team-stats-grid">
            <div 
              className={`stat-card ${selectedTeam === 'All' ? 'active-stat' : ''}`}
              onClick={() => setSelectedTeam('All')}
            >
              <div className="stat-card-icon" style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#fff' }}>
                <Users size={20} />
              </div>
              <div className="stat-card-data">
                <span className="stat-number">{teamCounts.All}</span>
                <span className="stat-label">All Members</span>
              </div>
            </div>

            <div 
              className={`stat-card ${selectedTeam === 'Tech' ? 'active-stat' : ''}`}
              onClick={() => setSelectedTeam('Tech')}
              style={{ '--stat-glow': '#00e5ff' }}
            >
              <div className="stat-card-icon" style={{ background: 'rgba(0, 229, 255, 0.15)', color: '#00e5ff' }}>
                <Code size={20} />
              </div>
              <div className="stat-card-data">
                <span className="stat-number" style={{ color: '#00e5ff' }}>{teamCounts.Tech}</span>
                <span className="stat-label">Tech Team</span>
              </div>
            </div>

            <div 
              className={`stat-card ${selectedTeam === 'Media' ? 'active-stat' : ''}`}
              onClick={() => setSelectedTeam('Media')}
              style={{ '--stat-glow': '#d946ef' }}
            >
              <div className="stat-card-icon" style={{ background: 'rgba(217, 70, 239, 0.15)', color: '#d946ef' }}>
                <Video size={20} />
              </div>
              <div className="stat-card-data">
                <span className="stat-number" style={{ color: '#d946ef' }}>{teamCounts.Media}</span>
                <span className="stat-label">Media Team</span>
              </div>
            </div>

            <div 
              className={`stat-card ${selectedTeam === 'Design' ? 'active-stat' : ''}`}
              onClick={() => setSelectedTeam('Design')}
              style={{ '--stat-glow': '#f43f5e' }}
            >
              <div className="stat-card-icon" style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e' }}>
                <Palette size={20} />
              </div>
              <div className="stat-card-data">
                <span className="stat-number" style={{ color: '#f43f5e' }}>{teamCounts.Design}</span>
                <span className="stat-label">Design Team</span>
              </div>
            </div>

            <div 
              className={`stat-card ${selectedTeam === 'PR & Management' ? 'active-stat' : ''}`}
              onClick={() => setSelectedTeam('PR & Management')}
              style={{ '--stat-glow': '#ffb800' }}
            >
              <div className="stat-card-icon" style={{ background: 'rgba(255, 184, 0, 0.15)', color: '#ffb800' }}>
                <Briefcase size={20} />
              </div>
              <div className="stat-card-data">
                <span className="stat-number" style={{ color: '#ffb800' }}>{teamCounts['PR & Management']}</span>
                <span className="stat-label">PR & Mgmt</span>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Birthdays Spotlight Banner */}
        {upcomingBirthdays.length > 0 && (
          <div className="upcoming-bday-banner glass-panel">
            <div className="bday-banner-header">
              <div className="bday-banner-title">
                <Cake size={20} color="#ffb800" />
                <span>Upcoming Birthdays This Month ({upcomingBirthdays.length})</span>
              </div>
              <span className="bday-banner-sub">Don't forget to wish your fellow team members!</span>
            </div>
            <div className="bday-chips-scroll">
              {upcomingBirthdays.slice(0, 8).map((m) => (
                <div 
                  key={m.id} 
                  className="bday-mini-chip"
                  onClick={() => setViewingMember(m)}
                >
                  <img src={m.avatar} alt={m.name} className="bday-mini-avatar" />
                  <div className="bday-mini-info">
                    <span className="bday-mini-name">{m.name}</span>
                    <span className="bday-mini-date">
                      {m.daysLeft === 0 ? 'Today 🎉' : `in ${m.daysLeft} days`} ({formatDOB(m.dob).slice(0, 6)})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search, Filter & Controls Panel */}
        <div className="controls-panel glass-panel">
          {/* Main Search Row */}
          <div className="search-row">
            <div className="search-input-wrapper">
              <Search size={20} className="search-icon" />
              <input 
                type="text"
                placeholder="Search member name, role, branch, skill... (e.g. Aarav, Flutter, CSE Core)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button 
                  type="button" 
                  className="search-clear-btn"
                  onClick={() => setSearchQuery('')}
                  title="Clear Search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* View Mode Toggle (Grid vs Table) */}
            <div className="view-mode-toggle">
              <button 
                type="button"
                className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Cards Grid View"
              >
                <LayoutGrid size={18} />
              </button>
              <button 
                type="button"
                className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => setViewMode('table')}
                title="Management Table View"
              >
                <Table size={18} />
              </button>
            </div>
          </div>

          {/* Filters and Sort Controls Row */}
          <div className="filters-row">
            {/* Team Pills */}
            <div className="filter-group team-pills-group">
              <span className="filter-label">Team:</span>
              <div className="pills-container">
                {TEAMS.map((team) => {
                  const count = teamCounts[team] || 0;
                  const isActive = selectedTeam === team;
                  return (
                    <button
                      key={team}
                      type="button"
                      className={`filter-pill ${isActive ? 'active' : ''}`}
                      onClick={() => setSelectedTeam(team)}
                    >
                      {team}
                      <span className="pill-badge">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="filter-dropdowns-group">
              {/* Branch Filter */}
              <div className="filter-select-wrapper">
                <span className="filter-label">Branch:</span>
                <select 
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="filter-select"
                >
                  {BRANCHES.map((b) => (
                    <option key={b} value={b}>
                      {b === 'All' ? 'All Branches (CSE, AIML, IOT, CSIT)' : b}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By Dropdown */}
              <div className="filter-select-wrapper">
                <span className="filter-label">Sort By:</span>
                <div className="sort-select-box">
                  <ArrowUpDown size={15} className="sort-icon" />
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="filter-select"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Reset Data and Clear Filters */}
              {isFilteringActive && (
                <button 
                  type="button" 
                  className="btn-clear-filters"
                  onClick={handleClearFilters}
                  title="Clear all active filters"
                >
                  <RefreshCw size={14} />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>
          </div>

          {/* Active Filter Results Summary */}
          <div className="results-summary-row">
            <div className="results-count">
              Showing <span className="highlight-count">{filteredMembers.length}</span> of {members.length} members
              {searchQuery && <span className="search-for-tag"> matching "{searchQuery}"</span>}
              {selectedTeam !== 'All' && <span className="active-tag"> • {selectedTeam}</span>}
              {selectedBranch !== 'All' && <span className="active-tag"> • {selectedBranch}</span>}
            </div>

            <div className="results-summary-right">
              <button 
                type="button" 
                className="btn-subtle-link"
                onClick={handleResetData}
                title="Restore default 60 demo members"
              >
                Restore 60 Demo Records
              </button>
            </div>
          </div>
        </div>

        {/* Members Content Area (Grid or Table) */}
        {filteredMembers.length === 0 ? (
          <div className="empty-results-box glass-panel">
            <div className="empty-icon-circle">
              <Search size={36} color="var(--neon-blue)" />
            </div>
            <h3>No Members Found</h3>
            <p>
              No members matched your search for <strong>"{searchQuery || selectedTeam + ' / ' + selectedBranch}"</strong>.
            </p>
            <div style={{ marginTop: '20px', display: 'flex', gap: '15px' }}>
              <button className="btn-3d" onClick={handleClearFilters}>
                Clear All Filters
              </button>
              <button 
                className="btn-primary" 
                onClick={() => {
                  setEditingMember(null);
                  setIsAddModalOpen(true);
                }}
              >
                + Add Member
              </button>
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          /* GRID VIEW */
          <div className="members-grid-container">
            {filteredMembers.map((member) => (
              <MemberCard 
                key={member.id}
                member={member}
                onView={setViewingMember}
                onDelete={handleDeleteMember}
              />
            ))}
          </div>
        ) : (
          /* TABLE VIEW */
          <div className="table-wrapper glass-panel">
            <table className="members-management-table">
              <thead>
                <tr>
                  <th>Member Name</th>
                  <th>Role</th>
                  <th>Team</th>
                  <th>Branch</th>
                  <th>Date of Birth</th>
                  <th>Year</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((m) => {
                  const teamMeta = getTeamMeta(m.team);
                  const branchMeta = getBranchMeta(m.branch);
                  const age = calculateAge(m.dob);
                  const daysLeft = getDaysUntilBirthday(m.dob);

                  return (
                    <tr key={m.id} onClick={() => setViewingMember(m)} className="table-row-hover">
                      <td>
                        <div className="table-user-cell">
                          <img 
                            src={m.avatar} 
                            alt={m.name} 
                            className="table-avatar"
                            onError={(e) => {
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=111&color=fff`;
                            }}
                          />
                          <div>
                            <div className="table-user-name">{m.name}</div>
                            <div className="table-user-email">{m.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="table-role-text">{m.role}</span>
                      </td>
                      <td>
                        <span 
                          className="team-badge"
                          style={{
                            color: teamMeta.color,
                            background: teamMeta.bgColor,
                            borderColor: teamMeta.borderColor
                          }}
                        >
                          {m.team}
                        </span>
                      </td>
                      <td>
                        <span 
                          className="branch-badge"
                          style={{
                            color: branchMeta.color,
                            background: branchMeta.bg,
                            border: `1px solid ${branchMeta.color}40`
                          }}
                        >
                          {m.branch}
                        </span>
                      </td>
                      <td>
                        <div className="table-dob-cell">
                          <Cake size={14} color="#ffb800" style={{ marginRight: '6px' }} />
                          <span>{formatDOB(m.dob)}</span>
                          <span className="table-age-muted">({age}y)</span>
                          {daysLeft <= 30 && (
                            <span className="bday-badge-small">
                              {daysLeft === 0 ? 'Today!' : `${daysLeft}d`}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="table-year-text">{m.year}</span>
                      </td>
                      <td>
                        <span className={`table-status-pill ${m.status.toLowerCase()}`}>
                          {m.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                        <div className="table-actions-cell">
                          <button 
                            type="button"
                            className="btn-table-action"
                            onClick={() => setViewingMember(m)}
                            title="View Profile"
                          >
                            View
                          </button>
                          <button 
                            type="button"
                            className="btn-table-action edit"
                            onClick={() => {
                              setEditingMember(m);
                              setIsAddModalOpen(true);
                            }}
                            title="Edit Member"
                          >
                            Edit
                          </button>
                          <button 
                            type="button"
                            className="btn-table-action delete"
                            onClick={() => handleDeleteMember(m)}
                            title="Delete Member"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Member Profile Modal */}
      {viewingMember && (
        <MemberDetailModal 
          member={viewingMember}
          onClose={() => setViewingMember(null)}
          onEdit={(m) => {
            setEditingMember(m);
            setIsAddModalOpen(true);
          }}
          onDelete={handleDeleteMember}
        />
      )}

      {/* Add / Edit Member Modal */}
      <AddEditMemberModal 
        key={editingMember?.id || 'new'}
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingMember(null);
        }}
        onSave={handleSaveMember}
        editingMember={editingMember}
      />

      {/* Contact Admin Modal upon Delete Attempt */}
      {adminContactTarget && (
        <AdminContactModal 
          member={adminContactTarget}
          onClose={() => setAdminContactTarget(null)}
        />
      )}
    </div>
  );
};

export default MemberManagement;
