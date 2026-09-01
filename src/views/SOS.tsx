import { useState } from "react";
import { Siren, Phone, Clock, CheckCircle2, AlertTriangle, MapPin, UserCheck, ChevronRight, Plus, Radio } from "lucide-react";

type AlertStatus = "active" | "dispatched" | "resolved";
type AlertLevel = "sos" | "emergency" | "urgent";

interface SOSAlert {
  id: string;
  patient: string;
  age: number;
  sex: "M" | "F";
  condition: string;
  location: string;
  ward: string;
  asha?: string;
  reportedBy: string;
  time: string;
  elapsed: string;
  level: AlertLevel;
  status: AlertStatus;
  action?: string;
  referredTo?: string;
  ambulance?: string;
}

const ALERTS: SOSAlert[] = [
  {
    id: "SOS-2024-042",
    patient: "Sathya Narayanan",
    age: 42, sex: "M",
    condition: "Acute chest pain, jaw pain, diaphoresis — suspected STEMI",
    location: "14, Gandhi Street, Kovilpatti Town",
    ward: "Ward 3",
    asha: "Selvi Arumugam",
    reportedBy: "ASHA App",
    time: "10:03 AM",
    elapsed: "27 min ago",
    level: "sos",
    status: "active",
    referredTo: "CHC Kovilpatti",
  },
  {
    id: "SOS-2024-041",
    patient: "Geetha Murugan",
    age: 24, sex: "F",
    condition: "Obstructed labour — prolonged labour > 24h, FHR decelerations",
    location: "7, Murugan Nagar, Mangalampet",
    ward: "Ward 4",
    asha: "Devi Subramaniam",
    reportedBy: "ASHA App",
    time: "02:14 AM",
    elapsed: "8 hrs ago",
    level: "emergency",
    status: "dispatched",
    action: "Patient transported to GH Thoothukudi. Ambulance 108-TN-4291 dispatched at 02:28 AM.",
    ambulance: "108-TN-4291",
    referredTo: "GH Thoothukudi",
  },
  {
    id: "SOS-2024-040",
    patient: "Karthikeyan M.",
    age: 7, sex: "M",
    condition: "Febrile seizure — 3 min episode, now postictal",
    location: "22, Anna Nagar, Ottapidaram",
    ward: "Ward 1",
    asha: "Meenakshi Balakrishnan",
    reportedBy: "ASHA App",
    time: "Yesterday, 4:45 PM",
    elapsed: "Yesterday",
    level: "emergency",
    status: "resolved",
    action: "Treated at PHC. Phenobarbitone loading dose given. Discharged with follow-up in 3 days.",
    referredTo: undefined,
  },
  {
    id: "SOS-2024-039",
    patient: "Nalini Raju",
    age: 58, sex: "F",
    condition: "Hypertensive crisis — BP 220/130, severe headache",
    location: "Kovilpatti Town",
    ward: "Ward 2",
    reportedBy: "Direct Walk-in",
    time: "Yesterday, 10:20 AM",
    elapsed: "Yesterday",
    level: "emergency",
    status: "resolved",
    action: "IV Labetalol given. BP stabilised to 160/90. Admitted for observation. Discharged next morning.",
  },
];

const LEVEL_META: Record<AlertLevel, { label: string; bg: string; text: string; border: string; dot: string }> = {
  sos: { label: "SOS", bg: "bg-red-600", text: "text-white", border: "border-red-700", dot: "bg-red-300" },
  emergency: { label: "Emergency", bg: "bg-red-100", text: "text-red-800", border: "border-red-300", dot: "bg-red-500" },
  urgent: { label: "Urgent", bg: "bg-orange-100", text: "text-orange-900", border: "border-orange-300", dot: "bg-orange-400" },
};

const STATUS_META: Record<AlertStatus, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
  active: { label: "Active — Action Required", bg: "bg-red-600", text: "text-white", icon: <AlertTriangle size={11} className="animate-pulse" /> },
  dispatched: { label: "Dispatched", bg: "bg-amber-100", text: "text-amber-900", icon: <Radio size={11} /> },
  resolved: { label: "Resolved", bg: "bg-green-50", text: "text-green-800", icon: <CheckCircle2 size={11} /> },
};

