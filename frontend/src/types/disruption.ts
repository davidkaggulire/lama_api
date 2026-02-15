export type UrgencyLevel = "high" | "medium" | "low";
export type DisruptionType = "sick" | "no-show" | "late";
export type ResponseStatus = "pending" | "in-progress" | "resolved" | "rejected";

export interface DisruptionScenario {
    id: string;
    title: string;
    type: DisruptionType;
    employeeName: string;
    shiftTime: string;
    customerSite: string;
    description: string;
    urgency: UrgencyLevel;
}

export interface EventSummary {
    employee: string;
    role: string;
    shift: string;
    site: string;
    time: string;
    type: DisruptionType;
    urgency: UrgencyLevel;
    details: string;
}

export interface ImpactAssessment {
    affectedShift: string;
    customerImpact: string;
    timeUrgency: string;
    riskLevel: UrgencyLevel;
    details: string;
}

export interface ReplacementCandidate {
    id: string;
    name: string;
    skillsMatch: number;
    region: string;
    availability: string;
    notes: string;
    risks: string;
    rank: number;
}

export interface ActionPlan {
    primaryCandidate: ReplacementCandidate;
    backupCandidate: ReplacementCandidate;
    primaryReasoning: string;
    backupReasoning: string;
    assignmentDetails: string;
}

export interface ManagerDecision {
    action: "approve" | "edit" | "reject";
    notes?: string;
    modifiedPlan?: ActionPlan;
}

export interface NotificationPreview {
    type: "sms" | "email";
    recipient: string;
    subject?: string;
    body: string;
}

export interface Confirmation {
    status: "success" | "failed";
    updatedAssignment: string;
    notifications: NotificationPreview[];
    summary: string;
}

export interface DisruptionResponse {
    id: string;
    scenarioId: string;
    status: ResponseStatus;
    timestamp: string;
    eventSummary?: EventSummary;
    impactAssessment?: ImpactAssessment;
    candidates?: ReplacementCandidate[];
    actionPlan?: ActionPlan;
    decision?: ManagerDecision;
    confirmation?: Confirmation;
    currentStage: number;
}

export interface HistoryItem {
    id: string;
    title: string;
    type: DisruptionType;
    status: ResponseStatus;
    timestamp: string;
    employeeName: string;
}
