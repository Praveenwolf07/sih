import { useState } from "react";
import { Calendar, Clock, Plus, ChevronLeft, ChevronRight, UserCheck, CheckCircle2, Loader2, X } from "lucide-react";

type ApptStatus = "scheduled" | "in-progress" | "done" | "no-show";
type ApptType = "OPD" | "ANC" | "Immunisation" | "DOT" | "Follow-up" | "Procedure";

interface Appointment {
  id: string;
  token: string;
  time: string;
  duration: number;
  patient: string;
  patientId: string;
  age: number;
  sex: "M" | "F";
  type: ApptType;
  reason: string;
  doctor: string;
  asha?: string;
  status: ApptStatus;
}

const APPOINTMENTS: Appointment[] = [
  { id: "APT-001", token: "#001", time: "08:30", duration: 15, patient: "Kamla Devi", patientId: "BR-PAT-P-0892", age: 45, sex: "F", type: "OPD", reason: "Viral fever — follow-up, day 3", doctor: "Dr. Aravind Kumar", asha: "Meena K.", status: "done" },
  { id: "APT-002", token: "#002", time: "08:45", duration: 20, patient: "Raghav Sharma", patientId: "BR-PAT-P-0893", age: 62, sex: "M", type: "Follow-up", reason: "Diabetes monitoring — HbA1c review", doctor: "Dr. Aravind Kumar", status: "done" },
  { id: "APT-003", token: "#003", time: "09:00", duration: 30, patient: "Ananya Singh", patientId: "BR-PAT-P-0894", age: 28, sex: "F", type: "ANC", reason: "ANC visit — 28 weeks, 4th antenatal check", doctor: "Dr. Aravind Kumar", asha: "Sunita D.", status: "done" },
  { id: "APT-004", token: "#004", time: "09:30", duration: 20, patient: "Baby Aarav Singh", patientId: "BR-PAT-P-0903", age: 1, sex: "M", type: "OPD", reason: "Paediatric fever — review", doctor: "Dr. Aravind Kumar", asha: "Rekha Sharma", status: "in-progress" },
  { id: "APT-005", token: "#005", time: "10:00", duration: 15, patient: "Asha Verma", patientId: "BR-PAT-P-0902", age: 35, sex: "F", type: "Follow-up", reason: "Hypertension — monthly review", doctor: "Dr. Aravind Kumar", status: "scheduled" },
  { id: "APT-006", token: "#006", time: "10:15", duration: 10, patient: "Shivam Tiwari", patientId: "BR-PAT-P-0895", age: 55, sex: "M", type: "DOT", reason: "TB DOT — direct observation day 43", doctor: "Staff Nurse Rekha", status: "scheduled" },
  { id: "APT-007", token: "#007", time: "11:00", duration: 15, patient: "Vikas Singh", patientId: "BR-PAT-P-0901", age: 70, sex: "M", type: "Follow-up", reason: "Diabetic foot — wound review", doctor: "Dr. Aravind Kumar", status: "scheduled" },
  { id: "APT-008", token: "#008", time: "11:15", duration: 20, patient: "Baby Pooja", patientId: "BR-PAT-P-0905", age: 0, sex: "F", type: "Immunisation", reason: "BCG + OPV₀ — birth dose at 6 weeks", doctor: "Staff Nurse Rekha", asha: "Anita Yadav", status: "scheduled" },
  { id: "APT-009", token: "#009", time: "11:30", duration: 30, patient: "Pooja Kumari", patientId: "BR-PAT-P-0900", age: 32, sex: "F", type: "ANC", reason: "ANC visit — 32 weeks, gestational diabetes review", doctor: "Dr. Aravind Kumar", asha: "Anita Yadav", status: "scheduled" },
  { id: "APT-010", token: "#010", time: "12:00", duration: 15, patient: "Manohar Singh", patientId: "BR-PAT-P-0906", age: 48, sex: "M", type: "Procedure", reason: "Post-op wound dressing — day 7", doctor: "Dr. Aravind Kumar", status: "scheduled" },
  { id: "APT-011", token: "#011", time: "12:30", duration: 20, patient: "Lakshmi Devi", patientId: "BR-PAT-P-0907", age: 58, sex: "F", type: "Follow-up", reason: "Cataract — pre-referral evaluation", doctor: "Dr. Aravind Kumar", asha: "Rekha Sharma", status: "scheduled" },
  { id: "APT-012", token: "#012", time: "09:15", duration: 15, patient: "Rakesh Yadav", patientId: "BR-PAT-P-0908", age: 44, sex: "M", type: "OPD", reason: "Acute back pain", doctor: "Dr. Aravind Kumar", status: "no-show" },
];

