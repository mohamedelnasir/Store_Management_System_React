export function SummaryCard({ title, value }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-5 shadow-card">
      <p className="text-sm text-slate-500">{title}</p>

      <h3 className="mt-2 text-2xl font-bold text-register-700 figure">
        {value}
      </h3>
    </div>
  )
}