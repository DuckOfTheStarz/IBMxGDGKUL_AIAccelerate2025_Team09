import os
import requests
import json

# ========== CONFIGURATION ==========
API_KEY = "yWgxUpEhZtB3EYzncdTMbUsijOwwjCeyMfqar2kxZq7P"
SERVICE_URL = "https://eu-de.dataplatform.cloud.ibm.com"  # or your region endpoint from docs :contentReference[oaicite:2]{index=2}
PROJECT_ID = "01633454-ef09-4635-9e28-2bed4c90724c"
MODEL_ID = "ibm/granite-13b-instruct-v2"  # example model ID, adjust as needed :contentReference[oaicite:3]{index=3}

# ========== AUTHENTICATION: get IAM token ==========
token_url = "https://iam.cloud.ibm.com/identity/token"
token_headers = {
    "Content-Type": "application/x-www-form-urlencoded"
}
token_data = {
    "grant_type": "urn:ibm:params:oauth:grant-type:apikey",
    "apikey": API_KEY
}

resp = requests.post(token_url, headers=token_headers, data=token_data)
resp.raise_for_status()
token_json = resp.json()
access_token = token_json["access_token"]

# ========== CALL GENERATION ENDPOINT ==========
endpoint = f"{SERVICE_URL}/v1/generation/{MODEL_ID}/completions"
headers = {
    "Authorization": f"Bearer {access_token}",
    "Content-Type": "application/json"
}
body = {
    "project_id": PROJECT_ID,
    "model_id": MODEL_ID,
    "prompt": "Write a short poem about autumn in Belgium.",
    "max_new_tokens": 100,
    "temperature": 0.7
}

response = requests.post(endpoint, headers=headers, json=body)
response.raise_for_status()
result = response.json()

print(json.dumps(result, indent=2))
