import { Phone, Users, ArrowUpRight, CheckCircle2, Clock, AlertTriangle, UserCheck } from "lucide-react";

const WORKERS = [
  {
    id: "TN-TTK-ASHA-031",
    name: "Selvi Arumugam",
    ward: "Ward 3",
    mobile: "98431 XXXXX",
    households: 127,
    referrals: { total: 14, thisMonth: 3 },
    homeVisits: 89,
    ancFollowups: 6,
    immunisation: 12,
    status: "active",
    lastSync: "10:30 AM today",
  },
  {
    id: "TN-TTK-ASHA-018",
    name: "Meenakshi Balakrishnan",
    ward: "Ward 1",
    mobile: "97514 XXXXX",
    households: 112,
    referrals: { total: 9, thisMonth: 2 },
    homeVisits: 74,
    ancFollowups: 4,
    immunisation: 9,
    status: "active",
    lastSync: "09:45 AM today",
  },
  {
    id: "TN-TTK-ASHA-024",
    name: "Padma Krishnan",
    ward: "Ward 5",
    mobile: "94876 XXXXX",
    households: 98,
    referrals: { total: 6, thisMonth: 1 },
    homeVisits: 61,
    ancFollowups: 3,
    immunisation: 7,
    status: "active",
    lastSync: "Yesterday, 3:12 PM",
  },
  {
    id: "TN-TTK-ASHA-039",
    name: "Kavitha Murugan",
    ward: "Ward 2",
    mobile: "91765 XXXXX",
    households: 143,
    referrals: { total: 11, thisMonth: 2 },
    homeVisits: 102,
    ancFollowups: 8,
    immunisation: 15,
    status: "active",
    lastSync: "10:15 AM today",
  },
  {
    id: "TN-TTK-ASHA-012",
    name: "Devi Subramaniam",
    ward: "Ward 4",
    mobile: "99403 XXXXX",
    households: 89,
    referrals: { total: 7, thisMonth: 1 },
    homeVisits: 53,
    ancFollowups: 2,
    immunisation: 6,
    status: "inactive",
    lastSync: "3 days ago",
  },
];

export default function ASHAWorkers() {
  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-phc-text text-2xl leading-none">ASHA Workers</h1>
          <p className="text-[13px] text-phc-muted mt-1.5">
            Kovilpatti Block · {WORKERS.length} ASHA workers · Data synced from ASHA App via Firestore
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 text-[11.5px] bg-phc-green-light border border-green-200 rounded-lg text-phc-green font-display font-semibold">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Live Firestore Sync
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Households", value: WORKERS.reduce((s, w) => s + w.households, 0).toString() },
          { label: "Referrals This Month", value: WORKERS.reduce((s, w) => s + w.referrals.thisMonth, 0).toString(), color: "text-phc-blue" },
          { label: "ANC Follow-ups", value: WORKERS.reduce((s, w) => s + w.ancFollowups, 0).toString(), color: "text-phc-green" },
          { label: "Immunisations", value: WORKERS.reduce((s, w) => s + w.immunisation, 0).toString() },
        ].map((s) => (
          <div key={s.label} className="bg-phc-surface border border-phc-border rounded-lg px-4 py-4">
            <div className={`font-display font-bold text-2xl leading-none ${s.color || "text-phc-text"}`}>{s.value}</div>
            <div className="text-[12px] text-phc-muted mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-4">
        {WORKERS.map((w) => (
          <div key={w.id} className="bg-phc-surface border border-phc-border rounded-lg overflow-hidden hover:border-phc-blue/40 transition-colors">
            <div className="flex items-center gap-5 px-5 py-4">
              {/* Avatar */}
              <div className="w-11 h-11 rounded-full bg-phc-blue flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[14px] font-display font-bold">
                  {w.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </span>
              </div>

              {/* Identity */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-display font-semibold text-phc-text text-[14px]">{w.name}</span>
                  <span
                    className={`text-[10.5px] font-display font-bold px-1.5 py-0.5 rounded ${
                      w.status === "active"
                        ? "bg-green-50 text-green-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {w.status === "active" ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-[12px] text-phc-muted">{w.ward}</span>
                  <span className="text-phc-border">·</span>
                  <span className="flex items-center gap-1 text-[12px] text-phc-muted">
                    <Phone size={10} />
                    {w.mobile}
                  </span>
                  <span className="text-phc-border">·</span>
                  <span className="font-mono text-[10.5px] text-phc-subtle">{w.id}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 flex-shrink-0">
                <div className="text-center">
                  <div className="font-display font-bold text-phc-text text-lg leading-none">{w.households}</div>
                  <div className="text-[10.5px] text-phc-muted mt-0.5 flex items-center gap-0.5">
                    <Users size={9} />
                    Households
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-display font-bold text-phc-blue text-lg leading-none">{w.referrals.total}</div>
                  <div className="text-[10.5px] text-phc-muted mt-0.5">Referrals</div>
                </div>
                <div className="text-center">
                  <div className="font-display font-bold text-phc-green text-lg leading-none">{w.ancFollowups}</div>
                  <div className="text-[10.5px] text-phc-muted mt-0.5">ANC</div>
                </div>
                <div className="text-center">
                  <div className="font-display font-bold text-phc-text text-lg leading-none">{w.immunisation}</div>
                  <div className="text-[10.5px] text-phc-muted mt-0.5">Immunised</div>
                </div>
                <div className="text-center">
                  <div className="font-display font-bold text-phc-text text-lg leading-none">{w.homeVisits}</div>
                  <div className="text-[10.5px] text-phc-muted mt-0.5">Home Visits</div>
                </div>
              </div>

              {/* Sync & actions */}
              <div className="flex-shrink-0 flex flex-col items-end gap-2 ml-4">
                <div className="flex items-center gap-1 text-[10.5px] text-phc-subtle">
                  {w.status === "active" ? (
                    <CheckCircle2 size={10} className="text-phc-green" />
                  ) : (
                    <AlertTriangle size={10} className="text-amber-500" />
                  )}
                  {w.lastSync}
                </div>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-display font-medium text-phc-blue border border-phc-blue/30 rounded-lg hover:bg-phc-blue-light transition-colors cursor-pointer">
                  View profile
                  <ArrowUpRight size={11} />
                </button>
              </div>
            </div>

            {/* Progress bar for home visits vs target */}
            <div className="px-5 pb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10.5px] text-phc-muted">Home visits vs target ({w.households})</span>
                <span className="text-[10.5px] font-mono text-phc-muted">{Math.round((w.homeVisits / w.households) * 100)}%</span>
              </div>
              <div className="h-1.5 bg-phc-bg rounded-full overflow-hidden">
                <div
                  className="h-full bg-phc-blue rounded-full transition-all"
                  style={{ width: `${Math.min((w.homeVisits / w.households) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
