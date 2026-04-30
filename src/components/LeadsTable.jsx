

import React from "react";

// Simple avatar (no external deps)
function Avatar({ name }) {
  const letter = name?.charAt(0)?.toUpperCase() || "?";
  return (
    <div className="w-9 h-9 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-sm font-semibold">
      {letter}
    </div>
  );
}

// Status styles
const STATUS = {
  New:        { bg: "bg-blue-50", text: "text-blue-600" },
  Interested: { bg: "bg-amber-50", text: "text-amber-600" },
  Closed:     { bg: "bg-green-50", text: "text-green-600" },
};

export default function LeadsTable({
  leads = [],
  onEdit,
  onDelete,
  onStatusChange,
  snoozeFollowUp,
}) {
  const todayStr = new Date().toISOString().split("T")[0];

  if (!leads.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <p className="text-sm font-medium">No leads found</p>
        <p className="text-xs mt-1">Try adjusting filters or add a new lead</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left text-xs font-medium text-gray-400 pb-3 pl-1">Lead</th>
            <th className="text-left text-xs font-medium text-gray-400 pb-3">Service</th>
            <th className="text-left text-xs font-medium text-gray-400 pb-3">Follow-up</th>
            <th className="text-left text-xs font-medium text-gray-400 pb-3">Priority</th>
            <th className="text-left text-xs font-medium text-gray-400 pb-3">Status</th>
            <th className="text-right text-xs font-medium text-gray-400 pb-3 pr-1">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-50">
          {leads.map((lead) => {
            const isOverdue =
              lead.follow_up_date && lead.follow_up_date < todayStr;

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
                  <p className="text-sm text-gray-600 truncate max-w-40">
                    {lead.services || <span className="text-gray-300">—</span>}
                  </p>
                </td>

                {/* Follow-up */}
                <td className="py-3.5">
                  {lead.follow_up_date ? (
                    <div className={`text-xs font-medium ${isOverdue ? "text-red-500" : "text-gray-500"}`}>
                      {lead.follow_up_date}
                      {isOverdue && <span className="ml-1">(Overdue)</span>}
                    </div>
                  ) : (
                    <span className="text-gray-300 text-xs">Not set</span>
                  )}
                </td>

                {/* Priority */}
                <td className="py-3.5">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      lead.priority === "High"
                        ? "bg-red-50 text-red-600"
                        : lead.priority === "Medium"
                        ? "bg-yellow-50 text-yellow-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {lead.priority || "Medium"}
                  </span>
                </td>

                {/* Status */}
                <td className="py-3.5">
                  <div className="flex items-center gap-1">
                    {Object.keys(STATUS).map((s) => (
                      <button
                        key={s}
                        onClick={() => onStatusChange?.(lead.id, s)}
                        className={`text-xs px-2 py-1 rounded-lg font-medium transition-all ${
                          lead.status === s
                            ? `${STATUS[s].bg} ${STATUS[s].text}`
                            : "text-gray-300 hover:text-gray-500 hover:bg-gray-100"
                        }`}
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
                      onClick={() => onEdit?.(lead)}
                      className="px-2 py-1 text-xs rounded-lg bg-gray-100 hover:bg-gray-200"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => onDelete?.(lead.id)}
                      className="px-2 py-1 text-xs rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                    >
                      Delete
                    </button>

                    {/* Snooze */}
                    <button
                      onClick={() => snoozeFollowUp?.(lead.id, 1)}
                      className="px-2 py-1 text-xs rounded-lg bg-gray-100 hover:bg-gray-200"
                    >
                      +1d
                    </button>

                    <button
                      onClick={() => snoozeFollowUp?.(lead.id, 3)}
                      className="px-2 py-1 text-xs rounded-lg bg-gray-100 hover:bg-gray-200"
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
    </div>
  );
}