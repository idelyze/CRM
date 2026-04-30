import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    setLoading(true);
    const { data, error } = await supabase.from("leads").select("*");
    if (!error) setLeads(data);
    setLoading(false);
  }

  async function addLead(form) {
    setLoading(true);

    await supabase.from("leads").insert([{
      ...form,
      follow_up_date: form.follow_up_date || null,
      services: form.services || null,
      next_action: form.next_action || null,
    }]);

    await fetchLeads();
    setLoading(false);
  }

  async function updateLead(id, form) {
    setLoading(true);

    await supabase.from("leads").update({
      ...form,
      follow_up_date: form.follow_up_date || null,
      services: form.services || null,
      next_action: form.next_action || null,
    }).eq("id", id);

    await fetchLeads();
    setLoading(false);
  }

  async function deleteLead(id) {
    setLoading(true);
    await supabase.from("leads").delete().eq("id", id);
    await fetchLeads();
    setLoading(false);
  }

  async function updateStatus(id, status) {
    setLoading(true);
    await supabase.from("leads").update({ status }).eq("id", id);
    await fetchLeads();
    setLoading(false);
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

    await fetchLeads();
    setLoading(false);
  }

  return {
    leads,
    loading,
    addLead,
    updateLead,
    deleteLead,
    updateStatus,
    snoozeFollowUp,
  };
}