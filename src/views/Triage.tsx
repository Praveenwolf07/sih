import { useState } from "react";
import {
  AlertTriangle,
  Clock,
  Loader2,
  CheckCircle2,
  CornerUpRight,
  UserCheck,
  Plus,
  ChevronRight,
  Activity,
} from "lucide-react";

type Acuity = "emergency" | "urgent" | "moderate" | "routine";
type TriageStatus = "waiting" | "assessing" | "treating" | "referred" | "done";

interface TriagePatient {
  token: string;
  id: string;
  name: string;
  age: number;
  sex: "M" | "F";
  chiefComplaint: string;
  acuity: Acuity;
  status: TriageStatus;
  arrived: string;
  waitMin: number;
  asha?: string;
  vitals: {
    bp?: string;
    pulse?: number;
    temp?: number;
    spo2?: number;
    rr?: number;
    weight?: number;
  };
  notes?: string;
}

const PATIENTS: TriagePatient[] = [
  {
    token: "#007", id: "BR-PAT-P-0896", name: "Saurabh Verma", age: 42, sex: "M",
    chiefComplaint: "Chest pain radiating to left arm — sudden onset 45 min ago",
    acuity: "emergency", status: "treating", arrived: "10:03", waitMin: 0,
    asha: "Meena K.",
    vitals: { bp: "158/102", pulse: 108, temp: 37.2, spo2: 92, rr: 22 },
    notes: "Diaphoresis present. ECG ordered. IV line secured.",
  },
  {
    token: "#001", id: "BR-PAT-P-0892", name: "Kamla Devi", age: 45, sex: "F",
    chiefComplaint: "High fever (39.4°C), severe body pain, headache — 2 days",
    acuity: "urgent", status: "treating", arrived: "08:42", waitMin: 0,
    asha: "Meena K.",
    vitals: { bp: "116/74", pulse: 96, temp: 39.4, spo2: 98, rr: 18 },
    notes: "Malarial smear ordered. IVF started.",
  },
  {
    token: "#004", id: "BR-PAT-P-0903", name: "Baby Aarav Singh", age: 1, sex: "M",
    chiefComplaint: "High fever (38.9°C) for 3 days, not feeding well",
    acuity: "urgent", status: "assessing", arrived: "09:31", waitMin: 8,
    asha: "Rekha Sharma",
    vitals: { temp: 38.9, pulse: 130, spo2: 97, weight: 9.2 },
    notes: "Paediatric case. Mother reports reduced urine output.",
  },
  {
    token: "#002", id: "BR-PAT-P-0893", name: "Raghav Sharma", age: 62, sex: "M",
    chiefComplaint: "Routine diabetes check — no acute complaints",
    acuity: "routine", status: "waiting", arrived: "09:05", waitMin: 22,
    vitals: { bp: "134/82", pulse: 78, temp: 36.8 },
  },
  {
    token: "#003", id: "BR-PAT-P-0894", name: "Ananya Singh", age: 28, sex: "F",
    chiefComplaint: "ANC visit — 28 weeks gestation, mild ankle swelling",
    acuity: "moderate", status: "waiting", arrived: "09:18", waitMin: 19,
    asha: "Sunita D.",
    vitals: { bp: "124/80", pulse: 88, weight: 63.2 },
  },
  {
    token: "#005", id: "BR-PAT-P-0902", name: "Asha Verma", age: 35, sex: "F",
    chiefComplaint: "Monthly hypertension review — headache this morning",
    acuity: "moderate", status: "waiting", arrived: "09:44", waitMin: 10,
    vitals: { bp: "148/94", pulse: 82, temp: 36.6 },
  },
  {
    token: "#008", id: "BR-PAT-P-0898", name: "Lakshmi Devi", age: 67, sex: "F",
    chiefComplaint: "Bilateral knee pain, swelling — worsening over 1 week",
    acuity: "routine", status: "waiting", arrived: "10:11", waitMin: 5,
    vitals: {},
  },
  {
    token: "#009", id: "BR-PAT-P-0901", name: "Vikas Singh", age: 39, sex: "M",
    chiefComplaint: "Wound dressing — post-op day 5",
    acuity: "routine", status: "waiting", arrived: "10:17", waitMin: 3,
    vitals: { temp: 36.9 },
  },
  {
    token: "#006", id: "BR-PAT-P-0895", name: "Shivam Tiwari", age: 55, sex: "M",
    chiefComplaint: "TB DOT — direct observation, day 42",
    acuity: "routine", status: "done", arrived: "09:52", waitMin: 0,
    vitals: { bp: "126/80", pulse: 72, temp: 36.7, spo2: 98 },
    notes: "DOT day 42 completed. Continue 2HRZE regimen.",
  },
];

