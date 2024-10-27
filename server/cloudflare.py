import requests
import os
import cloudflare
from dotenv import load_dotenv

load_dotenv()
CLOUDFLARE_API = os.getenv('CLOUDFLARE_API')
API_BASE_URL = "https://api.cloudflare.com/client/v4/accounts/3edf18a2c5178542d9de017a35bf0c7d/ai/run/"

def run(model, inputs):
    
    headers = {"Authorization": CLOUDFLARE_API}
    input = { "messages": inputs }
    response = requests.post(f"{API_BASE_URL}{model}", headers=headers, json=input)
    return response.json()

def generatingActivity(model):
    headers = {"Authorization": CLOUDFLARE_API}
    
    input_data = {
        "messages": [
            {
                "role": "system",
                "content": (
                    "Generate a list of 3 activities someone with Alzheimer's/dementia could do to improve their memory. "
                    "Provide it in the format of a list of JSONs, with the JSON format being "
                    "{'name': 'example', 'datetime': 'YY-MM-DDTHH:MM:SS:00'}. With the date being the current date of October 27th"
                    "Please just give the object, without anything before or after."
                )
            },
            {
                "role": "user",
                "content": "Please generate tasks"
            }
        ]
    }

    
    response = requests.post(f"{API_BASE_URL}{model}", headers=headers, json=input_data)
    return response.json()

print(generatingActivity("@cf/meta/llama-2-7b-chat-int8"))