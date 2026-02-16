import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UrgencyBadge, DisruptionTypeBadge } from "@/components/StatusBadges";
import { Clock, MapPin, User } from "lucide-react";
import type { DisruptionScenario } from "@/types/disruption";
import { motion } from "framer-motion";
import type { ScenarioResponse } from "@/services/scenarioService";


interface ScenarioCardProps {
    scenario: ScenarioResponse;
    onSelect: (scenario: ScenarioResponse) => void;
}

export function ScenarioCard({ scenario, onSelect }: ScenarioCardProps) {
    return (
        <motion.div
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15 }}
        >
            <Card
                className="cursor-pointer border-border/60 hover:border-primary/30 hover:shadow-md transition-all duration-200"
                onClick={() => onSelect(scenario)}
            >
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base font-semibold leading-tight">
                            {scenario.title}
                        </CardTitle>
                        <UrgencyBadge level={scenario.urgency} />
                    </div>
                    <DisruptionTypeBadge type={scenario.type} />
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5 shrink-0" />
                        <span>{scenario.employeeName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 shrink-0" />
                        <span>{scenario.startTime} - {scenario.endTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span>{scenario.customerSite}</span>
                    </div>
                    <p className="pt-1 text-xs leading-relaxed">{scenario.description}</p>
                </CardContent>
            </Card>
        </motion.div>
    );
}