import { Badge } from "@/components/ui/badge";
import type { UrgencyLevel, DisruptionType } from "@/services/scenarioService";


const urgencyConfig: Record<UrgencyLevel, { label: string; className: string }> = {
    high: { label: "High", className: "bg-urgency-high text-white border-transparent" },
    medium: { label: "Medium", className: "bg-urgency-medium text-white border-transparent" },
    low: { label: "Low", className: "bg-urgency-low text-white border-transparent" },
};

const typeConfig: Record<DisruptionType, { label: string; className: string }> = {
    sick: { label: "Sick Call", className: "bg-destructive/10 text-destructive border-destructive/20" },
    "no-show": { label: "No-Show", className: "bg-urgency-medium/10 text-urgency-medium border-urgency-medium/20" },
    late: { label: "Late Arrival", className: "bg-info/10 text-info border-info/20" },
};

export function UrgencyBadge({ level }: { level: UrgencyLevel }) {
    const config = urgencyConfig[level];
    return <Badge className={config.className}>{config.label}</Badge>;
}

export function DisruptionTypeBadge({ type }: { type: DisruptionType }) {
    const config = typeConfig[type];
    return <Badge className={config.className}>{config.label}</Badge>;
}

export function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        resolved: "bg-success/10 text-success border-success/20",
        pending: "bg-urgency-medium/10 text-urgency-medium border-urgency-medium/20",
        "in-progress": "bg-info/10 text-info border-info/20",
        rejected: "bg-destructive/10 text-destructive border-destructive/20",
    };
    return (
        <Badge className={styles[status] || ""}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
    );
}