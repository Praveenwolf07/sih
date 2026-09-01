import { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Download,
  UserCheck,
  ChevronDown,
  X,
  CheckCircle2,
  Clock,
  CornerUpRight,
  ChevronRight,
  Phone,
  MapPin,
  Calendar,
  FileText,
} from "lucide-react";

type PatientStatus = "active" | "referred" | "discharged" | "critical";
type SexType = "M" | "F";

interface Patient {
  id: string;
  name: string;
  age: number;
  sex: SexType;
  dob: string;
  village: string;
  ward: string;
  mobile?: string;
  asha?: string;
  ashaId?: string;
  conditions: string[];
  lastVisit: string;
  nextVisit?: string;
  visits: number;
  status: PatientStatus;
  flags: string[];
}

const PATIENTS: Patient[] = [
  { id: "TN-TTK-P-0891", name: "Arjun Pandi", age: 34, sex: "M", dob: "14 Mar 1990", village: "Karisalkulam", ward: "Ward 2", mobile: "98406 XXXXX", asha: "Meenakshi B.", ashaId: "ASHA-018", conditions: ["Pulmonary TB (suspected)"], lastVisit: "30 Aug 2024", nextVisit: "06 Sep 2024", visits: 3, status: "referred", flags: ["TB"] },
  { id: "TN-TTK-P-0892", name: "Kamala Devi R.", age: 45, sex: "F", dob: "02 Jun 1979", village: "Kovilpatti Town", ward: "Ward 3", mobile: "99401 XXXXX", asha: "Selvi A.", ashaId: "ASHA-031", conditions: ["Viral fever", "Hypertension"], lastVisit: "01 Sep 2024", visits: 8, status: "active", flags: ["HTN"] },
  { id: "TN-TTK-P-0893", name: "Muthuvel Sarangan", age: 62, sex: "M", dob: "19 Nov 1961", village: "Ottapidaram", ward: "Ward 1", conditions: ["Type 2 Diabetes Mellitus"], lastVisit: "01 Sep 2024", nextVisit: "15 Sep 2024", visits: 24, status: "active", flags: ["DM"] },
  { id: "TN-TTK-P-0894", name: "Priya Sundaram", age: 28, sex: "F", dob: "07 Apr 1996", village: "Kovilpatti Town", ward: "Ward 3", mobile: "82200 XXXXX", asha: "Meenakshi B.", ashaId: "ASHA-018", conditions: ["ANC — 28 weeks", "Mild anaemia"], lastVisit: "01 Sep 2024", nextVisit: "15 Sep 2024", visits: 5, status: "active", flags: ["ANC", "Anaemia"] },
  { id: "TN-TTK-P-0895", name: "Subramanian T.", age: 55, sex: "M", dob: "23 Jan 1969", village: "Satchiyapuram", ward: "Ward 5", conditions: ["Pulmonary TB (confirmed) — DOT Day 42"], lastVisit: "01 Sep 2024", nextVisit: "02 Sep 2024", visits: 42, status: "active", flags: ["TB", "DOT"] },
  { id: "TN-TTK-P-0896", name: "Sathya Narayanan", age: 42, sex: "M", dob: "11 Sep 1981", village: "Kovilpatti Town", ward: "Ward 3", mobile: "94890 XXXXX", asha: "Selvi A.", ashaId: "ASHA-031", conditions: ["Acute chest pain — STEMI (suspected)"], lastVisit: "01 Sep 2024", visits: 2, status: "referred", flags: ["CARDIAC", "URGENT"] },
  { id: "TN-TTK-P-0897", name: "Geetha Murugan", age: 24, sex: "F", dob: "30 Jul 2000", village: "Mangalampet", ward: "Ward 4", mobile: "91765 XXXXX", asha: "Devi S.", ashaId: "ASHA-012", conditions: ["Obstructed labour — post-LSCS"], lastVisit: "31 Aug 2024", visits: 9, status: "referred", flags: ["OBSTETRIC"] },
  { id: "TN-TTK-P-0898", name: "Lakshmi Sundareswaran", age: 67, sex: "F", dob: "05 Feb 1957", village: "Kadaladi", ward: "Ward 1", mobile: "98760 XXXXX", conditions: ["Osteoarthritis", "Hypertension"], lastVisit: "01 Sep 2024", nextVisit: "01 Oct 2024", visits: 31, status: "active", flags: ["HTN"] },
  { id: "TN-TTK-P-0899", name: "Manickam Pillai", age: 66, sex: "M", dob: "17 Aug 1958", village: "Ottapidaram", ward: "Ward 1", mobile: "94884 XXXXX", conditions: ["Uncontrolled hypertension", "CKD Stage 2"], lastVisit: "28 Aug 2024", nextVisit: "07 Sep 2024", visits: 18, status: "active", flags: ["HTN", "CKD"] },
  { id: "TN-TTK-P-0900", name: "Thenmozhi Rajendran", age: 32, sex: "F", dob: "22 Mar 1992", village: "Kovilpatti Town", ward: "Ward 2", mobile: "98430 XXXXX", asha: "Kavitha M.", ashaId: "ASHA-039", conditions: ["ANC — 32 weeks", "Gestational diabetes"], lastVisit: "29 Aug 2024", nextVisit: "12 Sep 2024", visits: 7, status: "active", flags: ["ANC", "GDM"] },
  { id: "TN-TTK-P-0901", name: "Velu Periasamy", age: 39, sex: "M", dob: "09 Dec 1984", village: "Kayamozhi", ward: "Ward 5", mobile: "99402 XXXXX", conditions: ["Post-operative wound care"], lastVisit: "01 Sep 2024", nextVisit: "05 Sep 2024", visits: 6, status: "active", flags: [] },
  { id: "TN-TTK-P-0902", name: "Ambika Velayutham", age: 35, sex: "F", dob: "14 Jan 1989", village: "Satchiyapuram", ward: "Ward 5", conditions: ["Essential hypertension"], lastVisit: "01 Sep 2024", nextVisit: "01 Oct 2024", visits: 12, status: "active", flags: ["HTN"] },
];

