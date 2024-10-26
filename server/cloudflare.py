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
