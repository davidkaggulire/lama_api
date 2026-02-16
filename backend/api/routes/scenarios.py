from flask import request
from flask_restful import Resource
from datetime import datetime
from api import api, db
from ..models import Scenario# Assuming your models are in models.py

class ScenarioResource(Resource):
    def get(self):
        """Returns all scenarios in the format your React app expects."""
        scenarios = Scenario.query.all()
        # Uses the to_dict() method we created in the model
        return [s.to_dict() for s in scenarios], 200

    def post(self):
        """Creates a new scenario from the JSON sent by React."""
        data = request.get_json()
        
        try:
            # Note: scenario_id is NOT passed here because DB handles 'sc-' prefixing
            new_scenario = Scenario(
                title=data.get('title'),
                type=data.get('type'),
                consultant_id=data.get('consultant_id'), # Foreign Key
                customer_id=data.get('customer_id'),     # Foreign Key
                # Convert string '08:00' to a Python time object
                start_time=datetime.strptime(data.get('startTime'), "%H:%M").time(),
                end_time=datetime.strptime(data.get('endTime'), "%H:%M").time(),
                description=data.get('description')
            )
            
            db.session.add(new_scenario)
            db.session.commit()
            
            return new_scenario.to_dict(), 201
            
        except Exception as e:
            db.session.rollback()
            return {"message": f"Error creating scenario: {str(e)}"}, 400

# To handle specific scenarios by ID (GET single, DELETE)
class ScenarioItemResource(Resource):
    def get(self, scenario_id):
        scenario = Scenario.query.get_or_404(scenario_id)
        return scenario.to_dict(), 200

    def delete(self, scenario_id):
        scenario = Scenario.query.get_or_404(scenario_id)
        db.session.delete(scenario)
        db.session.commit()
        return {"message": "Scenario deleted"}, 204
    

# Map the resources to specific URL endpoints
api.add_resource(ScenarioResource, '/api/v1/scenarios')
api.add_resource(ScenarioItemResource, '/api/v1/scenarios/<string:scenario_id>')