function AlertCard({ alert, active, onClick }: { alert: SOSAlert; active: boolean; onClick: () => void }) {
  const lm = LEVEL_META[alert.level];
  const sm = STATUS_META[alert.status];
  return (
    <div
      onClick={onClick}
      className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${active ? "border-phc-blue shadow-lg" : "border-phc-border hover:border-red-300"} ${alert.status === "active" ? "shadow-md shadow-red-100" : ""}`}
    >
      <div className={`flex items-center gap-2 px-4 py-2 ${alert.level === "sos" ? "bg-red-600" : "bg-phc-bg border-b border-phc-border"}`}>
        <div className={`w-2 h-2 rounded-full ${lm.dot} ${alert.status === "active" ? "animate-pulse" : ""}`} />
        <span className={`text-[11px] font-display font-bold uppercase tracking-wide ${alert.level === "sos" ? "text-white" : "text-red-700"}`}>
          {lm.label} · {alert.id}
        </span>
        <span className={`ml-auto text-[10.5px] font-mono ${alert.level === "sos" ? "text-red-200" : "text-phc-subtle"}`}>{alert.time}</span>
      </div>
      <div className="px-4 py-3 bg-phc-surface">
        <div className="flex items-start justify-between gap-2 mb-1">
          <span className="font-display font-semibold text-phc-text text-[13.5px]">
            {alert.patient} <span className="font-sans font-normal text-phc-muted text-[12px]">{alert.age}{alert.sex}</span>
          </span>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-display font-semibold flex-shrink-0 ${sm.bg} ${sm.text}`}>
            {sm.icon} {sm.label}
          </span>
        </div>
        <p className="text-[12px] text-phc-muted leading-snug">{alert.condition}</p>
        <div className="flex items-center gap-2 mt-2">
          <MapPin size={10} className="text-phc-subtle flex-shrink-0" />
          <span className="text-[11px] text-phc-subtle">{alert.ward} · {alert.location}</span>
        </div>
        {alert.asha && (
          <div className="flex items-center gap-1 mt-1 text-[11px] text-phc-green">
            <UserCheck size={10} />
            {alert.asha}
          </div>
        )}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-phc-border-light">
          <span className="text-[10.5px] text-phc-subtle">{alert.elapsed}</span>
          <ChevronRight size={12} className="text-phc-subtle" />
        </div>
      </div>
    </div>
  );
}