const STATUS_META: Record<PatientStatus, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
  active: { label: "Active", bg: "bg-green-50", text: "text-green-800", icon: <CheckCircle2 size={10} /> },
  referred: { label: "Referred", bg: "bg-violet-50", text: "text-violet-800", icon: <CornerUpRight size={10} /> },
  discharged: { label: "Discharged", bg: "bg-gray-100", text: "text-gray-600", icon: <CheckCircle2 size={10} /> },
  critical: { label: "Critical", bg: "bg-red-50", text: "text-red-700", icon: <Clock size={10} /> },
};

const FLAG_COLORS: Record<string, string> = {
  TB: "bg-orange-100 text-orange-800",
  ANC: "bg-pink-100 text-pink-800",
  DM: "bg-sky-100 text-sky-800",
  HTN: "bg-red-100 text-red-800",
  DOT: "bg-amber-100 text-amber-800",
  CARDIAC: "bg-red-200 text-red-900",
  URGENT: "bg-red-600 text-white",
  OBSTETRIC: "bg-fuchsia-100 text-fuchsia-800",
  CKD: "bg-slate-100 text-slate-700",
  GDM: "bg-teal-100 text-teal-800",
  Anaemia: "bg-rose-100 text-rose-800",
};

type ViewMode = "table" | "cards";

interface DetailPanelProps {
  patient: Patient;
  onClose: () => void;
}

