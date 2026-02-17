# import json

# class HugoReasoningAgent:
#     @staticmethod
#     def generate_plan(scenario_data, candidate_list):
#         # This matches Hugo's deliverable for JSON input/output
#         prompt = f"""
#         Analyze this disruption:
#         Event: {json.dumps(scenario_data)}
#         Candidates: {json.dumps(candidate_list)}
        
#         Tasks:
#         1. Summarize the event.
#         2. Assess impact for customer {scenario_data['customerSite']}.
#         3. For each candidate, explain the specific match logic.
#         4. Produce a Recommended Plan + Backup.
#         5. Draft notifications for Customer, Consultant, and Ops.
        
#         Output must be JSON.
#         """
        
#         # Call Phi-3 (via Ollama or MCP Client)
#         # response = call_phi3(prompt) 
#         # return json.loads(response)
#         return prompt # For now, we return the structured prompt


import os
import json

def get_prompt(scenario_dict, candidates_list):
    # 1. Get the path to the markdown file
    current_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(current_dir, "agent.md")

    # 2. Read the markdown template
    with open(file_path, "r", encoding="utf-8") as f:
        template = f.read()

    # 3. Format the template with real data
    # We use json.dumps to ensure the AI gets valid JSON strings
    return template.format(
        scenario_json=json.dumps(scenario_dict, indent=2),
        candidates_json=json.dumps(candidates_list, indent=2)
    )