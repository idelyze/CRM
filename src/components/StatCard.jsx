export default function StatCard({ label, value, active, onClick }) {
    return (
      <button
        onClick={onClick}
        className={`p-4 rounded-xl border ${
          active ? "bg-emerald-600 text-white" : "bg-white"
        }`}
      >
        <p className="text-xs">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </button>
    );
  }