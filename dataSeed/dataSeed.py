#################################################################
#This is the python script for populating the API with test data#
#################################################################

import requests
import json


# Populating museumEntity table
museums_data = json.load(open('museums_data.json'))
created_museums = []

for m in museums_data:
    post_request = requests.post("http://127.0.0.1:3000/api/v1/museums", json=m)
    created_museums.append(post_request.json())

# Populating artistEntity table
artists_data = json.load(open('artists_data.json'))
created_artists = []

for a in artists_data:
    post_request = requests.post("http://127.0.0.1:3000/api/v1/artists", json=a)
    created_artists.append(post_request.json())

# Populating artworkEntity table
artworks_data = json.load(open('artworks_data.json'))
created_artworks = []

artwork_count = 0
artist_count = 0

for a in artworks_data:
    current_artist = created_artists[artist_count];
    request_url = "http://127.0.0.1:3000/api/v1/artists/" + current_artist["id"] + "/artworks"
    post_request = requests.post(request_url, json=a)
    artwork_count+=1
    if (artwork_count % 3 == 0):
        artist_count += 1
    created_artworks.append(post_request.json())


# Associating artworks to museums
for a in created_artworks:
    if (a["type"] == "Abstract Drawing" or a["type"] == "Postmodern Painting"):
        request_url = "http://127.0.0.1:3000/api/v1/museums/" + created_museums[0]["id"] + "/artworks/" + a["id"]
        post_request = requests.post(request_url)

    if (a["type"] == "Realistic Painting"):
        request_url = "http://127.0.0.1:3000/api/v1/museums/" + created_museums[1]["id"] + "/artworks/" + a["id"]
        post_request = requests.post(request_url)

    if (a["type"] == "Abstract Painting" or a["type"] == "Surrealistic Painting"):
        request_url = "http://127.0.0.1:3000/api/v1/museums/" + created_museums[2]["id"] + "/artworks/" + a["id"]
        post_request = requests.post(request_url)

    if (a["type"] == "Impressionist Painting"):
        request_url = "http://127.0.0.1:3000/api/v1/museums/" + created_museums[3]["id"] + "/artworks/" + a["id"]
        post_request = requests.post(request_url)

    if (a["type"] == "Photography"):
        request_url = "http://127.0.0.1:3000/api/v1/museums/" + created_museums[4]["id"] + "/artworks/" + a["id"]
        post_request = requests.post(request_url)

    if (a["type"] == "Sculpture"):
        request_url = "http://127.0.0.1:3000/api/v1/museums/" + created_museums[5]["id"] + "/artworks/" + a["id"]
        post_request = requests.post(request_url)
    
# Populating movementEntity table
movements_data = json.load(open('movements_data.json'))
created_movements = []

for m in movements_data:
    post_request = requests.post("http://127.0.0.1:3000/api/v1/movements", json=m)
    created_movements.append(post_request.json())


# Associating artists to movements
artist_count = 0
movement_count = 0
for a in created_artists:
    current_artist = created_artists[artist_count];
    request_url_1 = "http://127.0.0.1:3000/api/v1/movements/" + created_movements[movement_count]["id"] + "/artists/" + current_artist["id"]
    post_request = requests.post(request_url_1)
    print(request_url_1)

    request_url_2 = "http://127.0.0.1:3000/api/v1/movements/" + created_movements[movement_count + 1]["id"] + "/artists/" + current_artist["id"]
    post_request = requests.post(request_url_2)
    artist_count+=1
    print(post_request)
    if (artist_count == 7 or artist_count == 15):
        movement_count += 2