const ACUITY_META: Record<Acuity, { label: string; color: string; bg: string; border: string; dot: string }> = {
  emergency: { label: "Emergency", color: "text-red-700", bg: "bg-red-50", border: "border-red-300", dot: "bg-red-500" },
  urgent: { label: "Urgent", color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-300", dot: "bg-orange-400" },
  moderate: { label: "Moderate", color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-300", dot: "bg-amber-400" },
  routine: { label: "Routine", color: "text-gray-600", bg: "bg-gray-50", border: "border-gray-200", dot: "bg-gray-400" },
};

const STATUS_META: Record<TriageStatus, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
  waiting: { label: "Waiting", bg: "bg-amber-50", text: "text-amber-800", icon: <Clock size={10} /> },
  assessing: { label: "Assessing", bg: "bg-blue-50", text: "text-blue-700", icon: <Activity size={10} /> },
  treating: { label: "In Treatment", bg: "bg-blue-100", text: "text-blue-900", icon: <Loader2 size={10} className="animate-spin" /> },
  referred: { label: "Referred", bg: "bg-violet-50", text: "text-violet-800", icon: <CornerUpRight size={10} /> },
  done: { label: "Done", bg: "bg-gray-100", text: "text-gray-600", icon: <CheckCircle2 size={10} /> },
};

function VitalPill({ label, value, alert }: { label: string; value: string; alert?: boolean }) {
  return (
    <div className={`px-2 py-1 rounded border text-center ${alert ? "bg-red-50 border-red-200" : "bg-phc-bg border-phc-border"}`}>
      <div className={`font-mono font-medium text-[12px] leading-none ${alert ? "text-red-700" : "text-phc-text"}`}>{value}</div>
      <div className="text-[9.5px] text-phc-subtle mt-0.5">{label}</div>
    </div>
  );
}

function TriageCard({ p, onClick, active }: { p: TriagePatient; onClick: () => void; active: boolean }) {
  const acuity = ACUITY_META[p.acuity];
  const status = STATUS_META[p.status];
  const hasVitals = Object.keys(p.vitals).length > 0;

  return (
    <div
      onClick={onClick}
      className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${active ? "border-phc-blue shadow-md" : "border-phc-border hover:border-phc-blue/40"} ${acuity.bg}`}
    >
      {/* Acuity strip */}
      <div className={`flex items-center gap-2 px-4 py-2 border-b ${acuity.border}`}>
        <div className={`w-2 h-2 rounded-full ${acuity.dot} ${p.acuity === "emergency" ? "animate-pulse" : ""}`} />
        <span className={`text-[11px] font-display font-bold uppercase tracking-wide ${acuity.color}`}>{acuity.label}</span>
        <span className="ml-auto font-mono text-[12px] text-phc-blue font-medium">{p.token}</span>
      </div>
      <div className="px-4 py-3 bg-phc-surface">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div>
            <span className="font-display font-semibold text-phc-text text-[13.5px]">{p.name}</span>
            <span className="ml-2 text-[12px] text-phc-muted">{p.age}{p.sex}</span>
          </div>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-display font-semibold flex-shrink-0 ${status.bg} ${status.text}`}>
            {status.icon} {status.label}
          </span>
        </div>
        <p className="text-[12px] text-phc-muted leading-snug mt-1">{p.chiefComplaint}</p>
        {p.asha && (
          <div className="flex items-center gap-1 mt-1.5 text-[11px] text-phc-green">
            <UserCheck size={10} />
            {p.asha}
          </div>
        )}
        {hasVitals && (
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {p.vitals.bp && <VitalPill label="BP" value={p.vitals.bp} alert={parseInt(p.vitals.bp) > 140} />}
            {p.vitals.pulse && <VitalPill label="Pulse" value={`${p.vitals.pulse}`} alert={p.vitals.pulse > 100 || p.vitals.pulse < 60} />}
            {p.vitals.temp && <VitalPill label="Temp °C" value={`${p.vitals.temp}`} alert={p.vitals.temp > 38.5} />}
            {p.vitals.spo2 && <VitalPill label="SpO₂ %" value={`${p.vitals.spo2}`} alert={p.vitals.spo2 < 95} />}
          </div>
        )}
        <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-phc-border-light">
          <span className="text-[11px] text-phc-subtle font-mono">Arrived {p.arrived}</span>
          {p.status === "waiting" && p.waitMin > 0 && (
            <span className="text-[11px] text-amber-700 font-display font-medium">{p.waitMin} min wait</span>
          )}
          <ChevronRight size={13} className="text-phc-subtle" />
        </div>
      </div>
    </div>
  );
}

