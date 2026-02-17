# import ollama
# from agents.hugo_agent import get_hugo_prompt

# def run_hugo_analysis(scenario_data, candidates_list):
#     # 1. Generate the full prompt using your Markdown template
#     full_prompt = get_hugo_prompt(scenario_data, candidates_list)
    
#     # 2. Call Phi-3 via Ollama
#     response = ollama.chat(
#         model='phi3',
#         messages=[
#             {
#                 'role': 'user',
#                 'content': full_prompt,
#             },
#         ],
#         format='json', # Forces Phi-3 to follow your JSON structure
#         options={
#             'temperature': 0.2, # Keeps the AI focused and factual
#         }
#     )
    
#     # 3. Extract the text and return it as a dictionary
#     return response['message']['content']


# import asyncio
# import ollama
# import json
# from mcp import ClientSession, StdioServerParameters
# from mcp.client.stdio import stdio_client

# # Define how to launch your MCP server
# server_params = StdioServerParameters(
#     command="python",
#     args=["backend/mcp_server.py"], # Path to your MCP server file
# )

# async def run_hugo_analysis_mcp(user_query):
#     async with stdio_client(server_params) as (read, write):
#         async with ClientSession(read, write) as session:
#             await session.initialize()
            
#             # 1. DISCOVERY: Get tools from your MCP server and format for Ollama
#             mcp_tools = await session.list_tools()
#             ollama_tools = [
#                 {
#                     'type': 'function',
#                     'function': {
#                         'name': t.name,
#                         'description': t.description,
#                         'parameters': t.inputSchema,
#                     }
#                 } for t in mcp_tools.tools
#             ]

#             # 2. INITIAL CALL: Tell Phi-3 the goal and what tools it has
#             messages = [{'role': 'user', 'content': user_query}]
#             response = ollama.chat(
#                 model='phi3',
#                 messages=messages,
#                 tools=ollama_tools,
#                 format='json'
#             )

#             # 3. EXECUTION: If Phi-3 wants to use 'analyze_scenario', do it
#             if response.get('message', {}).get('tool_calls'):
#                 for tool in response['message']['tool_calls']:
#                     # Execute the tool on the MCP Server (fetches DB data)
#                     result = await session.call_tool(
#                         tool['function']['name'], 
#                         arguments=tool['function']['arguments']
#                     )
                    
#                     # Add tool results to the conversation
#                     messages.append(response['message'])
#                     messages.append({'role': 'tool', 'content': json.dumps(result.content)})
                    
#                     # 4. FINAL REASONING: Phi-3 now writes the Hugo plan with the real data
#                     final_response = ollama.chat(
#                         model='phi3',
#                         messages=messages,
#                         format='json'
#                     )
#                     return final_response['message']['content']
            
#             return response['message']['content']


import asyncio
import ollama
import json
import sys
import os
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

# 1. Import the template formatter from your other file
from backend.agents.agent import get_prompt 

# # Define how to launch your MCP server
# server_params = StdioServerParameters(
#     command="python",
#     # Ensure this path is correct relative to where you run the script
#     args=[os.path.abspath("backend/mcp_server.py")], 
# )


# Get the absolute path to your project root
# This ensures it works regardless of where you start the terminal
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MCP_PATH = os.path.join(BASE_DIR, "mcp_server.py")

server_params = StdioServerParameters(
    command=sys.executable, # Uses the exact same Python/Venv as your Flask app
    args=[MCP_PATH], 
    env=os.environ.copy()   # Passes your DB_URL and other env vars to the MCP process
)

async def run_analysis_mcp(scenario_id):
    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            
            # DISCOVERY: Get tools from your MCP server
            mcp_tools = await session.list_tools()
            ollama_tools = [
                {
                    'type': 'function',
                    'function': {
                        'name': t.name,
                        'description': t.description,
                        'parameters': t.inputSchema,
                    }
                } for t in mcp_tools.tools
            ]

            # INITIAL CALL: Ask Phi-3 to fetch the data first
            # We tell the AI to use the tool for the specific scenario_id
            messages = [{'role': 'user', 'content': f"Analyze scenario {scenario_id}"}]
            
            response = ollama.chat(
                model='llama3.1',
                messages=messages,
                tools=ollama_tools
            )

            # TOOL EXECUTION LOOP
            if response.get('message', {}).get('tool_calls'):
                for tool in response['message']['tool_calls']:
                    # Execute the tool (this runs your DisruptionAnalysisResource logic)
                    result = await session.call_tool(
                        tool['function']['name'], 
                        arguments=tool['function']['arguments']
                    )
                    
                    # --- THE CRITICAL PART ---
                    # Now that we have the data, we generate the Hugo Markdown prompt
                    # result.content usually contains the 'data' from your Flask resource
                    data = result.content[0].text if hasattr(result.content[0], 'text') else str(result.content)
                    data_dict = json.loads(data)

                    # 2. Inject the DB data into your hugo_agent.md template
                    hugo_markdown_prompt = get_prompt(
                        scenario_dict=data_dict.get('eventSummary', {}),
                        candidates_list=data_dict.get('candidates', [])
                    )

                    # 3. Send the final templated prompt to Phi-3 for reasoning
                    final_messages = [
                        {'role': 'system', 'content': "You must output valid JSON only."},
                        {'role': 'user', 'content': hugo_markdown_prompt}
                    ]

                    final_response = ollama.chat(
                        model='llama3.1',
                        messages=final_messages,
                        format='json',
                        options={'temperature': 0}
                    )
                    
                    return final_response['message']['content']
            
            return {"error": "AI did not call the tool correctly"}