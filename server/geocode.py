# import requests

# # Endpoint URL for Google Maps Routes API
# url = "https://routes.googleapis.com/directions/v2:computeRoutes"

# # Define origin and destination as per your specification
# payload = {
#     "origin": {
#         "location": {
#             "latLng": {
#                 "latitude": 74.47168,
#                 "longitude": 40.52180
#             }
#         }
#     },
#     "destination": {
#         "location": {
#             "latLng": {
#                 "latitude": 40.5250,
#                 "longitude": 74.4409
#             }
#         }
#     },
#     "travelMode": "DRIVE",
#     "routingPreference": "TRAFFIC_AWARE",
#   "computeAlternativeRoutes": False,
#   "routeModifiers": {
#     "avoidTolls": False,
#     "avoidHighways": False,
#     "avoidFerries": False
#   },
#   "languageCode": "en-US",
#   "units": "IMPERIAL"
# }

# # Headers with Authorization (API Key)
# headers = {
#     "Content-Type": "application/json",
#     "Authorization": "Bearer AIzaSyAKZULY1J606M9MaIzQYBko7dfJIpRqsVY"  # Replace with your actual API key
# }

# # Make the POST request
# response = requests.post(url, json=payload, headers=headers)

# # Print the response
# if response.status_code == 200:
#     print("Response:", response.json())
# else:
#     print(f"Error {response.status_code}: {response.text}")


import requests
import json

# Define your API key
API_KEY = "AIzaSyAKZULY1J606M9MaIzQYBko7dfJIpRqsVY"

# Define the URL for the Google Directions API
url = "https://routes.googleapis.com/directions/v2:computeRoutes"

# Define the payload (request body)
payload = {
    "origin": {
        "location": {
            "latLng": {
                "latitude": 37.419734,
                "longitude": -122.0827784
            }
        }
    },
    "destination": {
        "location": {
            "latLng": {
                "latitude": 37.417670,
                "longitude": -122.079595
            }
        }
    },
    "travelMode": "DRIVE",
    "routingPreference": "TRAFFIC_AWARE",
    "computeAlternativeRoutes": False,
    "routeModifiers": {
        "avoidTolls": False,
        "avoidHighways": False,
        "avoidFerries": False
    },
    "languageCode": "en-US",
    "units": "IMPERIAL"
}

# Define the headers
headers = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": API_KEY,
    "X-Goog-FieldMask": "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline"
}

# Send the POST request
response = requests.post(url, headers=headers, data=json.dumps(payload))

# Check the response
if response.status_code == 200:
    # Print the response data
    print("Response JSON:")
    print(json.dumps(response.json(), indent=2))
else:
    print(f"Error: {response.status_code}")
    print(response.text)