function DetailView({ p }: { p: TriagePatient }) {
  const acuity = ACUITY_META[p.acuity];
  const status = STATUS_META[p.status];
  return (
    <div className="bg-phc-surface border border-phc-border rounded-lg overflow-hidden">
      <div className={`px-5 py-3 border-b ${acuity.border} ${acuity.bg} flex items-center gap-3`}>
        <div className={`w-3 h-3 rounded-full ${acuity.dot} ${p.acuity === "emergency" ? "animate-pulse" : ""}`} />
        <span className={`font-display font-bold text-[13px] uppercase tracking-wide ${acuity.color}`}>{acuity.label} — {p.token}</span>
        <span className={`ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11.5px] font-display font-semibold ${status.bg} ${status.text}`}>
          {status.icon} {status.label}
        </span>
      </div>

      <div className="px-5 py-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-11 h-11 rounded-full bg-phc-blue flex items-center justify-center flex-shrink-0">
            <span className="text-white text-[13px] font-display font-bold">
              {p.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </span>
          </div>
          <div>
            <div className="font-display font-bold text-phc-text text-[16px] leading-none">{p.name}</div>
            <div className="text-[12.5px] text-phc-muted mt-1">{p.age} yrs · {p.sex === "F" ? "Female" : "Male"} · <span className="font-mono">{p.id}</span></div>
            {p.asha && (
              <div className="flex items-center gap-1 mt-1 text-[12px] text-phc-green">
                <UserCheck size={11} />
                Referred by ASHA: {p.asha}
              </div>
            )}
          </div>
        </div>

        {/* Chief complaint */}
        <div className="mb-4">
          <div className="text-[10.5px] font-display font-bold text-phc-muted uppercase tracking-widest mb-1.5">Chief Complaint</div>
          <div className="text-[13.5px] text-phc-text leading-relaxed bg-phc-bg border border-phc-border rounded-lg px-3 py-2.5">
            {p.chiefComplaint}
          </div>
        </div>

        {/* Vitals */}
        <div className="mb-4">
          <div className="text-[10.5px] font-display font-bold text-phc-muted uppercase tracking-widest mb-2">Vitals on Arrival</div>
          <div className="grid grid-cols-5 gap-2">
            {p.vitals.bp && (
              <div className={`rounded-lg border p-2.5 text-center ${parseInt(p.vitals.bp) > 140 ? "bg-red-50 border-red-200" : "bg-phc-bg border-phc-border"}`}>
                <div className={`font-mono font-semibold text-[14px] leading-none ${parseInt(p.vitals.bp) > 140 ? "text-red-700" : "text-phc-text"}`}>{p.vitals.bp}</div>
                <div className="text-[10px] text-phc-subtle mt-1">BP (mmHg)</div>
              </div>
            )}
            {p.vitals.pulse && (
              <div className={`rounded-lg border p-2.5 text-center ${(p.vitals.pulse > 100 || p.vitals.pulse < 60) ? "bg-orange-50 border-orange-200" : "bg-phc-bg border-phc-border"}`}>
                <div className={`font-mono font-semibold text-[14px] leading-none ${(p.vitals.pulse > 100 || p.vitals.pulse < 60) ? "text-orange-700" : "text-phc-text"}`}>{p.vitals.pulse}</div>
                <div className="text-[10px] text-phc-subtle mt-1">Pulse /min</div>
              </div>
            )}
            {p.vitals.temp && (
              <div className={`rounded-lg border p-2.5 text-center ${p.vitals.temp > 38.5 ? "bg-orange-50 border-orange-200" : "bg-phc-bg border-phc-border"}`}>
                <div className={`font-mono font-semibold text-[14px] leading-none ${p.vitals.temp > 38.5 ? "text-orange-700" : "text-phc-text"}`}>{p.vitals.temp}</div>
                <div className="text-[10px] text-phc-subtle mt-1">Temp (°C)</div>
              </div>
            )}
            {p.vitals.spo2 && (
              <div className={`rounded-lg border p-2.5 text-center ${p.vitals.spo2 < 95 ? "bg-red-50 border-red-200" : "bg-phc-bg border-phc-border"}`}>
                <div className={`font-mono font-semibold text-[14px] leading-none ${p.vitals.spo2 < 95 ? "text-red-700" : "text-phc-text"}`}>{p.vitals.spo2}%</div>
                <div className="text-[10px] text-phc-subtle mt-1">SpO₂</div>
              </div>
            )}
            {p.vitals.rr && (
              <div className={`rounded-lg border p-2.5 text-center ${p.vitals.rr > 20 ? "bg-amber-50 border-amber-200" : "bg-phc-bg border-phc-border"}`}>
                <div className={`font-mono font-semibold text-[14px] leading-none ${p.vitals.rr > 20 ? "text-amber-700" : "text-phc-text"}`}>{p.vitals.rr}</div>
                <div className="text-[10px] text-phc-subtle mt-1">RR /min</div>
              </div>
            )}
            {p.vitals.weight && (
              <div className="rounded-lg border border-phc-border p-2.5 text-center bg-phc-bg">
                <div className="font-mono font-semibold text-[14px] leading-none text-phc-text">{p.vitals.weight}</div>
                <div className="text-[10px] text-phc-subtle mt-1">Weight (kg)</div>
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        {p.notes && (
          <div className="mb-4">
            <div className="text-[10.5px] font-display font-bold text-phc-muted uppercase tracking-widest mb-1.5">Clinical Notes</div>
            <div className="text-[13px] text-phc-text leading-relaxed bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5">
              {p.notes}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-phc-border">
          <button className="flex-1 py-2 text-[12.5px] font-display font-semibold bg-phc-blue text-white rounded-lg hover:bg-phc-blue-dark transition-colors cursor-pointer">
            Start Treatment
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 text-[12.5px] font-display font-medium border border-phc-border rounded-lg text-phc-text hover:bg-phc-bg transition-colors cursor-pointer">
            <CornerUpRight size={13} />
            Refer
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 text-[12.5px] font-display font-medium border border-phc-border rounded-lg text-phc-text hover:bg-phc-bg transition-colors cursor-pointer">
            <CheckCircle2 size={13} />
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Triage() {
  const [selected, setSelected] = useState<TriagePatient>(PATIENTS[0]);
  const [filterAcuity, setFilterAcuity] = useState<Acuity | "all">("all");

  const sorted = [...PATIENTS].sort((a, b) => {
    const order: Record<Acuity, number> = { emergency: 0, urgent: 1, moderate: 2, routine: 3 };
    return order[a.acuity] - order[b.acuity];
  });

  const filtered = filterAcuity === "all" ? sorted : sorted.filter((p) => p.acuity === filterAcuity);

  const counts = {
    emergency: PATIENTS.filter((p) => p.acuity === "emergency" && p.status !== "done").length,
    urgent: PATIENTS.filter((p) => p.acuity === "urgent" && p.status !== "done").length,
    waiting: PATIENTS.filter((p) => p.status === "waiting").length,
    treating: PATIENTS.filter((p) => p.status === "treating" || p.status === "assessing").length,
  };

  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="font-display font-bold text-phc-text text-2xl leading-none">Triage & Cases</h1>
          <p className="text-[13px] text-phc-muted mt-1.5">Live queue · Priority-sorted · {new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-phc-blue text-white text-[12.5px] font-display font-semibold hover:bg-phc-blue-dark transition-colors cursor-pointer">
          <Plus size={14} />
          New Triage Entry
        </button>
      </div>

      {/* Status bar */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: "Emergency", value: counts.emergency, color: "text-red-700", bg: "bg-red-50 border-red-200" },
          { label: "Urgent", value: counts.urgent, color: "text-orange-700", bg: "bg-orange-50 border-orange-200" },
          { label: "Waiting", value: counts.waiting, color: "text-amber-800", bg: "bg-amber-50 border-amber-200" },
          { label: "In Treatment", value: counts.treating, color: "text-blue-800", bg: "bg-blue-50 border-blue-200" },
        ].map((s) => (
          <div key={s.label} className={`border rounded-lg px-4 py-3 ${s.bg}`}>
            <div className={`font-display font-bold text-2xl leading-none ${s.color}`}>{s.value}</div>
            <div className="text-[12px] text-phc-muted mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Acuity filter */}
      <div className="flex gap-2 mb-4">
        {(["all", "emergency", "urgent", "moderate", "routine"] as const).map((a) => (
          <button
            key={a}
            onClick={() => setFilterAcuity(a)}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-display font-medium capitalize transition-colors cursor-pointer border ${
              filterAcuity === a
                ? "bg-phc-blue text-white border-phc-blue"
                : "bg-phc-surface text-phc-muted border-phc-border hover:bg-phc-bg"
            }`}
          >
            {a === "all" ? "All cases" : ACUITY_META[a].label}
          </button>
        ))}
      </div>

      {/* Two-column: list + detail */}
      <div className="grid grid-cols-[320px_1fr] gap-5">
        <div className="flex flex-col gap-3 overflow-y-auto">
          {filtered.map((p) => (
            <TriageCard
              key={p.token}
              p={p}
              onClick={() => setSelected(p)}
              active={selected?.token === p.token}
            />
          ))}
        </div>
        <div>{selected && <DetailView p={selected} />}</div>
      </div>
    </div>
  );
}
