import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ScenarioCard } from "@/components/ScenarioCard";
import { HistorySidebar } from "@/components/HistorySidebar";
import { scenarios, historyItems } from "@/data/mockData";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { History, Zap } from "lucide-react";
import type { DisruptionScenario } from "@/types/disruption";

const Index = () => {
    const navigate = useNavigate();
    const [historyOpen, setHistoryOpen] = useState(false);

    const handleSelectScenario = useCallback(
        (scenario: DisruptionScenario) => {
            navigate(`/response/${scenario.id}`);
        },
        [navigate],
    );

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-30">
                <div className="container flex h-14 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-primary" />
                        <h1 className="text-lg font-bold tracking-tight">Disruption Response</h1>
                    </div>
                    <Sheet open={historyOpen} onOpenChange={setHistoryOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="sm">
                                <History className="h-4 w-4 mr-1.5" />
                                History
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="p-0 w-80">
                            <SheetTitle className="sr-only">Response History</SheetTitle>
                            <HistorySidebar items={historyItems} />
                        </SheetContent>
                    </Sheet>
                </div>
            </header>

            {/* Main */}
            <main className="container py-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold tracking-tight">Scenario Launcher</h2>
                    <p className="text-muted-foreground mt-1">
                        Select a disruption scenario to trigger the response workflow.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
                    {scenarios.map((s) => (
                        <ScenarioCard key={s.id} scenario={s} onSelect={handleSelectScenario} />
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Index;