function DetailPanel({ patient, onClose }: DetailPanelProps) {
  const sm = STATUS_META[patient.status];
  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-phc-surface border-l border-phc-border shadow-xl z-30 flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-phc-border">
        <span className="font-display font-bold text-phc-text text-[15px]">Patient Record</span>
        <button onClick={onClose} className="p-1.5 rounded hover:bg-phc-bg text-phc-muted cursor-pointer">
          <X size={16} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {/* Identity */}
        <div className="px-5 py-5 border-b border-phc-border">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-full bg-phc-blue flex items-center justify-center flex-shrink-0">
              <span className="text-white text-[15px] font-display font-bold">
                {patient.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-display font-bold text-phc-text text-[15px] leading-snug">{patient.name}</div>
              <div className="text-[12px] text-phc-muted mt-0.5">{patient.age} yrs · {patient.sex === "F" ? "Female" : "Male"} · DOB {patient.dob}</div>
              <div className="mt-2 flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-display font-semibold ${sm.bg} ${sm.text}`}>
                  {sm.icon} {sm.label}
                </span>
                {patient.flags.map((f) => (
                  <span key={f} className={`px-1.5 py-0.5 rounded text-[10px] font-display font-bold ${FLAG_COLORS[f] || "bg-gray-100 text-gray-700"}`}>{f}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-1.5">
            <div className="flex items-center gap-2 text-[12px] text-phc-muted">
              <MapPin size={11} className="text-phc-subtle" />
              {patient.village} · {patient.ward}
            </div>
            {patient.mobile && (
              <div className="flex items-center gap-2 text-[12px] text-phc-muted">
                <Phone size={11} className="text-phc-subtle" />
                {patient.mobile}
              </div>
            )}
            {patient.asha && (
              <div className="flex items-center gap-2 text-[12px] text-phc-green">
                <UserCheck size={11} />
                ASHA: {patient.asha} · <span className="font-mono text-[10.5px]">{patient.ashaId}</span>
              </div>
            )}
          </div>
          <div className="mt-3 flex items-center gap-1">
            <span className="text-[10.5px] font-mono text-phc-blue">{patient.id}</span>
          </div>
        </div>

        {/* Conditions */}
        <div className="px-5 py-4 border-b border-phc-border">
          <div className="text-[10.5px] font-display font-bold text-phc-muted uppercase tracking-widest mb-2.5">Active Conditions</div>
          {patient.conditions.map((c) => (
            <div key={c} className="flex items-center gap-2 py-1">
              <div className="w-1.5 h-1.5 rounded-full bg-phc-blue flex-shrink-0" />
              <span className="text-[13px] text-phc-text">{c}</span>
            </div>
          ))}
        </div>

        {/* Visit history */}
        <div className="px-5 py-4 border-b border-phc-border">
          <div className="text-[10.5px] font-display font-bold text-phc-muted uppercase tracking-widest mb-2.5">Visit Summary</div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Total Visits", value: patient.visits.toString() },
              { label: "Last Visit", value: patient.lastVisit },
              { label: "Next Due", value: patient.nextVisit || "—" },
              { label: "Registered", value: "Jan 2024" },
            ].map((item) => (
              <div key={item.label}>
                <div className="text-[10.5px] text-phc-subtle">{item.label}</div>
                <div className="text-[12.5px] font-display font-medium text-phc-text mt-0.5">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="px-5 py-4">
          <div className="text-[10.5px] font-display font-bold text-phc-muted uppercase tracking-widest mb-3">Quick Actions</div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "New Visit", icon: <Plus size={12} /> },
              { label: "Add Referral", icon: <CornerUpRight size={12} /> },
              { label: "View History", icon: <FileText size={12} /> },
              { label: "Schedule", icon: <Calendar size={12} /> },
            ].map((a) => (
              <button key={a.label} className="flex items-center gap-2 px-3 py-2 text-[12px] font-display font-medium border border-phc-border rounded-lg text-phc-text hover:bg-phc-bg transition-colors cursor-pointer">
                <span className="text-phc-blue">{a.icon}</span>
                {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="px-5 py-4 border-t border-phc-border bg-phc-bg flex gap-2">
        <button className="flex-1 py-2 text-[13px] font-display font-semibold bg-phc-blue text-white rounded-lg hover:bg-phc-blue-dark transition-colors cursor-pointer">
          Open Full Record
        </button>
        <button onClick={onClose} className="px-4 py-2 text-[13px] font-display font-medium border border-phc-border rounded-lg text-phc-muted hover:bg-phc-surface transition-colors cursor-pointer">
          Close
        </button>
      </div>
    </div>
  );
}

export default function Patients() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterFlag, setFilterFlag] = useState("all");
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [selected, setSelected] = useState<Patient | null>(null);

  const filtered = PATIENTS.filter((p) => {
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.village.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || p.status === filterStatus;
    const matchFlag = filterFlag === "all" || p.flags.includes(filterFlag);
    return matchSearch && matchStatus && matchFlag;
  });

  const counts = {
    active: PATIENTS.filter((p) => p.status === "active").length,
    referred: PATIENTS.filter((p) => p.status === "referred").length,
    anc: PATIENTS.filter((p) => p.flags.includes("ANC")).length,
    tb: PATIENTS.filter((p) => p.flags.includes("TB")).length,
  };

  return (
    <div className={`p-6 ${selected ? "mr-96" : ""} transition-all`}>
      {/* Page header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-phc-text text-2xl leading-none">Patients</h1>
          <p className="text-[13px] text-phc-muted mt-1.5">
            Kovilpatti PHC register · {PATIENTS.length} registered · synced from HMIS
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-phc-border text-phc-text text-[12.5px] font-display font-medium hover:bg-phc-bg transition-colors cursor-pointer">
            <Download size={13} />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-phc-blue text-white text-[12.5px] font-display font-semibold hover:bg-phc-blue-dark transition-colors cursor-pointer">
            <Plus size={14} />
            Register Patient
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {[
          { label: "Active Patients", value: counts.active, color: "text-phc-green", action: () => setFilterStatus("active") },
          { label: "Referred", value: counts.referred, color: "text-violet-700", action: () => setFilterStatus("referred") },
          { label: "ANC Cases", value: counts.anc, color: "text-pink-700", action: () => setFilterFlag("ANC") },
          { label: "TB / DOT", value: counts.tb, color: "text-orange-700", action: () => setFilterFlag("TB") },
        ].map((s) => (
          <button
            key={s.label}
            onClick={s.action}
            className="bg-phc-surface border border-phc-border rounded-lg px-4 py-4 text-left hover:border-phc-blue/40 transition-colors cursor-pointer"
          >
            <div className={`font-display font-bold text-2xl leading-none ${s.color}`}>{s.value}</div>
            <div className="text-[12px] text-phc-muted mt-1">{s.label}</div>
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-phc-subtle pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, patient ID, village…"
            className="w-full pl-8 pr-3 py-2 text-[12.5px] border border-phc-border rounded-lg focus:outline-none focus:ring-1 focus:ring-phc-blue/30 focus:border-phc-blue bg-phc-surface"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-phc-subtle hover:text-phc-muted cursor-pointer">
              <X size={12} />
            </button>
          )}
        </div>
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="pl-3 pr-7 py-2 text-[12.5px] border border-phc-border rounded-lg appearance-none cursor-pointer focus:outline-none focus:border-phc-blue bg-phc-surface"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="referred">Referred</option>
            <option value="discharged">Discharged</option>
          </select>
          <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-phc-subtle pointer-events-none" />
        </div>
        <div className="relative">
          <select
            value={filterFlag}
            onChange={(e) => setFilterFlag(e.target.value)}
            className="pl-3 pr-7 py-2 text-[12.5px] border border-phc-border rounded-lg appearance-none cursor-pointer focus:outline-none focus:border-phc-blue bg-phc-surface"
          >
            <option value="all">All conditions</option>
            <option value="ANC">ANC</option>
            <option value="TB">TB / DOT</option>
            <option value="DM">Diabetes</option>
            <option value="HTN">Hypertension</option>
            <option value="CARDIAC">Cardiac</option>
          </select>
          <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-phc-subtle pointer-events-none" />
        </div>
        {(filterStatus !== "all" || filterFlag !== "all" || search) && (
          <button
            onClick={() => { setFilterStatus("all"); setFilterFlag("all"); setSearch(""); }}
            className="flex items-center gap-1 text-[12px] text-phc-muted hover:text-phc-text cursor-pointer"
          >
            <X size={12} /> Clear filters
          </button>
        )}
        <div className="ml-auto flex items-center gap-1 border border-phc-border rounded-lg overflow-hidden">
          {(["table", "cards"] as ViewMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setViewMode(m)}
              className={`px-3 py-1.5 text-[11.5px] font-display font-medium capitalize transition-colors cursor-pointer ${viewMode === m ? "bg-phc-blue text-white" : "text-phc-muted hover:bg-phc-bg"}`}
            >
              {m}
            </button>
          ))}
        </div>
        <div className="text-[11.5px] text-phc-muted">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</div>
      </div>

      {/* Table view */}
      {viewMode === "table" && (
        <div className="bg-phc-surface border border-phc-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-phc-bg border-b border-phc-border">
                  {["Patient ID", "Name", "Age/Sex", "Village · Ward", "Conditions / Flags", "ASHA", "Last Visit", "Status", ""].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-[10.5px] font-display font-semibold text-phc-muted uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => {
                  const sm = STATUS_META[p.status];
                  return (
                    <tr
                      key={p.id}
                      onClick={() => setSelected(p)}
                      className={`border-b border-phc-border-light cursor-pointer transition-colors ${selected?.id === p.id ? "bg-phc-blue-light" : i % 2 === 1 ? "bg-phc-bg/50 hover:bg-phc-blue-light/30" : "hover:bg-phc-blue-light/30"}`}
                    >
                      <td className="px-4 py-2.5">
                        <span className="font-mono text-[11px] text-phc-blue">{p.id}</span>
                      </td>
                      <td className="px-4 py-2.5 font-display font-semibold text-phc-text text-[13px] whitespace-nowrap">{p.name}</td>
                      <td className="px-4 py-2.5 text-[12.5px] text-phc-muted whitespace-nowrap">{p.age}{p.sex}</td>
                      <td className="px-4 py-2.5 text-[12px] text-phc-muted whitespace-nowrap">{p.village} · {p.ward}</td>
                      <td className="px-4 py-2.5">
                        <div className="flex flex-wrap gap-1">
                          {p.flags.slice(0, 3).map((f) => (
                            <span key={f} className={`px-1.5 py-0.5 rounded text-[10px] font-display font-bold ${FLAG_COLORS[f] || "bg-gray-100 text-gray-700"}`}>{f}</span>
                          ))}
                          {p.conditions[0] && (
                            <span className="text-[11.5px] text-phc-muted truncate max-w-[140px]" title={p.conditions[0]}>
                              {p.flags.length === 0 ? p.conditions[0] : ""}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-[12px]">
                        {p.asha ? (
                          <span className="flex items-center gap-1 text-phc-green whitespace-nowrap">
                            <UserCheck size={10} />
                            {p.asha}
                          </span>
                        ) : (
                          <span className="text-phc-subtle">—</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-[12px] text-phc-muted whitespace-nowrap">{p.lastVisit}</td>
                      <td className="px-4 py-2.5">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-display font-semibold ${sm.bg} ${sm.text}`}>
                          {sm.icon} {sm.label}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <ChevronRight size={14} className="text-phc-subtle" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-4 py-3 border-t border-phc-border bg-phc-bg text-[11.5px] text-phc-muted">
            <span>Showing {filtered.length} of {PATIENTS.length} patients</span>
            <button className="text-phc-blue hover:underline text-[12px] font-display cursor-pointer">Load all 87 patients</button>
          </div>
        </div>
      )}

      {/* Cards view */}
      {viewMode === "cards" && (
        <div className="grid grid-cols-2 gap-4">
          {filtered.map((p) => {
            const sm = STATUS_META[p.status];
            return (
              <div
                key={p.id}
                onClick={() => setSelected(p)}
                className={`bg-phc-surface border rounded-lg p-4 cursor-pointer transition-colors hover:border-phc-blue/40 ${selected?.id === p.id ? "border-phc-blue bg-phc-blue-light" : "border-phc-border"}`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-phc-blue flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-[12px] font-display font-bold">
                      {p.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-display font-semibold text-phc-text text-[13.5px]">{p.name}</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-display font-semibold flex-shrink-0 ${sm.bg} ${sm.text}`}>
                        {sm.icon} {sm.label}
                      </span>
                    </div>
                    <div className="text-[11.5px] text-phc-muted mt-0.5">{p.age}{p.sex} · {p.village} · {p.ward}</div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {p.flags.map((f) => (
                        <span key={f} className={`px-1.5 py-0.5 rounded text-[10px] font-display font-bold ${FLAG_COLORS[f] || "bg-gray-100 text-gray-700"}`}>{f}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mt-2.5">
                      <span className="text-[11px] text-phc-subtle">Last visit: {p.lastVisit}</span>
                      {p.asha && (
                        <span className="flex items-center gap-1 text-[11px] text-phc-green">
                          <UserCheck size={10} />
                          {p.asha}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="bg-phc-surface border border-phc-border rounded-lg py-16 text-center">
          <div className="text-phc-subtle text-[13px]">No patients match the current filters</div>
          <button
            onClick={() => { setSearch(""); setFilterStatus("all"); setFilterFlag("all"); }}
            className="mt-3 text-[12.5px] text-phc-blue hover:underline cursor-pointer"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Detail panel */}
      {selected && <DetailPanel patient={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
