import { Search, Filter, Download, CornerUpRight, UserCheck, ChevronDown, ArrowRightLeft } from "lucide-react";

const REFERRALS = [
  { id: "REF-2024-089", patient: "Saurabh Verma", age: "42M", diagnosis: "Suspected STEMI — chest pain", referredTo: "AIIMS Patna", asha: "Meena K.", date: "01 Sep 2024", time: "10:05", priority: "emergency", ack: "Acknowledged" },
  { id: "REF-2024-088", patient: "Geeta Yadav", age: "24F", diagnosis: "Obstructed labour — LSCS indicated", referredTo: "PMCH Patna", asha: "Neelam S.", date: "31 Aug 2024", time: "02:14", priority: "emergency", ack: "Received" },
  { id: "REF-2024-087", patient: "Arvind Kumar", age: "34M", diagnosis: "Pulmonary TB (suspected)", referredTo: "DOTS Centre, Danapur", asha: "Sunita D.", date: "30 Aug 2024", time: "11:30", priority: "normal", ack: "Acknowledged" },
  { id: "REF-2024-086", patient: "Nalini Rani", age: "58F", diagnosis: "Cataract — pre-operative evaluation", referredTo: "Regional Eye Hospital, Patna", asha: "Rekha Sharma", date: "29 Aug 2024", time: "09:45", priority: "normal", ack: "Pending" },
  { id: "REF-2024-085", patient: "Manohar Singh", age: "66M", diagnosis: "Uncontrolled hypertension", referredTo: "CHC Danapur", asha: undefined, date: "28 Aug 2024", time: "14:02", priority: "urgent", ack: "Acknowledged" },
  { id: "REF-2024-084", patient: "Pooja Kumari", age: "39F", diagnosis: "Gestational diabetes — specialist consult", referredTo: "PMCH Patna", asha: "Anita Yadav", date: "27 Aug 2024", time: "10:20", priority: "normal", ack: "Received" },
];

const PRIORITY: Record<string, { bg: string; text: string }> = {
  emergency: { bg: "bg-red-100", text: "text-red-800" },
  urgent: { bg: "bg-amber-100", text: "text-amber-900" },
  normal: { bg: "bg-gray-100", text: "text-gray-700" },
};

const ACK: Record<string, { bg: string; text: string }> = {
  Acknowledged: { bg: "bg-blue-50", text: "text-blue-800" },
  Received: { bg: "bg-green-50", text: "text-green-800" },
  Pending: { bg: "bg-amber-50", text: "text-amber-800" },
};

export default function Referrals() {
  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-phc-text text-2xl leading-none">Referrals</h1>
          <p className="text-[13px] text-phc-muted mt-1.5">ASHA App → PHC → CHC / Hospital referral chain</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-phc-border text-phc-text text-[12.5px] font-display font-medium hover:bg-phc-bg transition-colors cursor-pointer">
            <Download size={14} />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-phc-blue text-white text-[12.5px] font-display font-semibold hover:bg-phc-blue-dark transition-colors cursor-pointer">
            <ArrowRightLeft size={14} />
            New Referral
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total this month", value: "24" },
          { label: "Emergency", value: "3", color: "text-red-600" },
          { label: "Urgent", value: "7", color: "text-amber-700" },
          { label: "Pending ACK", value: "1", color: "text-phc-blue" },
        ].map((s) => (
          <div key={s.label} className="bg-phc-surface border border-phc-border rounded-lg px-4 py-4">
            <div className={`font-display font-bold text-2xl leading-none ${s.color || "text-phc-text"}`}>{s.value}</div>
            <div className="text-[12px] text-phc-muted mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-phc-surface border border-phc-border rounded-lg">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-phc-border">
          <div className="relative flex-1 max-w-xs">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-phc-subtle pointer-events-none" />
            <input placeholder="Search patient or referral ID…" className="w-full pl-8 pr-3 py-1.5 text-[12.5px] border border-phc-border rounded-lg focus:outline-none focus:ring-1 focus:ring-phc-blue/30 focus:border-phc-blue" />
          </div>
          <div className="relative">
            <select className="pl-3 pr-7 py-1.5 text-[12.5px] border border-phc-border rounded-lg appearance-none cursor-pointer focus:outline-none focus:border-phc-blue">
              <option>All priorities</option>
              <option>Emergency</option>
              <option>Urgent</option>
              <option>Normal</option>
            </select>
            <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-phc-subtle pointer-events-none" />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12.5px] font-display font-medium border border-phc-border rounded-lg text-phc-muted hover:bg-phc-bg transition-colors cursor-pointer">
            <Filter size={12} />
            Filters
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-phc-bg border-b border-phc-border">
                {["Ref. ID", "Patient", "Diagnosis", "Referred To", "ASHA", "Date / Time", "Priority", "Status", ""].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-[10.5px] font-display font-semibold text-phc-muted uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {REFERRALS.map((r, i) => (
                <tr key={r.id} className={`border-b border-phc-border-light hover:bg-phc-blue-light/20 transition-colors ${i % 2 === 1 ? "bg-phc-bg/40" : ""}`}>
                  <td className="px-4 py-2.5">
                    <span className="font-mono text-[11.5px] text-phc-blue">{r.id}</span>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="font-display font-medium text-phc-text text-[13px] whitespace-nowrap">{r.patient}</div>
                    <div className="text-[11px] text-phc-muted">{r.age}</div>
                  </td>
                  <td className="px-4 py-2.5 text-[12.5px] text-phc-text max-w-[180px] truncate" title={r.diagnosis}>{r.diagnosis}</td>
                  <td className="px-4 py-2.5 text-[12.5px] text-phc-text whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <CornerUpRight size={11} className="text-phc-blue flex-shrink-0" />
                      {r.referredTo}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-[12px]">
                    {r.asha ? (
                      <span className="flex items-center gap-1 text-phc-green whitespace-nowrap">
                        <UserCheck size={11} />
                        {r.asha}
                      </span>
                    ) : (
                      <span className="text-phc-subtle">Direct</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="text-[12px] text-phc-text font-display whitespace-nowrap">{r.date}</div>
                    <div className="text-[11px] font-mono text-phc-muted">{r.time}</div>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-display font-bold capitalize ${PRIORITY[r.priority].bg} ${PRIORITY[r.priority].text}`}>
                      {r.priority}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-display font-semibold ${ACK[r.ack].bg} ${ACK[r.ack].text}`}>
                      {r.ack}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <button className="text-[12px] text-phc-blue hover:underline font-display cursor-pointer whitespace-nowrap">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-phc-border bg-phc-bg text-[11.5px] text-phc-muted">
          <span>Showing 6 of 24 referrals this month</span>
          <button className="text-phc-blue hover:underline text-[12px] font-display cursor-pointer">Load more</button>
        </div>
      </div>
    </div>
  );
}
