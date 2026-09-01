import {
  Users,
  Clock,
  ArrowRightLeft,
  Package,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  UserCheck,
  AlertTriangle,
  Circle,
  CheckCircle2,
  Loader2,
  CornerUpRight,
  Calendar,
  Plus,
} from "lucide-react";
import { dashboardMetrics } from "@/data";
import { ViewType } from "../types";

interface DashboardProps {
  onNavigate: (view: ViewType) => void;
}

type QueueStatus = "waiting" | "treating" | "done" | "referred" | "critical";

interface QueuePatient {
  token: string;
  name: string;
  age: number;
  sex: "M" | "F";
  complaint: string;
  asha?: string;
  arrived: string;
  status: QueueStatus;
}

// Temporary data structure for the queue to maintain functional parity while integrating
const QUEUE: QueuePatient[] = [
  { token: "#001", name: "Kamla Devi", age: 45, sex: "F", complaint: "Fever, body pain", asha: "Meena K.", arrived: "08:42", status: "treating" },
  { token: "#002", name: "Raghav Sharma", age: 62, sex: "M", complaint: "Diabetes monitoring", asha: undefined, arrived: "09:05", status: "waiting" },
  { token: "#003", name: "Ananya Singh", age: 28, sex: "F", complaint: "ANC — 28 weeks", asha: "Sunita D.", arrived: "09:18", status: "waiting" },
  { token: "#004", name: "Baby Aarav Singh", age: 1, sex: "M", complaint: "Paediatric fever — 3 days", asha: "Rekha Sharma", arrived: "09:31", status: "treating" },
];

type ReferralPriority = "urgent" | "normal" | "emergency";

interface Referral {
  id: string;
  patient: string;
  age: number;
  sex: "M" | "F";
  reason: string;
  referredTo: string;
  asha: string;
  time: string;
  priority: ReferralPriority;
}

const REFERRALS: Referral[] = [
  { id: "REF-2024-089", patient: "Ravi Kumar Sharma", age: 42, sex: "M", reason: "Chest pain, ECG abnormal", referredTo: "AIIMS Patna", asha: "Sunita Devi", time: "10:05 AM", priority: "urgent" },
  { id: "REF-2024-088", patient: "Pooja Kumari", age: 24, sex: "F", reason: "Complicated delivery — LSCS", referredTo: "PMCH Patna (Patna Medical College)", asha: "Devi S.", time: "Yesterday", priority: "emergency" },
];

interface Appointment {
  time: string;
  patient: string;
  age: number;
  sex: "M" | "F";
  type: string;
  doctor: string;
}

const APPOINTMENTS: Appointment[] = [
  { time: "11:00", patient: "Selvaraj D.", age: 70, sex: "M", type: "Diabetic foot review", doctor: "Dr. Aravind Kumar" },
  { time: "11:30", patient: "Baby Meenakshi", age: 0, sex: "F", type: "Immunisation (BCG)", doctor: "Staff Nurse Rekha" },
];

const STATUS_META: Record<QueueStatus, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
  waiting: {
    label: "Waiting",
    bg: "bg-amber-50",
    text: "text-amber-800",
    icon: <Clock size={11} />,
  },
  treating: {
    label: "In Treatment",
    bg: "bg-blue-50",
    text: "text-blue-800",
    icon: <Loader2 size={11} className="animate-spin" />,
  },
  done: {
    label: "Done",
    bg: "bg-gray-100",
    text: "text-gray-700",
    icon: <CheckCircle2 size={11} />,
  },
  referred: {
    label: "Referred",
    bg: "bg-violet-50",
    text: "text-violet-800",
    icon: <CornerUpRight size={11} />,
  },
  critical: {
    label: "Critical",
    bg: "bg-red-50",
    text: "text-red-700",
    icon: <AlertTriangle size={11} />,
  },
};

const PRIORITY_META: Record<ReferralPriority, { label: string; bg: string; text: string }> = {
  emergency: { label: "Emergency", bg: "bg-red-100", text: "text-red-700" },
  urgent: { label: "Urgent", bg: "bg-amber-100", text: "text-amber-800" },
  normal: { label: "Normal", bg: "bg-gray-100", text: "text-gray-700" },
};

