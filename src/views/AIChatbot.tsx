import { useMemo, useState } from "react";
import {
  Bot,
  BrainCircuit,
  CalendarClock,
  CheckCircle2,
  Loader2,
  MessageSquareText,
  SendHorizontal,
  ShieldCheck,
  Stethoscope,
  Users,
} from "lucide-react";

type ChatChannel = "doctor" | "patient" | "asha";

type Message = {
  id: number;
  sender: "ai" | "user";
  text: string;
  time: string;
};

const CHANNEL_CONFIG: Record<
  ChatChannel,
  {
    label: string;
    accent: string;
    chip: string;
    summary: string;
    prompt: string;
    quickActions: string[];
  }
> = {
  doctor: {
    label: "Doctor",
    accent: "from-blue-600 to-cyan-500",
    chip: "bg-blue-100 text-blue-700",
    summary: "Clinical guidance and referral coordination",
    prompt: "Ask for a triage recommendation, case summary, or referral support.",
    quickActions: [
      "Triage this patient",
      "Need referral summary",
      "Follow-up plan",
      "Risk alert review",
    ],
  },
  patient: {
    label: "Patient",
    accent: "from-emerald-600 to-green-500",
    chip: "bg-emerald-100 text-emerald-700",
    summary: "Care instructions, appointment reminders, and symptom guidance",
    prompt: "Ask about medicine, appointment, or symptoms.",
    quickActions: [
      "What should I do next?",
      "Schedule follow-up",
      "Symptoms check",
      "Medicine reminder",
    ],
  },
  asha: {
    label: "ASHA Worker",
    accent: "from-violet-600 to-fuchsia-500",
    chip: "bg-violet-100 text-violet-700",
    summary: "Field outreach, risk alerts, and referral coordination",
    prompt: "Ask for patient escalation, home visit guidance, or outreach support.",
    quickActions: [
      "High-risk patient alert",
      "Referral checklist",
      "Village outreach plan",
      "Danger sign guidance",
    ],
  },
};

const buildAiReply = (channel: ChatChannel, input: string) => {
  const text = input.toLowerCase();

  if (channel === "doctor") {
    if (text.includes("triage") || text.includes("urgent") || text.includes("critical")) {
      return "I recommend immediate triage review for unstable vitals or chest pain with hypoxia. Prioritize ECG, oxygen assessment, and urgent referral if the patient has chest pain, shortness of breath, or altered consciousness.";
    }
    if (text.includes("referral") || text.includes("hospital") || text.includes("transfer")) {
      return "For a referral, document the chief complaint, vitals, pregnancy status or risk flags, ASHA source, and destination reason. For emergency cases, contact CHC/EMS and confirm acknowledgement before transfer.";
    }
    if (text.includes("follow") || text.includes("follow-up") || text.includes("next")) {
      return "Create a follow-up plan with medication adherence, symptom review, and a check-in date within 48–72 hours for high-risk patients. Share the action plan with the ASHA worker and patient.";
    }
    return "Based on the current care pathway, I suggest reviewing triage status, checking recent vitals, and confirming whether the patient needs a referral or home follow-up before the next consultation.";
  }

  if (channel === "patient") {
    if (text.includes("fever") || text.includes("symptom") || text.includes("sick")) {
      return "If you have fever with breathing difficulty, severe weakness, chest pain, or confusion, contact the PHC immediately. For persistent fever, keep drinking fluids and continue the medication plan prescribed by your doctor.";
    }
    if (text.includes("appointment") || text.includes("visit") || text.includes("schedule")) {
      return "Your next visit should be planned around monitoring, medicine review, and test follow-up. If you feel worsening symptoms before the visit, call the clinic or ASHA worker without delay.";
    }
    if (text.includes("medicine") || text.includes("tablet") || text.includes("dose")) {
      return "Take medicines exactly as advised and complete the full course unless a doctor tells you otherwise. If you miss a dose, take it when remembered unless it is close to the next scheduled time.";
    }
    return "Please continue your advised care plan and report danger signs such as severe chest pain, bleeding, fainting, or high fever. Your ASHA worker and doctor can guide you quickly if symptoms worsen.";
  }

  if (text.includes("referral") || text.includes("transfer") || text.includes("hospital")) {
    return "Check the patient’s risk category, confirm the destination facility, and make sure the referral slip includes symptoms, vitals, ASHA worker details, and contact number. Follow-up with the family and update PHC records after transport.";
  }
  if (text.includes("danger") || text.includes("warning") || text.includes("emergency")) {
    return "Danger signs include severe breathlessness, bleeding, unconsciousness, persistent high fever, severe abdominal pain, or chest pain. Prioritize rapid transfer and alert the medical team immediately.";
  }
  if (text.includes("pregnancy") || text.includes("anc") || text.includes("delivery")) {
    return "For pregnancy follow-up, confirm gestational age, blood pressure, abdominal pain, bleeding or discharge, and fetal movement. Escalate to the doctor if symptoms are worsening or if the patient is in active labour.";
  }
  return "I can help with referral support, home-visit guidance, high-risk screening, and patient follow-up coordination. Please share the patient concern or village area and I’ll suggest the next action.";
};

