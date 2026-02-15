import { ScrollArea } from "@/components/ui/scroll-area";
import { StatusBadge, DisruptionTypeBadge } from "@/components/StatusBadges";
import { Clock, ChevronRight } from "lucide-react";
import type { HistoryItem } from "@/types/disruption";
import { format } from "date-fns";

interface HistorySidebarProps {
    items: HistoryItem[];
    onSelect?: (item: HistoryItem) => void;
}

export function HistorySidebar({ items, onSelect }: HistorySidebarProps) {
    return (
        <div className="flex h-full flex-col">
            <div className="p-4 border-b">
                <h2 className="text-sm font-semibold text-foreground">History</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Past disruption responses</p>
            </div>
            <ScrollArea className="flex-1">
                <div className="space-y-1 p-2">
                    {items.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onSelect?.(item)}
                            className="w-full rounded-lg p-3 text-left hover:bg-accent transition-colors group"
                        >
                            <div className="flex items-start justify-between gap-2">
                                <span className="text-sm font-medium text-foreground leading-tight">{item.title}</span>
                                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-0.5" />
                            </div>
                            <div className="flex items-center gap-2 mt-1.5">
                                <DisruptionTypeBadge type={item.type} />
                                <StatusBadge status={item.status} />
                            </div>
                            <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span>{format(new Date(item.timestamp), "MMM d, HH:mm")}</span>
                                <span className="ml-1">— {item.employeeName}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}