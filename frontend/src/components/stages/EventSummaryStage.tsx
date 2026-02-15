import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UrgencyBadge } from "@/components/StatusBadges";
import { AlertTriangle, Clock, MapPin, User, Briefcase } from "lucide-react";
import type { EventSummary } from "@/types/disruption";
import { motion } from "framer-motion";

export function EventSummaryStage({ data }: { data: EventSummary }) {
    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">1</div>
                            <CardTitle className="text-lg">Event Summary</CardTitle>
                        </div>
                        <UrgencyBadge level={data.urgency} />
                    </div>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <User className="h-4 w-4" />
                            <div>
                                <span className="block text-xs text-muted-foreground">Employee</span>
                                <span className="text-foreground font-medium">{data.employee}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Briefcase className="h-4 w-4" />
                            <div>
                                <span className="block text-xs text-muted-foreground">Role</span>
                                <span className="text-foreground font-medium">{data.role}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <div>
                                <span className="block text-xs text-muted-foreground">Shift</span>
                                <span className="text-foreground font-medium">{data.shift}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <div>
                                <span className="block text-xs text-muted-foreground">Site</span>
                                <span className="text-foreground font-medium">{data.site}</span>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-md bg-muted/50 p-3 text-sm">
                        <div className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 mt-0.5 text-urgency-high" />
                            <p className="text-muted-foreground">{data.details}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}