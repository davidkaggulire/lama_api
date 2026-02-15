import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Star, AlertTriangle } from "lucide-react";
import type { ReplacementCandidate } from "@/types/disruption";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

function CandidateCard({ candidate, index }: { candidate: ReplacementCandidate; index: number }) {
    const matchColor = candidate.skillsMatch >= 90 ? "text-success" : candidate.skillsMatch >= 80 ? "text-urgency-medium" : "text-muted-foreground";

    return (
        <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: index * 0.1 }}
        >
            <Card className={`${candidate.rank === 1 ? "border-primary/30 shadow-sm" : "border-border/60"}`}>
                <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                                #{candidate.rank}
                            </div>
                            <span className="font-semibold text-foreground">{candidate.name}</span>
                        </div>
                        <span className={`text-sm font-bold ${matchColor}`}>{candidate.skillsMatch}%</span>
                    </div>
                    <Progress value={candidate.skillsMatch} className="h-1.5" />
                    <div className="flex gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1"><MapPin className="h-3 w-3" />{candidate.region}</div>
                        <div className="flex items-center gap-1"><Clock className="h-3 w-3" />{candidate.availability}</div>
                    </div>
                    <div className="flex items-start gap-1.5 text-xs">
                        <Star className="h-3 w-3 mt-0.5 text-info shrink-0" />
                        <span className="text-muted-foreground">{candidate.notes}</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-xs">
                        <AlertTriangle className="h-3 w-3 mt-0.5 text-urgency-medium shrink-0" />
                        <span className="text-muted-foreground">{candidate.risks}</span>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

export function CandidateStage({ candidates }: { candidates: ReplacementCandidate[] }) {
    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">3</div>
                        <CardTitle className="text-lg">Candidate Shortlist</CardTitle>
                        <Badge variant="secondary" className="ml-auto">{candidates.length} candidates</Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3">
                    {candidates.map((c, i) => (
                        <CandidateCard key={c.id} candidate={c} index={i} />
                    ))}
                </CardContent>
            </Card>
        </motion.div>
    );
}