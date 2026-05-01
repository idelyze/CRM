import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

// ─── SVG Icon helper ────────────────────────────────────────────────────────
function Icon({ d, size = 18, className = "", fill = "none" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
      strokeLinejoin="round" className={className}>
      {Array.isArray(d)
        ? d.map((p, i) => <path key={i} d={p} />)
        : <path d={d} />}
    </svg>
  );
}

const IC = {
  home: ["M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z", "M9 22V12h6v10"],
  users: ["M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2", "M9 7a4 4 0 100 8 4 4 0 000-8z", "M23 21v-2a4 4 0 00-3-3.87", "M16 3.13a4 4 0 010 7.75"],
  calendar: ["M8 2v4", "M16 2v4", "M3 10h18", "M21 8a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2z"],
  plus: ["M12 5v14", "M5 12h14"],
  edit: ["M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7", "M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"],
  trash: ["M3 6h18", "M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6", "M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"],
  x: ["M18 6L6 18", "M6 6l12 12"],
  bell: ["M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9", "M13.73 21a2 2 0 01-3.46 0"],
  settings: ["M12 15a3 3 0 100-6 3 3 0 000 6z", "M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"],
  alert: ["M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z", "M12 9v4", "M12 17h.01"],
  clock: ["M12 2a10 10 0 100 20A10 10 0 0012 2z", "M12 6v6l4 2"],
  tag: ["M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z", "M7 7h.01"],
  phone: "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.5a19.79 19.79 0 01-3.07-8.6A2 2 0 012 .82h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8a16 16 0 006.09 6.09l.61-.61a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7a2 2 0 011.72 2.04z",
  check: "M20 6L9 17l-5-5",
};

// ─── Constants ───────────────────────────────────────────────────────────────
const EMPTY_FORM = {
  name: "",
  phone: "",
  status: "New",
  notes: "",
  services: "",
  follow_up_date: "",
  priority: "",
  next_action: ""
};

const STATUS = {
  New: { bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-400" },
  Interested: { bg: "bg-amber-50", text: "text-amber-600", dot: "bg-amber-400" },
  Closed: { bg: "bg-green-50", text: "text-green-600", dot: "bg-green-500" },
};

const PRIORITY_OVERDUE = { bg: "bg-red-50", text: "text-red-500", label: "Overdue" };
const PRIORITY_TODAY = { bg: "bg-blue-50", text: "text-blue-500", label: "Today" };

// ─── Avatar ──────────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  "bg-violet-100 text-violet-600",
  "bg-sky-100 text-sky-600",
  "bg-amber-100 text-amber-600",
  "bg-rose-100 text-rose-600",
  "bg-emerald-100 text-emerald-600",
  "bg-indigo-100 text-indigo-600",
];

