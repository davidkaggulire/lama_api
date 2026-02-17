from flask_restful import Resource
from datetime import datetime
from ..models import Scenario, Consultant # Assuming these are your models
from api import api


class DisruptionAnalysisResource(Resource):
    def get(self, scenario_id):
        # 1. Fetch the real data from your DB
        scenario = Scenario.query.get_or_404(scenario_id)
        
        # 2. Build the nested response
        response = {
            "id": f"resp-{scenario.scenario_id}",
            "scenarioId": scenario.scenario_id,
            "status": "in-progress",
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "currentStage": 1,
            
            # Use data from your Scenario and Consultant models
            "eventSummary": {
                "employee": f"{scenario.consultant.first_name} {scenario.consultant.last_name}",
                "role": scenario.consultant.employment_type or "Consultant",
                "shift": f"{scenario.start_time.strftime('%H:%M')} – {scenario.end_time.strftime('%H:%M')}",
                "site": scenario.customer.customer_name,
                "time": f"Reported at {scenario.created_at.strftime('%I:%M %p')}",
                "type": scenario.type.lower(),
                "urgency": scenario.urgency.lower(),
                "details": scenario.description,
            },

            # This part is usually logic-driven or AI-generated
            "impactAssessment": self._generate_impact(scenario),
            
            "candidates": self._get_mock_candidates(), # You could fetch real consultants here
            
            "actionPlan": {
                # Logic to pick the top candidate from the list
                "primaryCandidate": self._get_mock_candidates()[0],
                "backupCandidate": self._get_mock_candidates()[1],
                "primaryReasoning": "Strongest match based on historical performance.",
                "assignmentDetails": f"Assign to {scenario.customer.customer_name} shift."
            },
            
            "confirmation": {
                "status": "success",
                "summary": "Disruption resolved. Stakeholders notified."
            }
        }
        
        return response, 200

    def _generate_impact(self, scenario):
        # Example of simple conditional logic
        risk = "high" if scenario.urgency == "HIGH" else "medium"
        return {
            "affectedShift": "Current Shift",
            "customerImpact": f"Service delivery at {scenario.customer.customer_name}",
            "riskLevel": risk,
            "details": "Automated risk assessment based on client SLA."
        }

    def _get_mock_candidates(self):
        # In a real app, you'd query your 'Consultant' table for available people
        return [
            {"id": "c-1", "name": "Alex Rivera", "skillsMatch": 94, "rank": 1},
            {"id": "c-2", "name": "Kim Nguyen", "skillsMatch": 87, "rank": 2}
        ]
    
api.add_resource(DisruptionAnalysisResource, '/api/v1/analysis/<string:scenario_id>')