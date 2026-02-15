from flask_restful import Resource, reqparse
from flask import jsonify, request, make_response
# from flask_jwt_extended import jwt_required
# from decorators.decorators import token_required # Using your existing decorators
from api import api
from ..models import Assignment # Import the model we created earlier

BLANK = "'{}' cannot be blank"

# Parser for POST or PUT requests (if you want to filter or update)
_assignment_parser = reqparse.RequestParser()
_assignment_parser.add_argument('date', type=str, help=BLANK.format("date"))

class AssignmentList(Resource):
    """Handles operations on the Assignment collection"""

    # @jwt_required()
    # @token_required
    def get(self):
        """Get all assignments or filter by date via query params"""
        date_query = request.args.get('date') # e.g., /assignments?date=2026-02-26
        
        try:
            if date_query:
                # Filters by that specific 2026 date format
                assignments = Assignment.query.filter_by(date=date_query).all()
            else:
                assignments = Assignment.query.all()

            # Manual serialization (or use your response_serializer if you have one)
            output = []
            for a in assignments:
                output.append({
                    "assignment_id": a.assignment_id,
                    "customer_id": a.customer_id,
                    "service": a.service,
                    "date": str(a.date),
                    "status": a.status
                })
            
            return make_response(jsonify(output), 200)

        except Exception as e:
            return make_response(jsonify({"error": str(e)}), 400)

class AssignmentDetail(Resource):
    """Handles operations on a single assignment"""
    
    # @jwt_required()
    # @token_required
    def get(self, assignment_id):
        assignment = Assignment.query.get(assignment_id)
        if not assignment:
            return {"message": "Assignment not found"}, 404
        return jsonify({"assignment_id": assignment.assignment_id, "status": assignment.status})

# Registering the routes
api.add_resource(AssignmentList, "/api/v1/assignments")
api.add_resource(AssignmentDetail, "/api/v1/assignment/<string:assignment_id>")