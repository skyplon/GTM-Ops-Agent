import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, Loader2, CheckCircle2, CircleDashed, Sparkles, 
  AlertTriangle, ArrowRight, Download, Mail, Calendar, 
  Target, TrendingUp, Users, Activity, BarChart4, ChevronDown
} from "lucide-react";
import { useRunAgent } from "@workspace/api-client-react";
import type { AgentRunResponse } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const SOURCES = [
  "Pipeline Report", 
  "Campaign Performance", 
  "Account Activity Log", 
  "Forecast vs Actuals"
];

const STEPS = [
  "Pulling pipeline data from CRM...",
  "Analyzing deals at risk...",
  "Reviewing campaign performance vs targets...",
  "Cross-referencing account activity signals...",
  "Generating prioritization recommendations...",
  "Drafting GTM plan document..."
];

const WEEK_OPTIONS = [
  { label: "Mar 23 – Mar 28, 2026", start: "2026-03-23", end: "2026-03-28" },
  { label: "Mar 16 – Mar 21, 2026", start: "2026-03-16", end: "2026-03-21" },
  { label: "Mar 9 – Mar 14, 2026",  start: "2026-03-09", end: "2026-03-14" },
  { label: "Mar 2 – Mar 7, 2026",   start: "2026-03-02", end: "2026-03-07" },
];

const FALLBACK_MOCK_DATA: AgentRunResponse = {
  weekLabel: "Week of Mar 23, 2026",
  executiveSummary: [
    { text: "Pipeline coverage is healthy at 3.2x, but Q2 shortfall risk remains in the Enterprise segment." },
    { text: "EMEA region outperformed last week with 4 key expansions moving to negotiation stage." },
    { text: "SaaS migration campaign is underperforming by 15%; recommending immediate pivot to targeted ABM." }
  ],
  priorityDeals: [
    { name: "TechCorp Global Expansion", value: "$2.4M", risk: "High", recommendedAction: "Exec sponsor alignment needed by Thursday." },
    { name: "GlobalRetail Cloud Migration", value: "$1.8M", risk: "Medium", recommendedAction: "Provide competitive discounting on year 1." },
    { name: "FinanceHub Platform", value: "$950K", risk: "Low", recommendedAction: "Send final MSA for signature." },
    { name: "Logistics Pro Setup", value: "$820K", risk: "High", recommendedAction: "Security review stalled; engage technical sales." },
    { name: "MediaStream API", value: "$600K", risk: "Low", recommendedAction: "On track for Friday closure." }
  ],
  campaignAdjustments: [
    { campaign: "Q2 SaaS Migration", issue: "Click-through rate down 15%", action: "Pivot spend to targeted LinkedIn ABM for top 50 accounts." },
    { campaign: "Enterprise Renewals", issue: "Low engagement from technical buyers", action: "Launch developer-focused webinar series." }
  ],
  actionItems: [
    { owner: "Sarah Jenkins", task: "Schedule tech sync for Logistics Pro", dueDate: "Mar 25" },
    { owner: "David Chen", task: "Approve TechCorp discounting tier", dueDate: "Mar 24" },
    { owner: "Marketing Ops", task: "Reallocate $15k to LinkedIn ABM", dueDate: "Mar 26" },
    { owner: "Elena Ross", task: "Draft Enterprise webinar content", dueDate: "Mar 27" },
    { owner: "Legal Team", task: "Finalize FinanceHub MSA", dueDate: "Mar 24" }
  ]
};

function CustomCheckbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (c: boolean) => void }) {
  return (
    <div 
      className="flex items-center space-x-3 cursor-pointer group p-3 rounded-xl hover:bg-white/5 transition-colors duration-200 border border-transparent hover:border-white/10"
      onClick={() => onChange(!checked)}
      data-testid={`checkbox-${label.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className={cn(
        "w-5 h-5 flex items-center justify-center rounded-[6px] border-2 transition-all duration-200", 
        checked ? "bg-accent border-accent text-white shadow-lg shadow-accent/40" : "border-white/30 bg-black/20 group-hover:border-white/50"
      )}>
        {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
      </div>
      <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{label}</span>
    </div>
  );
}

function RiskBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    High: "bg-red-100 text-red-700 border-red-200 shadow-red-500/10",
    Medium: "bg-amber-100 text-amber-700 border-amber-200 shadow-amber-500/10",
    Low: "bg-green-100 text-green-700 border-green-200 shadow-green-500/10"
  };
  const colorClass = colors[level] ?? "bg-slate-100 text-slate-700 border-slate-200";
  return (
    <span className={cn("px-3 py-1 rounded-full text-xs font-bold border shadow-sm", colorClass)}>
      {level}
    </span>
  );
}

export default function Home() {
  const [status, setStatus] = useState<"idle" | "running" | "complete">("complete");
  const [completedSteps, setCompletedSteps] = useState<number[]>([1, 2, 3, 4, 5, 6]);
  const [currentStep, setCurrentStep] = useState<number>(7);
  const [dataSources, setDataSources] = useState<string[]>(SOURCES);
  const [outputData, setOutputData] = useState<AgentRunResponse>(FALLBACK_MOCK_DATA);
  const [selectedWeek, setSelectedWeek] = useState(WEEK_OPTIONS[0]);
  const [weekDropdownOpen, setWeekDropdownOpen] = useState(false);

  const { mutateAsync } = useRunAgent();

  const toggleSource = (source: string) => {
    setDataSources(prev => prev.includes(source) ? prev.filter(s => s !== source) : [...prev, source]);
  };

  const handleRun = async () => {
    if (status === "running") return;
    setStatus("running");
    setCompletedSteps([]);
    setCurrentStep(1);

    const apiPromise = mutateAsync({ 
      data: { 
        dataSources, 
        weekStart: selectedWeek.start, 
        weekEnd: selectedWeek.end 
      } 
    }).catch((err: unknown) => {
      console.warn("API Error (using fallback):", err);
      return FALLBACK_MOCK_DATA;
    });

    for (let i = 1; i <= 6; i++) {
      setCurrentStep(i);
      await new Promise<void>(r => setTimeout(r, 900));
      setCompletedSteps(prev => [...prev, i]);
    }
    setCurrentStep(7);

    const result = await apiPromise;
    
    if (result === FALLBACK_MOCK_DATA) {
      toast({ 
        title: "Simulation Complete", 
        description: "Showing simulated output data.", 
        variant: "default" 
      });
    }

    setOutputData(result);
    setStatus("complete");
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        
        {/* SECTION 1: AGENT CONTROL PANEL */}
        <section className="bg-primary text-white rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden border border-white/10">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/20 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-400/10 blur-[80px] rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />

          <div className="relative z-10 flex flex-col gap-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <Target className="w-8 h-8 text-accent shrink-0" />
                  <span className="text-primary-foreground/60 text-sm font-bold uppercase tracking-widest">OpsAgent</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-1">
                  Run Weekly GTM Plan
                </h1>
                <p className="text-primary-foreground/60 text-base font-medium tracking-wide">GTM Planning Automation</p>
              </div>

              {/* Date Range Picker */}
              <div className="relative">
                <button
                  data-testid="week-picker"
                  onClick={() => setWeekDropdownOpen(o => !o)}
                  className="flex items-center gap-3 bg-white/10 hover:bg-white/15 py-3 px-5 rounded-2xl backdrop-blur-md border border-white/20 shadow-inner transition-colors cursor-pointer"
                >
                  <Calendar className="w-5 h-5 text-accent shrink-0" />
                  <span className="font-semibold text-sm md:text-base tracking-wide text-primary-foreground/90 whitespace-nowrap">
                    {selectedWeek.label}
                  </span>
                  <ChevronDown className={cn("w-4 h-4 text-primary-foreground/60 transition-transform", weekDropdownOpen && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {weekDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl shadow-black/20 border border-slate-200 z-50 overflow-hidden"
                    >
                      {WEEK_OPTIONS.map(option => (
                        <button
                          key={option.start}
                          data-testid={`week-option-${option.start}`}
                          onClick={() => { setSelectedWeek(option); setWeekDropdownOpen(false); }}
                          className={cn(
                            "w-full text-left px-5 py-3.5 text-sm font-medium transition-colors flex items-center gap-3",
                            option.start === selectedWeek.start 
                              ? "bg-primary/5 text-primary font-bold" 
                              : "text-slate-700 hover:bg-slate-50"
                          )}
                        >
                          <Calendar className="w-4 h-4 shrink-0 text-accent" />
                          {option.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="h-px w-full bg-gradient-to-r from-white/20 via-white/10 to-transparent" />

            <div>
              <h3 className="text-xs font-bold text-primary-foreground/50 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Select Data Sources
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {SOURCES.map(source => (
                  <CustomCheckbox 
                    key={source} 
                    label={source} 
                    checked={dataSources.includes(source)} 
                    onChange={() => toggleSource(source)} 
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 mt-4">
              <button
                onClick={handleRun}
                disabled={status === "running"}
                data-testid="run-agent-button"
                className="w-full sm:w-auto h-16 px-10 rounded-2xl bg-white text-primary hover:bg-slate-50 font-bold text-lg shadow-xl shadow-black/20 hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 active:shadow-md transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-xl group"
              >
                <Sparkles className={cn("w-6 h-6 text-accent group-hover:scale-110 transition-transform", status === "running" && "animate-pulse")} />
                {status === "running" ? "Agent is reasoning..." : "Run Weekly GTM Plan"}
              </button>

              <div
                data-testid="agent-status-badge"
                className={cn(
                  "px-5 py-2.5 rounded-full text-sm font-bold border flex items-center gap-2.5 shadow-sm transition-all duration-300",
                  status === "idle" ? "bg-white/10 border-white/20 text-white/80" :
                  status === "running" ? "bg-amber-500/20 border-amber-500/50 text-amber-300 animate-pulse" :
                  "bg-green-500/20 border-green-500/50 text-green-400"
                )}
              >
                {status === "idle" && <CircleDashed className="w-4 h-4" />}
                {status === "running" && <Loader2 className="w-4 h-4 animate-spin" />}
                {status === "complete" && <CheckCircle2 className="w-4 h-4" />}
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: AGENT REASONING STEPS */}
        <AnimatePresence>
          {status !== "idle" && (
            <motion.section 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-200 relative overflow-hidden"
            >
              <h2 className="text-2xl font-display font-bold text-foreground mb-8 flex items-center gap-3">
                <Loader2 className={cn("w-6 h-6 text-accent", status === "running" && "animate-spin")} />
                Agent Reasoning Steps
              </h2>
              
              <div data-testid="reasoning-steps" className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                {STEPS.map((step, index) => {
                  const stepNum = index + 1;
                  const isComplete = completedSteps.includes(stepNum);
                  const isActive = currentStep === stepNum && status === "running";
                  const isPending = !isComplete && !isActive;

                  return (
                    <motion.div 
                      key={stepNum} 
                      data-testid={`step-${stepNum}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: isPending ? 0.3 : 1, x: 0 }}
                      transition={{ duration: 0.4 }}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-2xl transition-all duration-500", 
                        isActive ? "bg-amber-50 border border-amber-100 shadow-inner" : "bg-transparent border border-transparent"
                      )}
                    >
                      <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-white shadow-sm border border-slate-100">
                        {isComplete ? (
                          <CheckCircle2 className="w-6 h-6 text-green-500" />
                        ) : isActive ? (
                          <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
                        ) : (
                          <span className="text-sm font-bold text-slate-300">{stepNum}</span>
                        )}
                      </div>
                      <span className={cn(
                        "text-base font-semibold", 
                        isActive ? "text-amber-800" : isComplete ? "text-slate-800" : "text-slate-400"
                      )}>
                        {step}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* SECTION 3: AGENT OUTPUT */}
        <AnimatePresence>
          {status === "complete" && (
            <motion.section 
              data-testid="output-section"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-200 flex flex-col gap-10"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
                <div>
                  <h2 className="text-3xl font-display font-bold text-foreground">Weekly GTM Plan</h2>
                  <p className="text-muted-foreground font-medium mt-1">{outputData.weekLabel}</p>
                </div>
              </div>

              {/* Exec Summary */}
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <BarChart4 className="w-5 h-5 text-accent" />
                  Executive Summary
                </h3>
                <ul className="space-y-3">
                  {outputData.executiveSummary.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-700 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                      <span className="leading-relaxed">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Priority Deals Table */}
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  Top 5 Priority Deals
                </h3>
                <div className="overflow-x-auto rounded-2xl border border-border shadow-sm">
                  <table className="w-full text-sm text-left whitespace-nowrap">
                    <thead className="bg-slate-50 border-b border-border text-slate-600">
                      <tr>
                        <th className="px-6 py-4 font-bold">Deal Name</th>
                        <th className="px-6 py-4 font-bold">Pipeline Value</th>
                        <th className="px-6 py-4 font-bold">Risk Level</th>
                        <th className="px-6 py-4 font-bold">Recommended Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {outputData.priorityDeals.map((deal, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-900">{deal.name}</td>
                          <td className="px-6 py-4 font-semibold text-slate-700">{deal.value}</td>
                          <td className="px-6 py-4"><RiskBadge level={deal.risk} /></td>
                          <td className="px-6 py-4 text-slate-600">{deal.recommendedAction}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Campaign Adjustments */}
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-accent" />
                  Campaign Adjustments Recommended
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {outputData.campaignAdjustments.map((campaign, idx) => (
                    <div key={idx} className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3">
                      <h4 className="font-bold text-slate-900 text-lg">{campaign.campaign}</h4>
                      <div className="text-sm text-red-600 font-semibold flex items-start gap-2 bg-red-50 p-3 rounded-lg border border-red-100">
                        <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                        {campaign.issue}
                      </div>
                      <div className="text-sm text-slate-700 font-medium flex items-start gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <ArrowRight className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                        {campaign.action}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions for this week */}
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-accent" />
                  Actions for This Week
                </h3>
                <div className="overflow-x-auto rounded-2xl border border-border shadow-sm">
                  <table className="w-full text-sm text-left whitespace-nowrap">
                    <thead className="bg-slate-50 border-b border-border text-slate-600">
                      <tr>
                        <th className="px-6 py-4 font-bold">Owner</th>
                        <th className="px-6 py-4 font-bold">Task</th>
                        <th className="px-6 py-4 font-bold text-right">Due Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {outputData.actionItems.map((item, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-900">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                                {item.owner.split(" ").map((n: string) => n[0]).join("")}
                              </div>
                              {item.owner}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-700 font-medium">{item.task}</td>
                          <td className="px-6 py-4 text-right">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs">
                              <Calendar className="w-3.5 h-3.5" />
                              {item.dueDate}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bottom Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-border">
                <button
                  data-testid="export-plan-button"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-semibold transition-colors shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  Export Plan
                </button>
                <button
                  data-testid="send-to-team-button"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-semibold transition-colors shadow-sm"
                >
                  <Mail className="w-4 h-4" />
                  Send to Team
                </button>
                <button
                  data-testid="schedule-next-run-button"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-semibold shadow-md transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  Schedule Next Run
                </button>
              </div>

            </motion.section>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
