import { DisruptionResponse } from "@/types/disruption";

// src/services/scenarioService.ts
export type UrgencyLevel = "high" | "medium" | "low";
export type DisruptionType = "sick" | "no-show" | "late";
export type ResponseStatus = "pending" | "in-progress" | "resolved" | "rejected";

// Define the shape of the data we send to the backend
export interface ScenarioPayload {
    title: string;
    type: string;
    consultant_id: string;
    customer_id: string;
    startTime: string; // "HH:mm"
    endTime: string;   // "HH:mm"
    description?: string;
}

export interface ScenarioResponse {
    id: string;            // The 'sc-X' generated ID
    title: string;
    type: DisruptionType;
    employeeName: string;  // Joined from consultants table
    customerSite: string;  // Joined from customers table
    startTime: string;
    endTime: string;
    description: string;
    urgency: UrgencyLevel; // Calculated from risk_profile
    createdAt: string;     // ISO format string
}


const API_BASE_URL = 'http://127.0.0.1:5000/api/v1'; // This works because of Vite proxy or relative paths

export const createScenario = async (payload: ScenarioPayload) => {
    try {
        const response = await fetch(`${API_BASE_URL}/scenarios`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            // Try to get error message from Flask-RESTful
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create scenario');
        }

        return await response.json();
    } catch (error) {
        console.error("Service Error:", error);
        throw error;
    }
};

// export const getScenarios = async () => {
//     // const response = await fetch(`${API_BASE_URL}/scenarios`);
//     // if (!response.ok) throw new Error('Failed to fetch scenarios');
//     // return await response.json();
//     try {
//         const response = await fetch(`${API_BASE_URL}/scenarios`);
//         console.log("Fetch Scenarios Response:", response);
//         if (!response.ok) {
//             throw new Error('Failed to fetch scenarios');
//         }
        
//         return await response.json();
//     } catch (error) {
//         console.error("Fetch Service Error:", error);
//         throw error;
//     }
// };

export const getScenarios = async (): Promise<ScenarioResponse[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/scenarios`);
        console.log("Fetch Scenarios Response:", response);
        if (!response.ok) {
            throw new Error('Failed to fetch scenarios');
        }
        
        return await response.json();
    } catch (error) {
        console.error("Fetch Service Error:", error);
        throw error;
    }
};

// fetch a single scenario
export const getScenarioById = async(id:string): Promise<ScenarioResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/scenarios/${id}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch scenarios ${id}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error("Fetch Service Error:", error);
        throw error;
    }
}

// perform analysis for scenario - required by manager
export const getAnalysisScenario = async (id: string): Promise<DisruptionResponse> => {
    const response = await fetch(`/api/v1/analysis/${id}`);
    if (!response.ok) throw new Error("Analysis failed");
    return response.json();
}

