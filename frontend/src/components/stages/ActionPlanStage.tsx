import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Shield, Brain } from "lucide-react";
import type { ActionPlan } from "@/types/disruption";
import { motion } from "framer-motion";

export function ActionPlanStage({ data }: { data: ActionPlan }) {
    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }}>
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">4</div>
                        <CardTitle className="text-lg">Action Plan</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Primary */}
                    <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-2">
                        <div className="flex items-center gap-2">
                            <Target className="h-4 w-4 text-primary" />
                            <span className="font-semibold text-sm">Primary — {data.primaryCandidate.name}</span>
                            <Badge className="ml-auto bg-primary text-primary-foreground border-transparent">{data.primaryCandidate.skillsMatch}% match</Badge>
                        </div>
                        <div className="flex items-start gap-2 text-xs text-muted-foreground">
                            <Brain className="h-3 w-3 mt-0.5 shrink-0" />
                            <p>{data.primaryReasoning}</p>
                        </div>
                    </div>

                    {/* Backup */}
                    <div className="rounded-lg border border-border/60 bg-muted/30 p-4 space-y-2">
                        <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-muted-foreground" />
                            <span className="font-semibold text-sm">Backup — {data.backupCandidate.name}</span>
                            <Badge variant="secondary" className="ml-auto">{data.backupCandidate.skillsMatch}% match</Badge>
                        </div>
                        <div className="flex items-start gap-2 text-xs text-muted-foreground">
                            <Brain className="h-3 w-3 mt-0.5 shrink-0" />
                            <p>{data.backupReasoning}</p>
                        </div>
                    </div>

                    <div className="rounded-md bg-muted/50 p-3 text-sm text-muted-foreground">
                        <span className="font-medium text-foreground block mb-1">Assignment Details</span>
                        {data.assignmentDetails}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}