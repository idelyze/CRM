

import React, { useState } from "react";

export default function LeadModal({
  form,
  setForm,
  editingId,
  onSubmit,
  onClose,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <div>
            <h2 className="text-base font-semibold">
              {editingId ? "Edit Lead" : "New Lead"}
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              {editingId
                ? "Update lead details"
                : "Add a new lead to your CRM"}
            </p>
          </div>

          <button onClick={onClose} className="text-gray-400">✕</button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="px-6 py-5 space-y-4">
          {/* Name + Phone */}
          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="px-3 py-2 border rounded-lg text-sm"
              required
            />

            <input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="px-3 py-2 border rounded-lg text-sm"
              required
            />
          </div>

          {/* Service */}
          <input
            placeholder="Service (Logo, Website...)"
            value={form.services || ""}
            onChange={(e) => setForm({ ...form, services: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg text-sm"
          />

          {/* Follow-up */}
          <input
            type="date"
            value={form.follow_up_date || ""}
            onChange={(e) => setForm({ ...form, follow_up_date: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg text-sm"
          />

          {/* Priority */}
          <select
            value={form.priority || "Medium"}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg text-sm"
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          {/* Next Action */}
          <input
            placeholder="Next action (Call, Send proposal...)"
            value={form.next_action || ""}
            onChange={(e) => setForm({ ...form, next_action: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg text-sm"
          />

          {/* Status (only when creating) */}
          {!editingId && (
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm"
            >
              <option>New</option>
              <option>Interested</option>
              <option>Closed</option>
            </select>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border rounded-lg py-2 text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 bg-gray-900 text-white rounded-lg py-2 text-sm"
            >
              {editingId ? "Save Changes" : "Add Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}