import { useState } from "react";
import { CheckCircle2, Clock, AlertTriangle, Calendar } from "lucide-react";
import { mockFollowups } from "@/data";

const PRIORITY: Record<string, { bg: string; text: string }> = {
  Normal: { bg: "bg-gray-100", text: "text-gray-700" },
};

const STATUS: Record<string, { bg: string; text: string }> = {
  "Due Today": { bg: "bg-blue-50", text: "text-blue-800" },
  "Upcoming": { bg: "bg-gray-100", text: "text-gray-700" },
  "Overdue": { bg: "bg-red-50", text: "text-red-700" },
};

export default function Followups() {
  const [followups, setFollowups] = useState(mockFollowups);

  const completeFollowup = (id: string) => {
    setFollowups(prev => prev.map(f => f.id === id ? {...f, status: "Completed"} : f));
  };

  return (
    <div className="p-6">
      <h1 className="font-display font-bold text-phc-text text-2xl mb-6">Follow-ups</h1>
      <div className="bg-phc-surface border border-phc-border rounded-lg overflow-hidden">
        <table className="w-full text-[12.5px]">
          <thead>
            <tr className="bg-phc-bg border-b border-phc-border">
              {["Patient", "Case", "Date", "Reason", "ASHA", "Priority", "Status", "Action"].map(h => (
                <th key={h} className="px-4 py-2.5 text-left font-display font-semibold text-phc-muted uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {followups.map((f) => (
              <tr key={f.id} className="border-b border-phc-border-light hover:bg-phc-bg">
                <td className="px-4 py-3 font-medium text-phc-text">{f.patient}</td>
                <td className="px-4 py-3 text-phc-muted">{f.case}</td>
                <td className="px-4 py-3 text-phc-muted">{f.date}</td>
                <td className="px-4 py-3 text-phc-muted">{f.reason}</td>
                <td className="px-4 py-3 text-phc-muted">{f.asha}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-0.5 rounded text-[11px] ${PRIORITY[f.priority].bg} ${PRIORITY[f.priority].text}`}>{f.priority}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-0.5 rounded text-[11px] ${STATUS[f.status]?.bg || "bg-green-50"} ${STATUS[f.status]?.text || "text-green-800"}`}>{f.status}</span>
                </td>
                <td className="px-4 py-3">
                  {f.status !== "Completed" && (
                    <button onClick={() => completeFollowup(f.id)} className="text-phc-blue hover:underline font-display text-[12px]">Complete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
