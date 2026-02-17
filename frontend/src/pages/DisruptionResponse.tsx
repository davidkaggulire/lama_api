import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Zap } from "lucide-react";
// import { scenarios, mockFullResponse } from "@/data/mockData";
import { EventSummaryStage } from "@/components/stages/EventSummaryStage";
import { ImpactStage } from "@/components/stages/ImpactStage";
import { CandidateStage } from "@/components/stages/CandidateStage";
import { ActionPlanStage } from "@/components/stages/ActionPlanStage";
import { DecisionStage } from "@/components/stages/DecisionStage";
import { ConfirmationStage } from "@/components/stages/ConfirmationStage";
import { StageLoader } from "@/components/stages/StageLoader";
import { toast } from "@/hooks/use-toast";

import { DisruptionResponse } from "@/types/disruption.js";
import {
  getAnalysisScenario,
  getScenarioById,
  ScenarioResponse,
} from "@/services/scenarioService.js";
// import type { DisruptionResponse } from "@/types/disruption";

const stageLabels = [
  "Event Summary",
  "Impact Assessment",
  "Candidate Shortlist",
  "Action Plan",
  "Manager Decision",
  "Confirmation",
];

export default function DisruptionResponsePage() {
  const { scenarioId } = useParams<{ scenarioId: string }>();
  const navigate = useNavigate();
  //   const scenario = scenarios.find((s) => s.id === scenarioId);

  const [scenario, setScenario] = useState<ScenarioResponse | null>(null);

  const [response, setResponse] = useState<DisruptionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [currentStage, setCurrentStage] = useState(0);

  // View response of employee / contractor
  useEffect(() => {
    // fetch a scenario by Id
    const fetchScenario = async () => {
      if (!scenarioId) return;

      try {
        setLoading(true);
        const data = await getScenarioById(scenarioId);
        setScenario(data);
      } catch (err: unknown) {
        // Check if it's a standard JS Error object
        if (err instanceof Error) {
          setError(err.message); // Works now! TypeScript knows 'err' has a message.
        } else {
          // Handle weird cases where something else was thrown
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchScenario();

    // getting response for scenario analysis
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await getAnalysisScenario(scenarioId);
        setResponse(data);
      } catch (err: unknown) {
        // Check if it's a standard JS Error object
        if (err instanceof Error) {
          setError(err.message); // Works now! TypeScript knows 'err' has a message.
        } else {
          // Handle weird cases where something else was thrown
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Reveal stages progressively
    const timers = [0, 800, 1600, 2400, 3200].map((delay, i) =>
      setTimeout(() => setCurrentStage(i + 1), delay),
    );

    return () => timers.forEach(clearTimeout);
  }, [scenarioId]);

  const handleDecision = useCallback(
    (action: "approve" | "edit" | "reject", notes?: string) => {
      if (action === "approve") {
        setCurrentStage(6);
        toast({
          title: "Plan Approved",
          description:
            "The assignment has been confirmed and notifications sent.",
        });
      } else if (action === "reject") {
        toast({
          title: "Plan Rejected",
          description: notes || "The proposed plan was rejected.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Edit Mode",
          description:
            "Edit functionality would allow modifying the plan before confirming.",
        });
      }
    },
    [],
  );

  if (!scenario) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-muted-foreground">Scenario not found.</p>
          <Button variant="outline" onClick={() => navigate("/")}>
            Go back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="container flex h-14 items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Zap className="h-5 w-5 text-primary" />
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-bold truncate">{scenario.title}</h1>
            <p className="text-xs text-muted-foreground">
              {scenario.customerSite}
            </p>
          </div>
          {/* Stage progress */}
          <div className="hidden sm:flex items-center gap-1">
            {stageLabels.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 w-6 rounded-full transition-colors duration-300 ${
                  i < currentStage ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Pipeline */}
      <main className="container py-6 max-w-3xl space-y-4">
        {/* Stage 1 */}
        {currentStage >= 1 && response?.eventSummary ? (
          <EventSummaryStage data={response.eventSummary} />
        ) : (
          <StageLoader stage={1} label={stageLabels[0]} />
        )}

        {/* Stage 2 */}
        {currentStage >= 2 && response?.impactAssessment ? (
          <ImpactStage data={response.impactAssessment} />
        ) : currentStage >= 1 ? (
          <StageLoader stage={2} label={stageLabels[1]} />
        ) : null}

        {/* Stage 3 */}
        {currentStage >= 3 && response?.candidates ? (
          <CandidateStage candidates={response.candidates} />
        ) : currentStage >= 2 ? (
          <StageLoader stage={3} label={stageLabels[2]} />
        ) : null}

        {/* Stage 4 */}
        {currentStage >= 4 && response?.actionPlan ? (
          <ActionPlanStage data={response.actionPlan} />
        ) : currentStage >= 3 ? (
          <StageLoader stage={4} label={stageLabels[3]} />
        ) : null}

        {/* Stage 5 — Decision */}
        {currentStage >= 5 && currentStage < 6 ? (
          <DecisionStage onDecision={handleDecision} />
        ) : currentStage >= 4 && currentStage < 6 ? (
          <StageLoader stage={5} label={stageLabels[4]} />
        ) : null}

        {/* Stage 6 — Confirmation */}
        {currentStage >= 6 && response?.confirmation ? (
          <ConfirmationStage data={response.confirmation} />
        ) : null}
      </main>
    </div>
  );
}
