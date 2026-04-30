import React from "react";

const STATUS = {
  New:        { bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-400" },
  Interested: { bg: "bg-amber-50", text: "text-amber-600", dot: "bg-amber-400" },
  Closed:     { bg: "bg-green-50", text: "text-green-600", dot: "bg-green-500" },
};

function Avatar({ name }) {
  return (
    <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold">
      {name?.charAt(0)?.toUpperCase()}
    </div>
  );
}

export default function KanbanView({ leads, onEdit, onDelete, onStatusChange, snoozeFollowUp }) {
  const todayStr = new Date().toISOString().split("T")[0];

  const grouped = {
    New: leads.filter(l => l.status === "New"),
    Interested: leads.filter(l => l.status === "Interested"),
    Closed: leads.filter(l => l.status === "Closed"),
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {Object.entries(grouped).map(([status, colLeads]) => (
        <div key={status} className="bg-white rounded-2xl border p-4">
          <h3 className="text-sm font-semibold mb-4">{status} ({colLeads.length})</h3>

          <div className="space-y-3">
            {colLeads.map((lead) => {
              const isOverdue = lead.follow_up_date && lead.follow_up_date < todayStr;

              return (
                <div key={lead.id} className="p-3 bg-gray-50 rounded-xl">
                  <div className="flex justify-between">
                    <div className="flex gap-2">
                      <Avatar name={lead.name} />
                      <div>
                        <p className="text-sm font-semibold">{lead.name}</p>
                        <p className="text-xs text-gray-400">{lead.phone}</p>
                      </div>
                    </div>

                    <div className="flex gap-1">
                      <button onClick={() => onEdit(lead)}>✏️</button>
                      <button onClick={() => onDelete(lead.id)}>🗑</button>
                    </div>
                  </div>

                  <p className="text-xs mt-2 text-gray-500">
                    {lead.next_action || "No action"}
                  </p>

                  {lead.follow_up_date && (
                    <p className={`text-xs mt-1 ${isOverdue ? "text-red-500" : "text-gray-400"}`}>
                      {lead.follow_up_date}
                    </p>
                  )}

                  <div className="flex gap-1 mt-2">
                    {Object.keys(STATUS).map((s) => (
                      <button
                        key={s}
                        onClick={() => onStatusChange(lead.id, s)}
                        className={`text-xs px-2 py-1 rounded ${
                          lead.status === s ? "bg-black text-white" : "bg-gray-200"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-1 mt-2">
                    <button onClick={() => snoozeFollowUp(lead.id, 1)}>+1d</button>
                    <button onClick={() => snoozeFollowUp(lead.id, 3)}>+3d</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}