const STATUS_META: Record<ApptStatus, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
  "scheduled": { label: "Scheduled", bg: "bg-amber-50", text: "text-amber-800", icon: <Clock size={10} /> },
  "in-progress": { label: "In Progress", bg: "bg-blue-50", text: "text-blue-800", icon: <Loader2 size={10} className="animate-spin" /> },
  "done": { label: "Done", bg: "bg-gray-100", text: "text-gray-700", icon: <CheckCircle2 size={10} /> },
  "no-show": { label: "No Show", bg: "bg-red-50", text: "text-red-700", icon: <X size={10} /> },
};

const TYPE_COLORS: Record<ApptType, string> = {
  OPD: "bg-sky-100 text-sky-800",
  ANC: "bg-pink-100 text-pink-800",
  Immunisation: "bg-phc-green-light text-phc-green",
  DOT: "bg-orange-100 text-orange-800",
  "Follow-up": "bg-slate-100 text-slate-700",
  Procedure: "bg-violet-100 text-violet-800",
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HOURS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00"];

function getTop(time: string) {
  const [h, m] = time.split(":").map(Number);
  return ((h - 8) * 60 + m) / 360 * 100;
}

export default function Appointments() {
  const [view, setView] = useState<"list" | "schedule">("list");
  const [today] = useState(new Date());

  const done = APPOINTMENTS.filter((a) => a.status === "done").length;
  const inProgress = APPOINTMENTS.filter((a) => a.status === "in-progress").length;
  const upcoming = APPOINTMENTS.filter((a) => a.status === "scheduled").length;

  const dateStr = today.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-phc-text text-2xl leading-none">Appointments & Queue</h1>
          <p className="text-[13px] text-slate-900 mt-1.5">{dateStr} · Morning Shift</p>
        </div>
        <div className="flex gap-2">
          <div className="flex border border-phc-border rounded-lg overflow-hidden">
            {(["list", "schedule"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 text-[12px] font-display font-medium capitalize transition-colors cursor-pointer ${view === v ? "bg-phc-blue text-white" : "text-phc-muted hover:bg-phc-bg"}`}
              >
                {v === "list" ? "List" : "Schedule"}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-phc-blue text-white text-[12.5px] font-display font-semibold hover:bg-phc-blue-dark transition-colors cursor-pointer">
            <Plus size={14} />
            New Appointment
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {[
          { label: "Total Today", value: APPOINTMENTS.length, color: "text-slate-900" },
          { label: "Done", value: done, color: "text-phc-green" },
          { label: "In Progress", value: inProgress, color: "text-phc-blue" },
          { label: "Upcoming", value: upcoming, color: "text-amber-700" },
        ].map((s) => (
          <div key={s.label} className="bg-phc-surface border border-phc-border rounded-lg px-4 py-4">
            <div className={`font-display font-bold text-2xl leading-none ${s.color}`}>{s.value}</div>
            <div className="text-[12px] text-slate-900 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* List view */}
      {view === "list" && (
        <div className="bg-phc-surface border border-phc-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-phc-bg border-b border-phc-border">
                {["Token", "Time", "Patient", "Type", "Reason", "Doctor / Nurse", "ASHA", "Status", ""].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-[10.5px] font-display font-semibold text-slate-900 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {APPOINTMENTS.map((a, i) => {
                const sm = STATUS_META[a.status];
                return (
                  <tr key={a.id} className={`border-b border-phc-border-light hover:bg-phc-blue-light/20 transition-colors cursor-pointer ${i % 2 === 1 ? "bg-phc-bg/40" : ""} ${a.status === "in-progress" ? "bg-blue-50/40" : ""}`}>
                    <td className="px-4 py-2.5">
                      <span className="font-mono text-[12px] text-phc-blue font-medium">{a.token}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="font-mono text-[12px] text-slate-900">{a.time}</span>
                      <span className="block text-[10.5px] text-slate-700">{a.duration} min</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="font-display font-semibold text-slate-900 text-[13px] whitespace-nowrap">{a.patient}</span>
                      <span className="block text-[11.5px] text-slate-700">{a.age < 1 ? "Infant" : `${a.age}${a.sex}`}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10.5px] font-display font-bold ${TYPE_COLORS[a.type]}`}>{a.type}</span>
                    </td>
                    <td className="px-4 py-2.5 text-[12px] text-slate-700 max-w-[200px] truncate" title={a.reason}>{a.reason}</td>
                    <td className="px-4 py-2.5 text-[12px] text-slate-900 whitespace-nowrap">{a.doctor}</td>
                    <td className="px-4 py-2.5 text-[12px]">
                      {a.asha ? (
                        <span className="flex items-center gap-1 text-phc-green whitespace-nowrap">
                          <UserCheck size={10} />
                          {a.asha}
                        </span>
                      ) : (
                        <span className="text-slate-700">—</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-display font-semibold ${sm.bg} ${sm.text}`}>
                        {sm.icon} {sm.label}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <button className="text-[12px] text-phc-blue hover:underline font-display cursor-pointer">View</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="px-4 py-3 border-t border-phc-border bg-phc-bg text-[11.5px] text-slate-900">
            {APPOINTMENTS.length} appointments scheduled for today
          </div>
        </div>
      )}

      {/* Schedule / timeline view */}
      {view === "schedule" && (
        <div className="bg-phc-surface border border-phc-border rounded-lg overflow-hidden">
          {/* Week nav */}
          <div className="flex items-center gap-4 px-5 py-3.5 border-b border-phc-border">
            <button className="p-1 rounded hover:bg-phc-bg text-phc-muted cursor-pointer"><ChevronLeft size={16} /></button>
            <span className="font-display font-semibold text-slate-900 text-[14px]">Week of 01 Sep 2024</span>
            <button className="p-1 rounded hover:bg-phc-bg text-phc-muted cursor-pointer"><ChevronRight size={16} /></button>
            <button className="ml-auto text-[12.5px] text-phc-blue hover:underline font-display cursor-pointer flex items-center gap-1">
              <Calendar size={13} />
              Today
            </button>
          </div>
          {/* Timeline */}
          <div className="overflow-x-auto">
            <div className="min-w-[700px]">
              {/* Day headers */}
              <div className="grid grid-cols-8 border-b border-phc-border">
                <div className="px-3 py-2" />
                {DAYS.map((d, i) => {
                  const date = new Date(2024, 8, 1 + i);
                  const isToday = i === 0;
                  return (
                    <div key={d} className={`px-3 py-2 text-center border-l border-phc-border ${isToday ? "bg-phc-blue-light" : ""}`}>
                      <div className={`text-[11px] font-display font-semibold ${isToday ? "text-phc-blue" : "text-slate-900"}`}>{d}</div>
                      <div className={`font-display font-bold text-[16px] leading-none mt-0.5 ${isToday ? "text-phc-blue" : "text-slate-900"}`}>
                        {date.getDate()}
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Hours */}
              {HOURS.map((hour) => (
                <div key={hour} className="grid grid-cols-8 border-b border-phc-border-light min-h-[56px]">
                  <div className="px-3 py-2 text-[10.5px] font-mono text-slate-700 pt-2">{hour}</div>
                  {DAYS.map((_, di) => {
                    const slotAppts = di === 0
                      ? APPOINTMENTS.filter((a) => a.time.startsWith(hour.split(":")[0].padStart(2, "0")))
                      : [];
                    return (
                      <div key={di} className={`border-l border-phc-border relative p-1 ${di === 0 ? "bg-phc-bg/40" : ""}`}>
                        {slotAppts.map((a) => {
                          const sm = STATUS_META[a.status];
                          return (
                            <div
                              key={a.id}
                              className={`rounded px-2 py-1 mb-1 text-[10.5px] cursor-pointer border ${sm.bg} ${sm.text} border-current/20 hover:opacity-80 transition-opacity`}
                            >
                              <div className="font-display font-semibold leading-none">{a.time} {a.patient.split(" ")[0]}</div>
                              <div className="opacity-70 mt-0.5">{a.type}</div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
