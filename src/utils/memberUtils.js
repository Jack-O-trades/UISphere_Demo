// Utility functions for member management, birthday calculations, and export

export const formatDOB = (dobString) => {
  if (!dobString) return "N/A";
  const date = new Date(dobString);
  if (isNaN(date.getTime())) return dobString;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
};

export const calculateAge = (dobString) => {
  if (!dobString) return null;
  const dob = new Date(dobString);
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) {
    age--;
  }
  return age;
};

// Calculates days remaining until the member's next birthday
export const getDaysUntilBirthday = (dobString) => {
  if (!dobString) return 999;
  const today = new Date();
  const dob = new Date(dobString);
  
  const currentYearBirthday = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
  let nextBirthday = currentYearBirthday;
  
  // Normalize times to midnight for accurate day difference
  today.setHours(0, 0, 0, 0);
  nextBirthday.setHours(0, 0, 0, 0);
  
  if (nextBirthday < today) {
    nextBirthday = new Date(today.getFullYear() + 1, dob.getMonth(), dob.getDate());
    nextBirthday.setHours(0, 0, 0, 0);
  }
  
  const diffTime = nextBirthday.getTime() - today.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
};

export const isBirthdayThisMonth = (dobString) => {
  if (!dobString) return false;
  const dob = new Date(dobString);
  const now = new Date();
  return dob.getMonth() === now.getMonth();
};

export const isBirthdayToday = (dobString) => {
  if (!dobString) return false;
  const dob = new Date(dobString);
  const now = new Date();
  return dob.getMonth() === now.getMonth() && dob.getDate() === now.getDate();
};

export const getTeamMeta = (team) => {
  switch (team) {
    case "Tech":
      return {
        color: "#00e5ff",
        bgColor: "rgba(0, 229, 255, 0.12)",
        borderColor: "rgba(0, 229, 255, 0.35)",
        gradient: "linear-gradient(135deg, #00e5ff, #0077ff)",
        badgeText: "Tech",
        shadow: "rgba(0, 229, 255, 0.25)"
      };
    case "Media":
      return {
        color: "#d946ef",
        bgColor: "rgba(217, 70, 239, 0.12)",
        borderColor: "rgba(217, 70, 239, 0.35)",
        gradient: "linear-gradient(135deg, #d946ef, #8b5cf6)",
        badgeText: "Media",
        shadow: "rgba(217, 70, 239, 0.25)"
      };
    case "Design":
      return {
        color: "#f43f5e",
        bgColor: "rgba(244, 63, 94, 0.12)",
        borderColor: "rgba(244, 63, 94, 0.35)",
        gradient: "linear-gradient(135deg, #f43f5e, #fb923c)",
        badgeText: "Design",
        shadow: "rgba(244, 63, 94, 0.25)"
      };
    case "PR & Management":
      return {
        color: "#ffb800",
        bgColor: "rgba(255, 184, 0, 0.12)",
        borderColor: "rgba(255, 184, 0, 0.35)",
        gradient: "linear-gradient(135deg, #ffb800, #ff8400)",
        badgeText: "PR & Mgmt",
        shadow: "rgba(255, 184, 0, 0.25)"
      };
    default:
      return {
        color: "#94a3b8",
        bgColor: "rgba(148, 163, 184, 0.12)",
        borderColor: "rgba(148, 163, 184, 0.35)",
        gradient: "linear-gradient(135deg, #64748b, #94a3b8)",
        badgeText: team,
        shadow: "rgba(148, 163, 184, 0.2)"
      };
  }
};

export const getBranchMeta = (branch) => {
  switch (branch) {
    case "CSE Core":
      return { label: "CSE Core", color: "#38bdf8", bg: "rgba(56, 189, 248, 0.15)" };
    case "AIML":
      return { label: "AIML", color: "#a855f7", bg: "rgba(168, 85, 247, 0.15)" };
    case "IOT":
      return { label: "IOT", color: "#34d399", bg: "rgba(52, 211, 153, 0.15)" };
    case "CSIT":
      return { label: "CSIT", color: "#fbbf24", bg: "rgba(251, 191, 36, 0.15)" };
    default:
      return { label: branch, color: "#cbd5e1", bg: "rgba(203, 213, 225, 0.1)" };
  }
};

export const exportMembersToCSV = (members) => {
  const headers = ["ID", "Name", "Team", "Role", "Branch", "Date of Birth", "Year", "Email", "Phone", "Status"];
  const rows = members.map((m) => [
    m.id,
    `"${m.name.replace(/"/g, '""')}"`,
    `"${m.team}"`,
    `"${m.role}"`,
    `"${m.branch}"`,
    m.dob,
    `"${m.year}"`,
    `"${m.email}"`,
    `"${m.phone || ''}"`,
    `"${m.status}"`
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `gdg_iter_members_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
