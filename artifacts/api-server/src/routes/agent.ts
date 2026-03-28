import { Router, type IRouter } from "express";
import { RunAgentBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/agent/run", (req, res) => {
  const parsed = RunAgentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const { weekStart, weekEnd } = parsed.data;
  const weekLabel = weekStart && weekEnd
    ? `Week of ${weekStart} – ${weekEnd}`
    : "Week of Mar 23, 2026";

  res.json({
    weekLabel,
    executiveSummary: [
      { text: "Pipeline coverage remains strong at 3.2x quota, but 4 high-value deals totaling $2.1M are showing disengagement signals requiring immediate attention this week." },
      { text: "EMEA campaign performance is lagging 18% below target due to creative fatigue — recommend refreshing assets and reallocating $45K budget to top-performing LinkedIn channel." },
      { text: "Q2 forecast confidence is 78% at $8.4M against a $9.1M target; closing the 3 deals in late-stage negotiation would bring attainment to 92%." },
    ],
    priorityDeals: [
      {
        name: "Adobe — Enterprise Expansion",
        value: "$580,000",
        risk: "High",
        recommendedAction: "Executive sponsor outreach + custom ROI analysis by Wed",
      },
      {
        name: "Salesforce — Platform Integration",
        value: "$420,000",
        risk: "High",
        recommendedAction: "Address security review blockers; schedule technical deep-dive",
      },
      {
        name: "Microsoft — Co-Sell Partnership",
        value: "$310,000",
        risk: "Medium",
        recommendedAction: "Align on co-sell terms; get legal redline back by Fri",
      },
      {
        name: "Shopify — Growth Package",
        value: "$195,000",
        risk: "Medium",
        recommendedAction: "Send updated pricing proposal with volume discount tier",
      },
      {
        name: "Stripe — API Platform Deal",
        value: "$150,000",
        risk: "Low",
        recommendedAction: "Follow up on POC results; push for verbal commit this week",
      },
    ],
    campaignAdjustments: [
      {
        campaign: "EMEA Q2 Demand Gen",
        issue: "CTR dropped 22% over 3 weeks — creative fatigue detected",
        action: "Refresh ad creative; reallocate $45K to LinkedIn Sponsored Content",
      },
      {
        campaign: "NA Mid-Market Nurture",
        issue: "Open rates declining; 34% of leads stuck in 'Interest' stage for >30 days",
        action: "Trigger re-engagement sequence with case study asset + AE outreach",
      },
      {
        campaign: "APAC Product Launch",
        issue: "Webinar registrations at 41% of target",
        action: "Extend registration deadline by 1 week; add partner co-promotion",
      },
    ],
    actionItems: [
      {
        owner: "Sarah Chen (AE)",
        task: "Schedule executive sponsor call for Adobe Expansion deal",
        dueDate: "Mar 26, 2026",
      },
      {
        owner: "James Park (SE)",
        task: "Complete security questionnaire for Salesforce integration",
        dueDate: "Mar 27, 2026",
      },
      {
        owner: "Maria Lopez (Marketing)",
        task: "Launch refreshed EMEA creative assets in campaign manager",
        dueDate: "Mar 27, 2026",
      },
      {
        owner: "Tom Bradley (AE)",
        task: "Send revised pricing proposal to Shopify with volume tier",
        dueDate: "Mar 28, 2026",
      },
      {
        owner: "Rachel Kim (RevOps)",
        task: "Update Q2 forecast model with latest stage-weighted pipeline",
        dueDate: "Mar 28, 2026",
      },
    ],
  });
});

export default router;
