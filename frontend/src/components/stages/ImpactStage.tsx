import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UrgencyBadge } from "@/components/StatusBadges";
import { ShieldAlert, TrendingUp, Timer } from "lucide-react";
import type { ImpactAssessment } from "@/types/disruption";
import { motion } from "framer-motion";

export function ImpactStage({ data }: { data: ImpactAssessment }) {
    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">2</div>
                            <CardTitle className="text-lg">Impact Assessment</CardTitle>
                        </div>
                        <UrgencyBadge level={data.riskLevel} />
                    </div>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                            <ShieldAlert className="h-4 w-4 mt-0.5 text-destructive shrink-0" />
                            <div>
                                <span className="block text-xs text-muted-foreground">Affected Shift</span>
                                <span className="text-foreground">{data.affectedShift}</span>
                            </div>
                        </div>
                        <div className="flex items-start gap-2">
                            <TrendingUp className="h-4 w-4 mt-0.5 text-urgency-medium shrink-0" />
                            <div>
                                <span className="block text-xs text-muted-foreground">Customer Impact</span>
                                <span className="text-foreground">{data.customerImpact}</span>
                            </div>
                        </div>
                        <div className="flex items-start gap-2">
                            <Timer className="h-4 w-4 mt-0.5 text-info shrink-0" />
                            <div>
                                <span className="block text-xs text-muted-foreground">Time Urgency</span>
                                <span className="text-foreground">{data.timeUrgency}</span>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-md bg-destructive/5 border border-destructive/10 p-3 text-sm text-muted-foreground">
                        {data.details}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}