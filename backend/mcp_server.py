
import sys
import os
from mcp.server.fastmcp import FastMCP
from api.routes.analysis import DisruptionAnalysisResource # Move your logic here
# from api.models import db

# # Initialize MCP
# mcp = FastMCP("Disruption-Manager")

# @mcp.tool()
# def analyze_scenario(scenario_id: str):
#     """Fetches top 3 available consultants for a disruption."""
#     # This calls the same code your Flask app uses
#     # results = DisruptionAnalysisResource(scenario_id)
#     # return results

#     resource = DisruptionAnalysisResource()
#     # We call your existing Flask logic directly
#     data, status = resource.get(scenario_id)
#     return data


# if __name__ == "__main__":
#     mcp.run()



from api import app

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Initialize MCP
mcp = FastMCP("Disruption-Manager")

@mcp.tool()
def analyze_scenario(scenario_id: str):
    """
    Analyzes a disruption and returns the best replacement candidates.
    Args:
        scenario_id: The unique ID of the disruption (e.g., 'sc-101')
    """
    # Wrap in app_context so the DB logic works correctly
    with app.app_context():
        resource = DisruptionAnalysisResource()
        # Call your existing logic
        data, status = resource.get(scenario_id)
        return data

if __name__ == "__main__":
    # Use 'stdio' transport for local AI tools (Claude Desktop / Cursor)
    mcp.run(transport="stdio")