const getAiMode = () => {
  const endpoint = import.meta.env.VITE_AI_API_URL as string | undefined;
  const key = import.meta.env.VITE_AI_API_KEY as string | undefined;
  return {
    endpoint: endpoint?.trim(),
    key: key?.trim(),
    model: (import.meta.env.VITE_AI_MODEL as string | undefined)?.trim() || "gpt-4o-mini",
    enabled: Boolean(endpoint && endpoint.trim()),
  };
};

export default function AIChatbot() {
  const [channel, setChannel] = useState<ChatChannel>("doctor");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<ChatChannel, Message[]>>({
    doctor: [
      {
        id: 1,
        sender: "ai",
        text: "Clinical AI here. I can help summarize a patient case, identify urgent triage priorities, and suggest referral coordination steps.",
        time: "09:14",
      },
    ],
    patient: [
      {
        id: 1,
        sender: "ai",
        text: "Care support is ready. Ask about symptoms, care instructions, appointments, or medication reminders.",
        time: "09:14",
      },
    ],
    asha: [
      {
        id: 1,
        sender: "ai",
        text: "Field support is active. I can help with risk alerts, home visit planning, and referral checklist guidance.",
        time: "09:14",
      },
    ],
  });

  const activeConfig = CHANNEL_CONFIG[channel];

  const summaryCards = useMemo(
    () => [
      {
        label: "Connected staff",
        value: "184",
        icon: Users,
        tone: "bg-blue-50 text-blue-700",
      },
      {
        label: "Active consults",
        value: "12",
        icon: MessageSquareText,
        tone: "bg-emerald-50 text-emerald-700",
      },
      {
        label: "Risk watchlist",
        value: "05",
        icon: ShieldCheck,
        tone: "bg-amber-50 text-amber-700",
      },
    ],
    []
  );

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      text: trimmed,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const currentMessages = messages[channel] ?? [];
    setMessages((prev) => ({
      ...prev,
      [channel]: [...(prev[channel] ?? []), userMessage],
    }));
    setInput("");
    setError(null);
    setIsLoading(true);

    try {
      const aiSettings = getAiMode();

      if (!aiSettings.enabled) {
        const fallback = buildAiReply(channel, trimmed);
        const aiMessage: Message = {
          id: Date.now() + 1,
          sender: "ai",
          text: fallback,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => ({
          ...prev,
          [channel]: [...(prev[channel] ?? []), aiMessage],
        }));
        return;
      }

      const response = await fetch(aiSettings.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(aiSettings.key ? { Authorization: `Bearer ${aiSettings.key}` } : {}),
        },
        body: JSON.stringify({
          model: aiSettings.model,
          temperature: 0.3,
          messages: [
            {
              role: "system",
              content: `You are a medical coordination assistant for a government primary health center. Help doctors, patients, and ASHA workers with evidence-based, non-diagnostic guidance. Keep responses concise, supportive, and actionable. Never replace medical professionals or provide emergency instructions beyond referral and urgent escalation guidance.`,
            },
            ...currentMessages.map((msg) => ({
              role: msg.sender === "user" ? "user" : "assistant",
              content: msg.text,
            })),
            { role: "user", content: trimmed },
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "AI service request failed.");
      }

      const data = await response.json();
      const reply = data?.choices?.[0]?.message?.content?.trim();
      const aiText = reply || "I’m here to help with your next clinical or care step.";

      const aiMessage: Message = {
        id: Date.now() + 2,
        sender: "ai",
        text: aiText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => ({
        ...prev,
        [channel]: [...(prev[channel] ?? []), aiMessage],
      }));
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unable to reach the AI service right now.";
      setError(message);
      setMessages((prev) => ({
        ...prev,
        [channel]: [
          ...(prev[channel] ?? []),
          {
            id: Date.now() + 3,
            sender: "ai",
            text: "The live AI service is unavailable, so I switched to the built-in guidance mode. Please check your AI endpoint configuration.",
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ],
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const onQuickAction = (text: string) => {
    setInput(text);
  };

  return (
    <div className="p-6 max-w-[1280px]">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-display font-semibold text-blue-700 mb-3">
            <BrainCircuit size={12} />
            AI Care Connect
          </div>
          <h1 className="font-display font-bold text-phc-text text-2xl leading-none">
            AI model chatbot
          </h1>
          <p className="text-phc-muted text-[13px] mt-1.5 font-sans">
            Shared communication layer for doctors, patients, and ASHA workers.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-phc-border bg-phc-surface px-3 py-2 text-[12px] text-phc-text">
          <CheckCircle2 size={14} className="text-green-600" />
          Live coordination enabled
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {summaryCards.map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="bg-phc-surface border border-phc-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className={`rounded-lg p-2 ${tone}`}>
                <Icon size={18} />
              </div>
              <span className="text-[11px] text-phc-muted font-sans">Today</span>
            </div>
            <div className="mt-4 text-3xl font-display font-bold text-phc-text">{value}</div>
            <div className="text-[12px] text-phc-muted font-sans">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[260px_1fr] gap-5">
        <aside className="bg-phc-surface border border-phc-border rounded-lg p-4">
          <div className="text-[10px] font-display font-semibold tracking-widest uppercase text-phc-muted mb-3">
            Communication channels
          </div>
          <div className="space-y-2">
            {Object.entries(CHANNEL_CONFIG).map(([key, cfg]) => {
              const selected = key === channel;
              return (
                <button
                  key={key}
                  onClick={() => setChannel(key as ChatChannel)}
                  className={`w-full text-left rounded-lg border p-3 transition-colors cursor-pointer ${
                    selected
                      ? "border-phc-blue bg-blue-50"
                      : "border-phc-border bg-white hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display font-semibold text-phc-text text-[13px]">{cfg.label}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${cfg.chip}`}>
                      Live
                    </span>
                  </div>
                  <div className="text-[11px] text-phc-muted mt-1.5">{cfg.summary}</div>
                </button>
              );
            })}
          </div>

          <div className="mt-5 rounded-lg bg-gradient-to-br from-slate-900 to-slate-700 p-3 text-white">
            <div className="flex items-center gap-2 mb-2">
              <CalendarClock size={14} />
              <span className="text-[11px] font-display font-semibold uppercase tracking-widest">Care sync</span>
            </div>
            <div className="text-[12px] text-slate-200">
              3 ASHA referrals and 2 consult follow-ups are pending acknowledgement.
            </div>
          </div>
        </aside>

        <div className="bg-phc-surface border border-phc-border rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-phc-border">
            <div className="flex items-center gap-3">
              <div className={`rounded-xl bg-gradient-to-br ${activeConfig.accent} p-2 text-white`}>
                {channel === "doctor" ? <Stethoscope size={16} /> : channel === "patient" ? <Bot size={16} /> : <Users size={16} />}
              </div>
              <div>
                <div className="font-display font-semibold text-phc-text text-[14px]">{activeConfig.label} assistant</div>
                <div className="text-[11px] text-phc-muted">{activeConfig.summary}</div>
              </div>
            </div>
            <div className="text-[11px] text-slate-500 font-sans">Secure patient communication</div>
          </div>

          <div className="p-4 border-b border-phc-border bg-slate-50">
            <div className="flex flex-wrap gap-2">
              {activeConfig.quickActions.map((action) => (
                <button
                  key={action}
                  onClick={() => onQuickAction(action)}
                  className="rounded-full border border-phc-border bg-white px-3 py-1.5 text-[11px] font-medium text-phc-text hover:bg-blue-50 hover:border-blue-200 cursor-pointer"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[420px] overflow-y-auto p-5 bg-white">
            <div className="space-y-4">
              {(messages[channel] ?? []).map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-[12.5px] leading-relaxed shadow-sm ${
                      msg.sender === "user"
                        ? "bg-phc-blue text-white rounded-br-md"
                        : "bg-slate-100 text-phc-text rounded-bl-md"
                    }`}
                  >
                    <div className="mb-1 text-[10px] opacity-75">{msg.sender === "user" ? "You" : activeConfig.label + " AI"}</div>
                    <div>{msg.text}</div>
                    <div className={`mt-1 text-[10px] ${msg.sender === "user" ? "text-blue-100" : "text-slate-500"}`}>
                      {msg.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="px-4 pb-2">
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[11px] text-red-700">
                {error}
              </div>
            </div>
          )}

          <div className="border-t border-phc-border p-4 bg-phc-surface">
            <div className="flex items-center gap-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={2}
                placeholder={activeConfig.prompt}
                className="flex-1 resize-none border border-phc-border rounded-xl px-3 py-2 text-[12.5px] text-phc-text bg-white focus:outline-none focus:ring-2 focus:ring-phc-blue/20 focus:border-phc-blue"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading}
                className="h-[62px] w-[62px] rounded-xl bg-phc-blue text-white flex items-center justify-center hover:bg-phc-blue-hover transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <SendHorizontal size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