function StatusBadge({ status }: { status: QueueStatus }) {
  const m = STATUS_META[status];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-display font-semibold ${m.bg} ${m.text}`}
    >
      {m.icon}
      {m.label}
    </span>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  subColor,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub: string;
  subColor?: string;
  accent?: string;
}) {
  return (
    <div className="bg-phc-surface border border-phc-border rounded-lg p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${accent || "bg-phc-blue-light"}`}
        >
          {icon}
        </div>
      </div>
      <div>
        <div className="font-display font-bold text-phc-text text-3xl leading-none">
          {value}
        </div>
        <div className="text-[12.5px] text-phc-muted font-sans mt-1">{label}</div>
      </div>
      <div className={`text-[11.5px] font-sans ${subColor || "text-phc-subtle"}`}>{sub}</div>
    </div>
  );
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="p-6 max-w-[1200px]">
      {/* Page header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-phc-text text-2xl leading-none">
            Dashboard
          </h1>
          <p className="text-phc-muted text-[13px] mt-1.5 font-sans">{today} &nbsp;·&nbsp; Morning Shift (08:00 – 14:00)</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onNavigate("sos")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-[12.5px] font-display font-semibold hover:bg-red-700 transition-colors cursor-pointer"
          >
            <AlertTriangle size={14} />
            SOS Emergency
          </button>
          <button
            onClick={() => onNavigate("appointments")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-phc-border text-phc-text text-[12.5px] font-display font-medium hover:bg-phc-bg transition-colors cursor-pointer"
          >
            <Plus size={14} />
            New Patient
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={<Users size={20} className="text-phc-blue" />}
          label="New Cases Today"
          value={dashboardMetrics.newCases}
          sub="↑ 12 from yesterday"
          subColor="text-phc-green"
          accent="bg-phc-blue-light"
        />
        <StatCard
          icon={<AlertTriangle size={20} className="text-red-600" />}
          label="Critical Cases"
          value={dashboardMetrics.criticalCases}
          sub="Requires immediate attention"
          subColor="text-red-600"
          accent="bg-red-50"
        />
        <StatCard
          icon={<Clock size={20} className="text-amber-600" />}
          label="Today's Queue"
          value={dashboardMetrics.todayQueue}
          sub="Active patients in queue"
          subColor="text-amber-700"
          accent="bg-amber-50"
        />
        <StatCard
          icon={<ArrowRightLeft size={20} className="text-violet-600" />}
          label="Active Referrals"
          value={dashboardMetrics.activeReferrals}
          sub="Pending external review"
          subColor="text-violet-700"
          accent="bg-violet-50"
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-[1fr_340px] gap-5">
        {/* Queue table */}
        <div className="bg-phc-surface border border-phc-border rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-phc-border">
            <div>
              <h2 className="font-display font-semibold text-phc-text text-[14px]">
                Today's Queue
              </h2>
            </div>
            <button
              onClick={() => onNavigate("appointments")}
              className="flex items-center gap-1.5 text-[11.5px] text-phc-blue font-display font-medium hover:underline cursor-pointer"
            >
              View full queue <ChevronRight size={12} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px]">
              <thead>
                <tr className="bg-phc-bg border-b border-phc-border">
                  {["Token", "Patient", "Age/Sex", "Complaint", "ASHA", "Status", ""].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-2.5 text-left font-display font-semibold text-phc-muted text-[11px] uppercase tracking-wide whitespace-nowrap"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {QUEUE.map((p) => (
                  <tr
                    key={p.token}
                    className="border-b border-phc-border-light hover:bg-phc-blue-light/30 transition-colors"
                  >
                    <td className="px-4 py-2.5">
                      <span className="font-mono text-[11.5px] text-phc-blue font-medium">
                        {p.token}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 font-display font-medium text-phc-text whitespace-nowrap">
                      {p.name}
                    </td>
                    <td className="px-4 py-2.5 text-phc-muted whitespace-nowrap">
                      {p.age}/{p.sex}
                    </td>
                    <td className="px-4 py-2.5 text-phc-text max-w-[160px] truncate" title={p.complaint}>
                      {p.complaint}
                    </td>
                    <td className="px-4 py-2.5 text-phc-muted">
                      {p.asha || "—"}
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-4 py-2.5">
                      <button className="text-[11.5px] text-phc-blue hover:underline font-display cursor-pointer">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          {/* Stats Alerts */}
          <div className="grid grid-cols-2 gap-4">
             <StatCard
               icon={<CheckCircle2 size={16} className="text-phc-green" />}
               label="Follow-ups Due"
               value={dashboardMetrics.followupsDue}
               sub=""
               accent="bg-phc-green-light"
             />
             <StatCard
               icon={<AlertTriangle size={16} className="text-red-600" />}
               label="SOS Alerts"
               value={dashboardMetrics.sosAlerts}
               sub=""
               accent="bg-red-50"
             />
          </div>

          {/* Recent Activity */}
          <div className="bg-phc-surface border border-phc-border rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-phc-border">
              <h2 className="font-display font-semibold text-phc-text text-[13.5px]">
                Recent Activity
              </h2>
            </div>
            <div className="p-4 text-[12px] text-phc-muted">
               - 10:05 AM: Referral REF-2024-089 updated.
               - 09:50 AM: Inventory alert: Paracetamol low.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

