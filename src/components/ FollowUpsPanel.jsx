import React from "react";

export default function FollowUpsPanel({ leads }) {
  const todayStr = new Date().toISOString().split("T")[0];

  const overdue = leads.filter(l => l.follow_up_date && l.follow_up_date < todayStr);
  const today = leads.filter(l => l.follow_up_date === todayStr);

  return (
    <div className="bg-white p-4 rounded-xl border space-y-4">
      <div>
        <h3 className="font-semibold text-sm">Overdue</h3>
        {overdue.map(l => (
          <p key={l.id} className="text-xs text-red-500">{l.name}</p>
        ))}
      </div>

      <div>
        <h3 className="font-semibold text-sm">Today</h3>
        {today.map(l => (
          <p key={l.id} className="text-xs text-blue-500">{l.name}</p>
        ))}
      </div>
    </div>
  );
}