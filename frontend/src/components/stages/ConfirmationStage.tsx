import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Mail, MessageSquare } from "lucide-react";
import type { Confirmation } from "@/types/disruption";
import { motion } from "framer-motion";

export function ConfirmationStage({ data }: { data: Confirmation }) {
    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.5 }}>
            <Card className="border-success/30">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-success text-white text-xs font-bold">6</div>
                            <CardTitle className="text-lg">Confirmation</CardTitle>
                        </div>
                        <Badge className="bg-success/10 text-success border-success/20">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            {data.status === "success" ? "Resolved" : "Failed"}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="rounded-md bg-success/5 border border-success/15 p-3">
                        <p className="text-sm font-medium text-foreground">{data.updatedAssignment}</p>
                        <p className="text-xs text-muted-foreground mt-1">{data.summary}</p>
                    </div>

                    <div className="space-y-2">
                        <span className="text-sm font-medium text-foreground">Notifications Sent</span>
                        {data.notifications.map((n, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 + i * 0.1 }}
                                className="rounded-md border border-border/60 p-3 space-y-1"
                            >
                                <div className="flex items-center gap-2 text-xs">
                                    {n.type === "sms" ? (
                                        <MessageSquare className="h-3 w-3 text-info" />
                                    ) : (
                                        <Mail className="h-3 w-3 text-info" />
                                    )}
                                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{n.type.toUpperCase()}</Badge>
                                    <span className="text-muted-foreground">{n.recipient}</span>
                                </div>
                                {n.subject && <p className="text-xs font-medium">{n.subject}</p>}
                                <p className="text-xs text-muted-foreground leading-relaxed">{n.body}</p>
                            </motion.div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}