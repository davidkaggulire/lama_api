from ..models import Consultant, Service, Region  # Import your normalized models
from api import api
from flask_restful import Resource, reqparse
from flask import jsonify, request, make_response


# Parser for filtering or creating consultants
_consultant_parser = reqparse.RequestParser()
_consultant_parser.add_argument("employment_type", type=str)

class ConsultantList(Resource):
    """Handles operations on the Consultant collection"""

    # @jwt_required()
    # @token_required
    def get(self):
        """Get all consultants with optional filtering by service or region"""
        service_code = request.args.get("service")  # e.g., /consultants?service=Picker
        region_code = request.args.get("region")  # e.g., /consultants?region=SE-MAL

        try:
            query = Consultant.query

            # Filter by Service (Join the junction table)
            if service_code:
                query = query.join(Consultant.services).filter(
                    Service.service_code == service_code
                )

            # Filter by Region (Join the junction table)
            if region_code:
                query = query.join(Consultant.regions).filter(
                    Region.region_code == region_code
                )

            consultants = query.all()

            output = []
            for c in consultants:
                output.append(
                    {
                        "consultant_id": c.consultant_id,
                        "first_name": c.first_name,
                        "last_name": c.last_name,
                        "employment_type": c.employment_type,
                        # Helper logic to turn related objects into simple lists
                        "services": [s.service_code for s in c.services],
                        "regions": [r.region_code for r in c.regions],
                        "pools": [p.pool_id for p in c.pools],
                    }
                )
            print
            return make_response(jsonify(output), 200)

        except Exception as e:
            return make_response(jsonify({"error": str(e)}), 400)


class ConsultantDetail(Resource):
    """Handles operations on a single consultant"""

    # @jwt_required()
    # @token_required
    def get(self, consultant_id):
        consultant = Consultant.query.get(consultant_id)
        if not consultant:
            return make_response(jsonify({"message": "Consultant not found"}), 404)

        return jsonify(
            {
                "consultant_id": consultant.consultant_id,
                "first_name": consultant.first_name,
                "last_name": consultant.last_name,
                "employment_type": consultant.employment_type,
                "services": [s.service_code for s in consultant.services],
                "regions": [r.region_code for r in consultant.regions],
            }
        )


# Registering the routes

api.add_resource(ConsultantList, "/api/v1/consultants")
api.add_resource(ConsultantDetail, "/api/v1/consultant/<string:consultant_id>")