function Avatar({ name, size = "w-9 h-9" }) {
  const idx = (name?.charCodeAt(0) || 0) % AVATAR_COLORS.length;
  return (
    <div className={`${size} rounded-full ${AVATAR_COLORS[idx]} flex items-center justify-center font-semibold text-sm shrink-0`}>
      {name?.charAt(0)?.toUpperCase() || "?"}
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const s = STATUS[status] || STATUS.New;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────
function Sidebar({ activeNav, setActiveNav }) {
  const top = [
    { key: "dashboard", icon: IC.home },
    { key: "leads", icon: IC.users },
    { key: "followups", icon: IC.calendar },
    { key: "calendar", icon: IC.clock },
  ];

  return (
    <aside className="w-16 shrink-0 bg-white border-r border-gray-100 flex flex-col items-center py-5 h-screen sticky top-0 z-20">
      {/* Logo mark */}
      <div className="w-9 h-9 bg-gray-900 rounded-xl flex items-center justify-center mb-8">
        <span className="text-white font-bold text-sm">I</span>
      </div>

      {/* Top nav */}
      <nav className="flex flex-col items-center gap-1 flex-1">
        {top.map(({ key, icon }) => (
          <button
            key={key}
            onClick={() => setActiveNav(key)}
            title={key.charAt(0).toUpperCase() + key.slice(1)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150
              ${activeNav === key
                ? "bg-gray-900 text-white shadow-sm"
                : "text-gray-400 hover:bg-gray-100 hover:text-gray-700"}`}
          >
            <Icon d={icon} size={17} />
          </button>
        ))}
      </nav>

      {/* Bottom icons */}
      <div className="flex flex-col items-center gap-1">
        <button className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-all">
          <Icon d={IC.bell} size={17} />
        </button>
        <button className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-all">
          <Icon d={IC.settings} size={17} />
        </button>
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mt-2 cursor-pointer">
          <span className="text-gray-600 font-semibold text-xs">U</span>
        </div>
      </div>
    </aside>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon, active, onClick, warn }) {
  return (
    <button
      onClick={onClick}
      className={`text-left p-5 rounded-2xl border transition-all duration-200 w-full ${active
          ? "bg-emerald-600 border-emerald-600 shadow-lg shadow-emerald-200 scale-[1.02]"
          : "bg-white border-gray-100 hover:border-emerald-200 hover:shadow-md"
        }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center
          ${active ? "bg-white/15" : warn ? "bg-red-50" : "bg-gray-50"}`}>
          <Icon d={icon} size={15} className={active ? "text-white" : warn ? "text-red-400" : "text-gray-500"} />
        </div>
        {warn && !active && (
          <span className="text-xs font-semibold bg-red-50 text-red-400 px-2 py-0.5 rounded-full">!</span>
        )}
      </div>
      <p className={`text-xs font-medium mb-1 ${active ? "text-gray-400" : "text-gray-400"}`}>{label}</p>
      <p className={`text-3xl font-semibold tracking-tight ${active ? "text-white" : "text-gray-900"}`}>{value}</p>
      <p className={`text-[11px] mt-1 ${active ? "text-white/70" : "text-gray-400"
        }`}>
        {sub}
      </p>
    </button>
  );
}

// ─── Pipeline Mini Chart (SVG bars) ──────────────────────────────────────────
function PipelineChart({ leads }) {
  const counts = {
    New: leads.filter(l => l.status === "New").length,
    Interested: leads.filter(l => l.status === "Interested").length,
    Closed: leads.filter(l => l.status === "Closed").length,
  };
  const max = Math.max(...Object.values(counts), 1);
  const bars = [
    { label: "New", count: counts.New, color: "#93c5fd" },
    { label: "Interested", count: counts.Interested, color: "#fcd34d" },
    { label: "Closed", count: counts.Closed, color: "#6ee7b7" },
  ];
  const BAR_H = 80;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-gray-800">Pipeline Overview</h3>
          <p className="text-xs text-gray-400 mt-0.5">{leads.length} total leads</p>
        </div>
      </div>
      <div className="flex items-end gap-6 px-2">
        {bars.map(({ label, count, color }) => {
          const h = max === 0 ? 8 : Math.max(8, (count / max) * BAR_H);
          return (
            <div key={label} className="flex flex-col items-center gap-2 flex-1">
              <span className="text-xs font-semibold text-gray-700">
                {count} ({Math.round((count / leads.length) * 100) || 0}%)
              </span>
              <div className="w-full rounded-t-lg transition-all duration-500" style={{ height: h, backgroundColor: color }} />
              <span className="text-xs text-gray-400">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Leads Table ─────────────────────────────────────────────────────────────
function LeadsTable({ leads, onEdit, onDelete, onStatusChange, snoozeFollowUp }) {
  const todayStr = new Date().toISOString().split("T")[0];

  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-300">
        <Icon d={IC.users} size={36} />
        <p className="text-sm mt-3 text-gray-500 font-medium">No leads found</p>
        <p className="text-xs text-gray-400 mt-1">Try adjusting your filters or add a new lead</p>
      </div>
    );
  }

  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-100">
          <th className="text-left text-xs font-medium text-gray-400 pb-3 pl-1">Lead</th>
          <th className="text-left text-xs font-medium text-gray-400 pb-3">Service</th>
          <th className="text-left text-xs font-medium text-gray-400 pb-3">Follow-up</th>
          <th className="text-left text-xs font-medium text-gray-400 pb-3">Status</th>
          <th className="text-right text-xs font-medium text-gray-400 pb-3 pr-1">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50">
        {leads.map((lead) => {
          const isOverdue = lead.follow_up_date && lead.follow_up_date < todayStr;
          return (
            <tr key={lead.id} className="group hover:bg-gray-50/60 transition-colors">
              {/* Lead */}
              <td className="py-3.5 pl-1">
                <div className="flex items-center gap-3">
                  <Avatar name={lead.name} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{lead.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{lead.phone}</p>
                  </div>
                </div>
              </td>
              {/* Service */}
              <td className="py-3.5">
                <p className="text-sm text-gray-600 truncate max-w-32">
                  {lead.services || <span className="text-gray-300">—</span>}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${lead.priority === "High" ? "bg-red-50 text-red-500" :
                      lead.priority === "Medium" ? "bg-yellow-50 text-yellow-600" :
                        "bg-gray-100 text-gray-500"
                    }`}>
                    {lead.priority || "Medium"}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {lead.next_action || "No next action"}
                </p>
              </td>
              {/* Follow-up */}
              <td className="py-3.5">
                {lead.follow_up_date ? (
                  <span className={`text-xs font-medium flex items-center gap-1.5
                    ${isOverdue ? "text-red-500" : "text-gray-500"}`}>
                    <Icon d={isOverdue ? IC.alert : IC.clock} size={12} />
                    {lead.follow_up_date}
                  </span>
                ) : (
                  <span className="text-gray-300 text-xs">Not set</span>
                )}
              </td>
              {/* Status */}
              <td className="py-3.5">
                <div className="flex items-center gap-1">
                  {Object.keys(STATUS).map((s) => (
                    <button
                      key={s}
                      onClick={() => onStatusChange(lead.id, s)}
                      className={`text-xs px-2 py-1 rounded-lg font-medium transition-all
                        ${lead.status === s
                          ? `${STATUS[s].bg} ${STATUS[s].text}`
                          : "text-gray-300 hover:text-gray-500 hover:bg-gray-100"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </td>
              {/* Actions */}
              <td className="py-3.5 pr-1">
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(lead)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                  >
                    <Icon d={IC.edit} size={13} />
                  </button>
                  <button
                    onClick={() => onDelete(lead.id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <Icon d={IC.trash} size={13} />
                  </button>
                  <button
                    onClick={() => snoozeFollowUp(lead.id, 1)}
                    className="text-[10px] px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200"
                  >
                    +1d
                  </button>
                  <button
                    onClick={() => snoozeFollowUp(lead.id, 3)}
                    className="text-[10px] px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200"
                  >
                    +3d
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

// ─── Follow-ups Panel ─────────────────────────────────────────────────────────
function FollowUpsPanel({ leads }) {
  const todayStr = new Date().toISOString().split("T")[0];

  const overdueLeads = leads.filter(
    (l) => l.follow_up_date && l.follow_up_date < todayStr
  );

  const todayLeads = leads.filter(
    (l) => l.follow_up_date === todayStr
  );

  const upcomingLeads = leads.filter(
    (l) => l.follow_up_date && l.follow_up_date > todayStr
  );

  const itemsFull = [
    ...overdueLeads.map(l => ({ ...l, _priority: PRIORITY_OVERDUE })),
    ...todayLeads.map(l => ({ ...l, _priority: PRIORITY_TODAY })),
    ...upcomingLeads.map(l => ({
      ...l,
      _priority: {
        bg: "bg-gray-50",
        text: "text-gray-500",
        label: "Upcoming"
      }
    })),
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 h-full shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-gray-800">Follow-ups</h3>
        <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full font-medium">
          {itemsFull.length} pending
        </span>
      </div>

      {itemsFull.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center mb-3">
            <Icon d={IC.check} size={16} className="text-green-500" />
          </div>
          <p className="text-sm text-gray-500 font-medium">All clear!</p>
          <p className="text-xs text-gray-400 mt-1">No pending follow-ups</p>
        </div>
      ) : (
        <div className="space-y-3">
          {itemsFull.map((lead) => (
            <div
              key={`${lead.id}-${lead._priority.label}`}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
            >
              <Avatar name={lead.name} size="w-8 h-8" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{lead.name}</p>
                <p className="text-[11px] text-gray-400 truncate">
                  {lead.next_action || "No next action"}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Icon d={IC.calendar} size={10} className="text-gray-300 shrink-0" />
                  <p className="text-xs text-gray-400">{lead.follow_up_date}</p>
                </div>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${lead.priority === "High"
                    ? "bg-red-50 text-red-500"
                    : lead.priority === "Medium"
                      ? "bg-yellow-50 text-yellow-600"
                      : "bg-gray-100 text-gray-500"
                  }`}
              >
                {lead.priority || "Medium"}
              </span>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0
                  ${lead._priority.bg} ${lead._priority.text}`}
              >
                {lead._priority.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Lead Modal ───────────────────────────────────────────────────────────────
function LeadModal({ form, setForm, editingId, onSubmit, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              {editingId ? "Edit Lead" : "New Lead"}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {editingId ? "Update the lead details below" : "Fill in the details to add a new lead"}
            </p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
            <Icon d={IC.x} size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Name <span className="text-red-400">*</span></label>
              <input
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Phone <span className="text-red-400">*</span></label>
              <input
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Service</label>
              <select
                value={form.services || ""}
                onChange={(e) => setForm({ ...form, services: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all"
              >
                <option value="">Select service</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Web Development">Web Development</option>
                <option value="SEO">SEO</option>
                <option value="Branding">Branding</option>
                <option value="Social Media">Social Media</option>
                <option value="Digital Systems">Digital Systems</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Follow-up Date</label>
              <input
                type="date"
                value={form.follow_up_date}
                onChange={(e) => setForm({ ...form, follow_up_date: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Notes</label>
            <input
              placeholder="Any notes about this lead..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Priority</label>
            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/10"
              required
            >
              <option value="">Select priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          {/* Next Action */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Next Action</label>
            <input
              placeholder="Call client, send proposal..."
              value={form.next_action}
              onChange={(e) => setForm({ ...form, next_action: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/10"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all"
            >
              <option>New</option>
              <option>Interested</option>
              <option>Closed</option>
            </select>
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all">
              Cancel
            </button>
            <button type="submit"
              className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition-all shadow-sm">
              {editingId ? "Save Changes" : "Add Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Kanban View (for Leads page) ─────────────────────────────────────────────
function KanbanView({ leads, onEdit, onDelete, onStatusChange, snoozeFollowUp }) {
  const todayStr = new Date().toISOString().split("T")[0];
  const grouped = {
    New: leads.filter(l => l.status === "New"),
    Interested: leads.filter(l => l.status === "Interested"),
    Closed: leads.filter(l => l.status === "Closed"),
  };

  const COL_TOP = {
    New: "border-t-blue-300",
    Interested: "border-t-amber-300",
    Closed: "border-t-green-400",
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {Object.entries(grouped).map(([status, colLeads]) => (
        <div key={status} className={`bg-white rounded-2xl border-t-2 border border-gray-100 ${COL_TOP[status]} p-4`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${STATUS[status].dot}`} />
              <h3 className="text-sm font-semibold text-gray-700">{status}</h3>
            </div>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS[status].bg} ${STATUS[status].text}`}>
              {colLeads.length}
            </span>
          </div>

          <div className="space-y-3 overflow-y-auto" style={{ maxHeight: "calc(100vh - 280px)" }}>
            {colLeads.length === 0 ? (
              <div className="flex flex-col items-center py-10 text-center">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <Icon d={IC.users} size={16} className="text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 font-medium">No leads in {status}</p>
                <p className="text-xs text-gray-400 mt-1">Try adding a new lead or changing filters</p>
              </div>
            ) : (
              colLeads.map((lead) => {
                const isOverdue = lead.follow_up_date && lead.follow_up_date < todayStr;
                return (
                  <div key={lead.id}
                    className="p-3.5 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all group bg-gray-50/50">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={lead.name} size="w-7 h-7" />
                        <div>
                          <p className="text-sm font-semibold text-gray-900 leading-tight">{lead.name}</p>
                          <p className="text-xs text-gray-400">{lead.phone}</p>
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => onEdit(lead)}
                          className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-300 hover:text-gray-600 hover:bg-gray-200 transition-colors">
                          <Icon d={IC.edit} size={11} />
                        </button>
                        <button onClick={() => onDelete(lead.id)}
                          className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors">
                          <Icon d={IC.trash} size={11} />
                        </button>
                        <button
                          onClick={() => snoozeFollowUp(lead.id, 1)}
                          className="text-[10px] px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200"
                        >
                          +1d
                        </button>
                        <button
                          onClick={() => snoozeFollowUp(lead.id, 3)}
                          className="text-[10px] px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200"
                        >
                          +3d
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {lead.next_action || "No next action"}
                    </p>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${lead.priority === "High" ? "bg-red-50 text-red-500" :
                          lead.priority === "Medium" ? "bg-yellow-50 text-yellow-600" :
                            "bg-gray-100 text-gray-500"
                        }`}>
                        {lead.priority || "Medium"}
                      </span>
                    </div>
                    {lead.services && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1.5">
                        <Icon d={IC.tag} size={10} />
                        {lead.services}
                      </div>
                    )}
                    {lead.follow_up_date && (
                      <div className="flex items-center justify-between mb-2">
                        <div className={`flex items-center gap-1.5 text-xs ${isOverdue ? "text-red-400" : "text-gray-400"}`}>
                          <Icon d={isOverdue ? IC.alert : IC.clock} size={10} />
                          {lead.follow_up_date}
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${isOverdue ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-500"
                          }`}>
                          {isOverdue ? "Overdue" : "Upcoming"}
                        </span>
                      </div>
                    )}
                    <div className="flex gap-1 pt-2 border-t border-gray-100">
                      {Object.keys(STATUS).map((s) => (
                        <button key={s} onClick={() => onStatusChange(lead.id, s)}
                          className={`flex-1 text-center text-xs py-1 rounded-lg font-medium transition-all
                            ${lead.status === s ? `${STATUS[s].bg} ${STATUS[s].text}` : "text-gray-300 hover:bg-gray-100"}`}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Full Follow-ups Page ─────────────────────────────────────────────────────
function FollowUpsPage({ overdueLeads, todayLeads }) {
  const Section = ({ title, leads, color, empty }) => (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        <span className="ml-auto text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
          {leads.length}
        </span>
      </div>
      {leads.length === 0 ? (
        <p className="text-sm text-gray-400 italic">{empty}</p>
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => (
            <div key={lead.id} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100/60 transition-colors">
              <Avatar name={lead.name} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">{lead.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{lead.phone}</p>
              </div>
              {lead.services && (
                <span className="text-xs text-gray-500 bg-white border border-gray-100 px-2.5 py-1 rounded-lg">
                  {lead.services}
                </span>
              )}
              <div className="text-right shrink-0">
                <p className="text-xs font-medium text-gray-600">{lead.follow_up_date}</p>
                <StatusBadge status={lead.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <Section title="Overdue" leads={overdueLeads} color="bg-red-400" empty="No overdue follow-ups 🎉" />
      <Section title="Today" leads={todayLeads} color="bg-blue-400" empty="Nothing scheduled for today" />
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  // ─── Calendar View ─────────────────────────────────────────────
  function CalendarView({ leads, onEdit }) {
    const today = new Date();

    const days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(today.getDate() + i);
      return d;
    });

    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">
          Next 7 Days
        </h3>

        <div className="grid grid-cols-7 gap-3">
          {days.map((day) => {
            const dateStr = day.toISOString().split("T")[0];

            const dayLeads = leads
              .filter((l) => l.follow_up_date === dateStr)
              .sort((a, b) => {
                const order = { High: 0, Medium: 1, Low: 2 };
                return (order[a.priority] ?? 1) - (order[b.priority] ?? 1);
              });

            return (
              <div
                key={dateStr}
                className="bg-gray-50 rounded-xl p-3 min-h-35"
              >
                <p className="text-xs font-semibold text-gray-600 mb-2">
                  {day.toLocaleDateString("en-IN", {
                    weekday: "short",
                    day: "numeric",
                  })}
                </p>

                <div className="space-y-1">
                  {dayLeads.length === 0 ? (
                    <p className="text-[10px] text-gray-300">No tasks</p>
                  ) : (
                    dayLeads.map((lead) => (
                      <div
                        key={lead.id}
                        onClick={() => onEdit(lead)}
                        className={`cursor-pointer text-[10px] px-2 py-1 rounded-lg truncate hover:scale-[1.02] transition-all ${lead.priority === "High"
                            ? "bg-red-50 text-red-600"
                            : lead.priority === "Medium"
                              ? "bg-yellow-50 text-yellow-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                      >
                        {lead.name}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  const [leads, setLeads] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeNav, setActiveNav] = useState("dashboard");
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [dateRange, setDateRange] = useState("all"); // all | today | week

  useEffect(() => { fetchLeads(); }, []);

  async function fetchLeads() {
    setLoading(true);
    const { data, error } = await supabase.from("leads").select("*");

    console.log("FETCH RESULT:", data, error);

    if (error) {
      console.error("FETCH ERROR:", error);
    } else {
      setLeads(data || []);
    }
    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.phone || !form.priority || !form.next_action) {
      setToast("Fill all required fields");
      return;
    }

    setLoading(true);
    console.log("FORM STATE:", form);

    if (editingId) {
      await supabase.from("leads").update({
        name: form.name,
        phone: form.phone,
        status: form.status, // ✅ THIS WAS MISSING
        notes: form.notes,
        services: form.services || null,
        follow_up_date: form.follow_up_date || null,
        priority: form.priority,
        next_action: form.next_action || null,
      }).eq("id", editingId);
      setToast("Lead updated");
    } else {
      const payload = {
        name: form.name,
        phone: form.phone,
        status: form.status,
        notes: form.notes || null,
        services: form.services || null,
        follow_up_date: form.follow_up_date
          ? new Date(form.follow_up_date).toISOString().split("T")[0]
          : null,
        priority: form.priority,
        next_action: form.next_action || null,
      };

      const { data, error } = await supabase
        .from("leads")
        .insert([payload], { returning: "representation" });

      console.log("INSERT PAYLOAD:", payload);
      console.log("INSERT RESPONSE:", data, error);

      if (error) {
        console.error("SUPABASE INSERT ERROR:", error);
        setToast("Insert failed: " + error.message);
        setLoading(false);
        return;
      }

      if (!data) {
        console.warn("No data returned after insert");
      }

      setToast("Lead added");
      console.log("Refetching leads...");
    }

    setForm(EMPTY_FORM);
    setEditingId(null);
    setModalOpen(false);
    await fetchLeads();
    setLoading(false);

    setTimeout(() => setToast(""), 2000);
  }

  async function deleteLead(id) {
    setLoading(true);
    await supabase.from("leads").delete().eq("id", id);
    setToast("Lead deleted");
    await fetchLeads();
    setLoading(false);
    setTimeout(() => setToast(""), 2000);
  }

  async function updateStatus(id, newStatus) {
    setLoading(true);
    await supabase.from("leads").update({ status: newStatus }).eq("id", id);
    setToast("Status updated");
    await fetchLeads();
    setLoading(false);
    setTimeout(() => setToast(""), 2000);
  }

  async function snoozeFollowUp(id, days) {
    const lead = leads.find(l => l.id === id);
    if (!lead?.follow_up_date) return;

    const newDate = new Date(lead.follow_up_date);
    newDate.setDate(newDate.getDate() + days);

    setLoading(true);

    await supabase
      .from("leads")
      .update({ follow_up_date: newDate.toISOString().split("T")[0] })
      .eq("id", id);

    setToast(`Snoozed ${days} day(s)`);
    await fetchLeads();
    setLoading(false);
    setTimeout(() => setToast(""), 2000);
  }

  function openEdit(lead) {
    setEditingId(lead.id);
    setForm({
      name: lead.name || "",
      phone: lead.phone || "",
      status: lead.status || "New",
      notes: lead.notes || "",
      services: lead.services || "",
      follow_up_date: lead.follow_up_date || "",
      priority: lead.priority || "Medium",
      next_action: lead.next_action || "",
    });
    setModalOpen(true);
  }

  function openNew() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  const todayStr = new Date().toISOString().split("T")[0];
  const todayLeads = leads.filter(l => l.follow_up_date === todayStr);
  const overdueLeads = leads.filter(l => l.follow_up_date && l.follow_up_date < todayStr);

  const totalLeads = leads.length;

  const closedLeads = leads.filter(l => l.status === "Closed").length;

  const conversionRate =
    totalLeads === 0 ? 0 : Math.round((closedLeads / totalLeads) * 100);

  const overdueCount = overdueLeads.length;

  const overdueRate =
    totalLeads === 0 ? 0 : Math.round((overdueCount / totalLeads) * 100);

  const filteredLeads = leads
    .filter((l) => {
      const matchesSearch =
        l.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.phone?.includes(searchTerm) ||
        l.services?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesService =
        serviceFilter === "" ||
        l.services?.toLowerCase().includes(serviceFilter.toLowerCase());

      let matchesDate = true;
      if (dateRange === "today") {
        matchesDate = l.follow_up_date === todayStr;
      } else if (dateRange === "week") {
        const today = new Date();
        const next7 = new Date();
        next7.setDate(today.getDate() + 7);
        const leadDate = l.follow_up_date ? new Date(l.follow_up_date) : null;
        matchesDate = leadDate && leadDate >= today && leadDate <= next7;
      }

      if (activeFilter === "All") {
        return matchesSearch && matchesService && matchesDate;
      }

      if (activeFilter === "Overdue") {
        return (
          matchesSearch &&
          matchesService &&
          matchesDate &&
          l.follow_up_date &&
          l.follow_up_date < todayStr
        );
      }

      return (
        matchesSearch &&
        matchesService &&
        matchesDate &&
        l.status === activeFilter
      );
    })
    .sort((a, b) => {
      const priorityOrder = { High: 0, Medium: 1, Low: 2 };
      return (priorityOrder[a.priority] ?? 1) - (priorityOrder[b.priority] ?? 1);
    });

  const PAGE_TITLES = {
    dashboard: "Dashboard",
    leads: "Leads",
    followups: "Follow-ups",
    calendar: "Calendar",
  };
  const stats = [
    {
      key: "All",
      label: "Total Leads",
      value: totalLeads,
      sub: `${conversionRate}% converted`,
      icon: IC.users
    },
    {
      key: "New",
      label: "New",
      value: leads.filter(l => l.status === "New").length,
      sub: "Fresh leads",
      icon: IC.plus
    },
    {
      key: "Interested",
      label: "Interested",
      value: leads.filter(l => l.status === "Interested").length,
      sub: "Warm prospects",
      icon: IC.phone
    },
    {
      key: "Closed",
      label: "Closed",
      value: closedLeads,
      sub: `${conversionRate}% win rate`,
      icon: IC.check
    },
    {
      key: "Overdue",
      label: "Overdue",
      value: overdueCount,
      sub: `${overdueRate}% at risk`,
      icon: IC.alert,
      warn: true
    }
  ];

  const highestPriorityLead = [...leads]
    .filter(l => l.priority === "High")
    .sort((a, b) => {
      if (!a.follow_up_date) return 1;
      if (!b.follow_up_date) return -1;
      return new Date(a.follow_up_date) - new Date(b.follow_up_date);
    })[0];

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "#f0f2f7" }}>
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />

      <main className="flex-1 overflow-y-auto">
        {overdueLeads.length > 0 && (

          <div className="bg-red-50 border-b border-red-100 px-6 py-3 flex items-center justify-between">

            <p className="text-sm font-semibold text-red-600">

              {overdueLeads.length} overdue follow-ups — act now

            </p>

            <button

              onClick={() => setActiveNav("followups")}

              className="text-xs font-medium text-red-600 underline"

            >

              View

            </button>

          </div>

        )}
        {loading && (
          <div className="fixed top-4 right-4 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow">
            Loading...
          </div>
        )}

        {toast && (
          <div className="fixed top-4 right-4 bg-green-500 text-white text-xs px-3 py-2 rounded-lg shadow">
            {toast}
          </div>
        )}
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{PAGE_TITLES[activeNav]}</h1>
              <p className="text-xs text-gray-400 mt-1">
                {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
            <button
              onClick={openNew}
              className="flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-emerald-600 to-emerald-500 text-white text-sm font-semibold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-gray-200"
            >
              <Icon d={IC.plus} size={15} />
              New Lead
            </button>
          </div>

          {/* Search + Filters */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-3">
            <p className="text-xs text-gray-400 font-medium">Filters</p>
            <div className="flex items-center gap-3 flex-wrap">
              <input
                type="text"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-300 w-72"
              />

              <select
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/10"
              >
                <option value="">All Services</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Web Development">Web Development</option>
                <option value="SEO">SEO</option>
                <option value="Branding">Branding</option>
                <option value="Social Media">Social Media</option>
                <option value="Digital Systems">Digital Systems</option>
              </select>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/10"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="week">Next 7 days</option>
              </select>

              <div className="flex gap-2 flex-wrap">
                {["All", "New", "Interested", "Closed", "Overdue"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all duration-150
                      ${activeFilter === f
                        ? "bg-emerald-600 text-white shadow"
                        : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                      }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stats — always visible */}
          <div className="grid grid-cols-5 gap-4">
            {stats.map((s) => (
              <StatCard
                key={s.key}
                label={s.label}
                value={s.value}
                sub={s.sub}
                icon={s.icon}
                active={activeFilter === s.key}
                warn={s.warn}
                onClick={() => setActiveFilter(activeFilter === s.key ? "All" : s.key)}
              />
            ))}
          </div>

          {/* Dashboard */}
          {activeNav === "dashboard" && (
            <div className="grid grid-cols-3 gap-4">
              {/* Left: chart + table */}
              <div className="col-span-2 space-y-4">
                {highestPriorityLead && (
                  <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
                    <p className="text-xs text-red-500 font-semibold mb-1">
                      PRIORITY ACTION
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {highestPriorityLead.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {highestPriorityLead.next_action}
                    </p>
                  </div>
                )}
                <PipelineChart leads={leads} />
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-800">All Leads</h3>
                    {activeFilter !== "All" && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">
                          Filtered: <span className="font-semibold text-gray-600">{activeFilter}</span>
                        </span>
                        <button onClick={() => setActiveFilter("All")}
                          className="text-xs text-blue-500 hover:underline">Clear</button>
                      </div>
                    )}
                  </div>
                  <LeadsTable
                    leads={filteredLeads}
                    onEdit={openEdit}
                    onDelete={deleteLead}
                    onStatusChange={updateStatus}
                    snoozeFollowUp={snoozeFollowUp}
                  />
                </div>
              </div>
              {/* Right: follow-ups */}
              <div className="col-span-1">
                <FollowUpsPanel leads={leads} />
              </div>
            </div>
          )}

          {/* Leads — Kanban */}
          {activeNav === "leads" && (
            <KanbanView
              leads={filteredLeads}
              onEdit={openEdit}
              onDelete={deleteLead}
              onStatusChange={updateStatus}
              snoozeFollowUp={snoozeFollowUp}
            />
          )}

          {/* Follow-ups page */}
          {activeNav === "calendar" && (
            <CalendarView leads={leads} onEdit={openEdit} />
          )}

        </div>
      </main>

      {/* Modal */}
      {modalOpen && (
        <LeadModal
          form={form}
          setForm={setForm}
          editingId={editingId}
          onSubmit={handleSubmit}
          onClose={closeModal}
        />
      )}
    </div>
  );
}