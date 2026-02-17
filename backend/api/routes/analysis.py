from flask_restful import Resource
from datetime import datetime
from ..models import Scenario, Consultant, Region, Availability # Assuming these are your models
from api import api


class DisruptionAnalysisResource(Resource):
    def get(self, scenario_id):
        # 1. Fetch the real data from your DB
        scenario = Scenario.query.get_or_404(scenario_id)

        real_candidates = self._get_mock_candidates(scenario)

        # 2. Determine Reasoning and Candidates safely
        if not real_candidates:
            primary_candidate = None
            backup_candidate = None
            primary_reasoning = "No available consultants found in this region for the specified date."
        else:
            primary_candidate = real_candidates[0]
            # Use .get() or index check for backup to prevent index errors
            backup_candidate = real_candidates[1] if len(real_candidates) > 1 else None
            primary_reasoning = f"{primary_candidate['name']} is the strongest match at {primary_candidate['skillsMatch']}% fit. They have the required service certifications and are located in the {primary_candidate['region']} region."
        
        # 3. Build the nested response
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
            
            "candidates": real_candidates, 
            
            "actionPlan": {
                # Logic to pick the top candidate from the list
                "primaryCandidate": primary_candidate,
                "backupCandidate": backup_candidate,
                "primaryReasoning": primary_reasoning,
                "backupReasoning": "Secondary available candidate within the pool." if backup_candidate else "No backup available.",
                "assignmentDetails": f"Assign to {scenario.customer.customer_name} shift at {scenario.start_time.strftime('%H:%M')}."
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

    
    def _get_mock_candidates(self, scenario):
        # 1. Get the target region from the customer
        target_region_code = scenario.customer.region_code

        # 2. Build the query with filters
        query = Consultant.query
        
        # Filter by Region (Join with the junction table and filter)
        if target_region_code:
            query = query.join(Consultant.regions).filter(Region.region_code == target_region_code)
        
        # Filter by Availability (Check if they have a 'Ready' record for this scenario's date)
        # Note: This assumes scenario has a 'date' or you use the 'created_at' date
        scenario_date = scenario.created_at.date() if scenario.created_at else datetime.utcnow().date()
        
        query = query.join(Consultant.availability).filter(
            Availability.date == scenario_date,
            Availability.status.ilike('available') # or 'Ready'
        )

        all_consultants = query.all()
        
        candidates = []
        for consultant in all_consultants:
            # Logic to calculate Match Score (Placeholder logic)
            # compare consultant.skills vs scenario.required_skills

            skills_match = self._calculate_match(consultant, scenario)
            
            # 1. Extract the descriptions of all services linked to this consultant
            # This uses the 'services' relationship defined in your Consultant model
            service_list = [s.description for s in consultant.services if s.description]
            
            # 2. Join them into a readable string, or use a fallback
            specialties = ", ".join(service_list) if service_list else "general consulting"
            
            candidates.append({
                "id": f"c-{consultant.consultant_id}",
                "name": f"{consultant.first_name} {consultant.last_name}",
                "skillsMatch": skills_match,
                "region": getattr(consultant, 'region', 'N/A'),
                "availability": "Available", 
                # 3. Use the specialties string in your notes
                "notes": f"Specializes in {specialties} ({consultant.employment_type}).",
                "risks": "None identified",
                "rank": 0 
            })

        # 3. Sort by skillsMatch descending and assign ranks
        candidates.sort(key=lambda x: x['skillsMatch'], reverse=True)
        
        for index, candidate in enumerate(candidates):
            candidate['rank'] = index + 1

        return candidates[:3]  # Return top 3 matches


    def _calculate_match(self, consultant, scenario):
        # base score is 70
        score = 70

        # Get all service descriptions for this consultant
        # consultant.services is available because of your relationship definition
        service_descriptions = [s.description.lower() for s in consultant.services if s.description]
        
        if scenario.type:
            scenario_type = scenario.type.lower()
            
            # If the scenario type (e.g., 'sick') matches a service or 
            # if the scenario title mentions a service they have
            for service_text in service_descriptions:
                if service_text in scenario_type or service_text in scenario.title.lower():
                    score += 25
                    break # Found a match, stop looking
                    
        return min(score, 100)


api.add_resource(DisruptionAnalysisResource, '/api/v1/analysis/<string:scenario_id>')