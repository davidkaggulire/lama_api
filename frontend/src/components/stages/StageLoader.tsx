import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { motion } from "framer-motion";

export function StageLoader({ stage, label }: { stage: number; label: string }) {
    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card className="border-dashed border-border/60">
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-muted-foreground text-xs font-bold">
                            {stage}
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">{label}</span>
                        <div className="ml-auto flex items-center gap-1.5">
                            <div className="h-2 w-2 rounded-full bg-primary animate-pulse-dot" />
                            <span className="text-xs text-muted-foreground">Processing…</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-2/3" />
                </CardContent>
            </Card>
        </motion.div>
    );
}