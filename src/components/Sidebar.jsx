

import React from "react";

function Icon({ d, size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {Array.isArray(d)
        ? d.map((p, i) => <path key={i} d={p} />)
        : <path d={d} />}
    </svg>
  );
}

const IC = {
  home: ["M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z", "M9 22V12h6v10"],
  users: ["M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2", "M9 7a4 4 0 100 8 4 4 0 000-8z"],
  calendar: ["M8 2v4", "M16 2v4", "M3 10h18", "M21 8a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2z"],
  clock: ["M12 2a10 10 0 100 20A10 10 0 0012 2z", "M12 6v6l4 2"],
};

export default function Sidebar({ activeNav, setActiveNav }) {
  const navItems = [
    { key: "dashboard", icon: IC.home },
    { key: "leads", icon: IC.users },
    { key: "followups", icon: IC.calendar },
    { key: "calendar", icon: IC.clock },
  ];

  return (
    <aside className="w-16 bg-white border-r border-gray-100 flex flex-col items-center py-5 h-screen sticky top-0">
      <div className="w-9 h-9 bg-gray-900 rounded-xl flex items-center justify-center mb-8">
        <span className="text-white font-bold text-sm">I</span>
      </div>

      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => setActiveNav(item.key)}
            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${
              activeNav === item.key
                ? "bg-gray-900 text-white"
                : "text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            }`}
          >
            <Icon d={item.icon} size={18} />
          </button>
        ))}
      </nav>
    </aside>
  );
}