function AlertDetail({ alert, onResolve }: { alert: SOSAlert; onResolve: () => void }) {
  const lm = LEVEL_META[alert.level];
  const sm = STATUS_META[alert.status];
  return (
    <div className="bg-phc-surface border border-phc-border rounded-lg overflow-hidden">
      {/* Header strip */}
      <div className={`flex items-center gap-3 px-5 py-3.5 border-b ${alert.level === "sos" ? "bg-red-600 border-red-700" : "bg-red-50 border-red-200"}`}>
        <Siren size={18} className={alert.level === "sos" ? "text-white" : "text-red-600"} />
        <div>
          <div className={`font-display font-bold text-[15px] leading-none ${alert.level === "sos" ? "text-white" : "text-red-800"}`}>
            {lm.label} Alert — {alert.id}
          </div>
          <div className={`text-[11.5px] mt-0.5 font-mono ${alert.level === "sos" ? "text-red-200" : "text-red-600"}`}>
            Reported {alert.time} · {alert.elapsed}
          </div>
        </div>
        <span className={`ml-auto inline-flex items-center gap-1.5 px-3 py-1 rounded text-[11.5px] font-display font-semibold ${sm.bg} ${sm.text}`}>
          {sm.icon} {sm.label}
        </span>
      </div>

      <div className="px-5 py-5 space-y-5">
        {/* Patient */}
        <div>
          <div className="text-[10.5px] font-display font-bold text-phc-muted uppercase tracking-widest mb-2">Patient</div>
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={18} className="text-red-600" />
            </div>
            <div>
              <div className="font-display font-bold text-phc-text text-[15px]">
                {alert.patient} <span className="text-[13px] font-sans font-normal text-phc-muted">{alert.age} yrs · {alert.sex === "F" ? "Female" : "Male"}</span>
              </div>
              <div className="text-[13px] text-phc-text mt-1 leading-snug">{alert.condition}</div>
              {alert.asha && (
                <div className="flex items-center gap-1 mt-1.5 text-[12px] text-phc-green">
                  <UserCheck size={11} />
                  Reported by ASHA: {alert.asha} via ASHA App
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Location */}
        <div>
          <div className="text-[10.5px] font-display font-bold text-phc-muted uppercase tracking-widest mb-2">Location</div>
          <div className="flex items-center gap-2 bg-phc-bg border border-phc-border rounded-lg px-3 py-2.5">
            <MapPin size={14} className="text-phc-blue flex-shrink-0" />
            <div>
              <div className="text-[13px] text-phc-text">{alert.location}</div>
              <div className="text-[11.5px] text-phc-muted">{alert.ward} · Kovilpatti Block · Thoothukudi</div>
            </div>
          </div>
        </div>

        {/* Referral / Ambulance */}
        {(alert.referredTo || alert.ambulance) && (
          <div>
            <div className="text-[10.5px] font-display font-bold text-phc-muted uppercase tracking-widest mb-2">Response</div>
            <div className="space-y-2">
              {alert.referredTo && (
                <div className="flex items-center gap-2 text-[12.5px] text-phc-text bg-phc-bg border border-phc-border rounded-lg px-3 py-2">
                  <ChevronRight size={13} className="text-phc-blue" />
                  Referred to: <span className="font-display font-semibold text-phc-blue">{alert.referredTo}</span>
                </div>
              )}
              {alert.ambulance && (
                <div className="flex items-center gap-2 text-[12.5px] text-phc-text bg-phc-bg border border-phc-border rounded-lg px-3 py-2">
                  <Radio size={13} className="text-phc-green" />
                  Ambulance: <span className="font-mono font-semibold text-phc-green">{alert.ambulance}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action log */}
        {alert.action && (
          <div>
            <div className="text-[10.5px] font-display font-bold text-phc-muted uppercase tracking-widest mb-2">Action Taken</div>
            <div className="bg-phc-bg border border-phc-border rounded-lg px-3 py-3 text-[13px] text-phc-text leading-relaxed">
              {alert.action}
            </div>
          </div>
        )}

        {/* Quick contacts */}
        <div>
          <div className="text-[10.5px] font-display font-bold text-phc-muted uppercase tracking-widest mb-2">Emergency Contacts</div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Ambulance 108", number: "108" },
              { label: "CHC Kovilpatti", number: "04632-222 XXX" },
              { label: "GH Thoothukudi", number: "0461-234 XXXX" },
              { label: "District CMO", number: "0461-222 XXXX" },
            ].map((c) => (
              <button key={c.label} className="flex items-center gap-2.5 px-3 py-2.5 bg-phc-bg border border-phc-border rounded-lg hover:border-phc-blue/40 transition-colors cursor-pointer text-left">
                <div className="w-7 h-7 rounded-full bg-phc-blue-light flex items-center justify-center flex-shrink-0">
                  <Phone size={12} className="text-phc-blue" />
                </div>
                <div>
                  <div className="text-[12px] font-display font-medium text-phc-text leading-none">{c.label}</div>
                  <div className="text-[11px] font-mono text-phc-blue mt-0.5">{c.number}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        {alert.status === "active" && (
          <div className="flex gap-2 pt-2 border-t border-phc-border">
            <button className="flex-1 py-2.5 text-[13px] font-display font-bold bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer flex items-center justify-center gap-2">
              <Phone size={14} />
              Call Ambulance 108
            </button>
            <button
              onClick={onResolve}
              className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-display font-medium border border-phc-border rounded-lg text-phc-text hover:bg-phc-bg transition-colors cursor-pointer"
            >
              <CheckCircle2 size={14} />
              Mark Resolved
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SOS() {
  const [alerts, setAlerts] = useState<SOSAlert[]>(ALERTS);
  const [selected, setSelected] = useState<SOSAlert>(ALERTS[0]);

  const handleResolve = () => {
    setAlerts((prev) =>
      prev.map((a) => a.id === selected.id ? { ...a, status: "resolved" as AlertStatus, action: "Marked resolved by Dr. Aravind Kumar at PHC." } : a)
    );
    setSelected((s) => ({ ...s, status: "resolved" as AlertStatus, action: "Marked resolved by Dr. Aravind Kumar at PHC." }));
  };

  const activeCount = alerts.filter((a) => a.status === "active").length;

  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="font-display font-bold text-phc-text text-2xl leading-none flex items-center gap-2.5">
            {activeCount > 0 && <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse inline-block" />}
            SOS / Emergency
          </h1>
          <p className="text-[13px] text-phc-muted mt-1.5">
            {activeCount > 0 ? (
              <span className="text-red-600 font-display font-semibold">{activeCount} active alert{activeCount > 1 ? "s" : ""} — immediate action required</span>
            ) : "No active SOS alerts"}
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-[12.5px] font-display font-semibold hover:bg-red-700 transition-colors cursor-pointer">
          <Plus size={14} />
          Log Emergency
        </button>
      </div>

      {/* Active alert banner */}
      {activeCount > 0 && (
        <div className="mb-5 bg-red-600 text-white rounded-lg px-5 py-3.5 flex items-center gap-4">
          <Siren size={20} className="flex-shrink-0 animate-pulse" />
          <div>
            <div className="font-display font-bold text-[14px]">SOS Alert Active — Sathya Narayanan (Token #007)</div>
            <div className="text-[12.5px] text-red-100 mt-0.5">Suspected STEMI · 10:03 AM · Ward 3 · Reported via ASHA App</div>
          </div>
          <div className="ml-auto flex gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-red-700 rounded-lg text-[12px] font-display font-bold hover:bg-red-50 transition-colors cursor-pointer">
              <Phone size={12} />
              108
            </button>
            <button
              onClick={() => setSelected(alerts[0])}
              className="px-3 py-1.5 bg-red-800 text-white rounded-lg text-[12px] font-display font-semibold hover:bg-red-900 transition-colors cursor-pointer"
            >
              View Case
            </button>
          </div>
        </div>
      )}

      {/* Two-col: list + detail */}
      <div className="grid grid-cols-[320px_1fr] gap-5">
        <div className="flex flex-col gap-3">
          <div className="text-[10.5px] font-display font-bold text-phc-muted uppercase tracking-widest mb-1">
            {alerts.length} alerts — last 7 days
          </div>
          {alerts.map((a) => (
            <AlertCard
              key={a.id}
              alert={a}
              active={selected?.id === a.id}
              onClick={() => setSelected(a)}
            />
          ))}
        </div>
        {selected && <AlertDetail alert={selected} onResolve={handleResolve} />}
      </div>

      {/* Protocol reference */}
      <div className="mt-5 bg-phc-blue-light border border-blue-200 rounded-lg px-4 py-3">
        <div className="font-display font-semibold text-phc-blue text-[13px] mb-1">Emergency Protocol — Quick Reference</div>
        <div className="grid grid-cols-3 gap-4 text-[12px] text-phc-muted">
          <div>
            <div className="font-display font-semibold text-phc-text mb-0.5">Cardiac / Chest Pain</div>
            ECG → IV access → O₂ → Aspirin 325mg → Refer CHC/GH immediately
          </div>
          <div>
            <div className="font-display font-semibold text-phc-text mb-0.5">Obstetric Emergency</div>
            Stabilise → IV oxytocin/MgSO₄ → Call 108 → Refer GH → Inform CMOH
          </div>
          <div>
            <div className="font-display font-semibold text-phc-text mb-0.5">Paediatric Seizure</div>
            Airway → Diazepam PR → O₂ → IV access → Refer if {">"} 5 min or recurrent
          </div>
        </div>
      </div>
    </div>
  );
}
