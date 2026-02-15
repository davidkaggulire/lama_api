import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, Pencil, X } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface DecisionStageProps {
    onDecision: (action: "approve" | "edit" | "reject", notes?: string) => void;
    isSubmitting?: boolean;
}

export function DecisionStage({ onDecision, isSubmitting }: DecisionStageProps) {
    const [notes, setNotes] = useState("");
    const [showNotes, setShowNotes] = useState(false);

    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.4 }}>
            <Card className="border-primary/20">
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">5</div>
                        <CardTitle className="text-lg">Manager Decision</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">Review the action plan and make your decision.</p>

                    {showNotes && (
                        <Textarea
                            placeholder="Add notes or reasoning for your decision..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="min-h-[80px]"
                        />
                    )}

                    {!showNotes && (
                        <button
                            onClick={() => setShowNotes(true)}
                            className="text-xs text-primary hover:underline"
                        >
                            + Add notes
                        </button>
                    )}

                    <div className="flex gap-3">
                        <Button
                            onClick={() => onDecision("approve", notes)}
                            disabled={isSubmitting}
                            className="flex-1 bg-success hover:bg-success/90 text-white"
                        >
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => onDecision("edit", notes)}
                            disabled={isSubmitting}
                            className="flex-1"
                        >
                            <Pencil className="h-4 w-4 mr-1" />
                            Edit
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => onDecision("reject", notes)}
                            disabled={isSubmitting}
                            className="flex-1"
                        >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}