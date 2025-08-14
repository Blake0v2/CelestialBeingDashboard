import os
import requests
from fastapi import FastAPI, Depends, HTTPException
from fastapi.responses import RedirectResponse
from fastapi.templating import Jinja2Templates
from fastapi import Request

# Add your client ID, client secret, and redirect URI
CLIENT_ID = "1404595445275164804"
CLIENT_SECRET = "Ed6VNrtlF01HyCyJrHKx_FXkg55lmu1B"
REDIRECT_URI = "https://blake0v2.github.io/CelestialBeingDashboard/dashboard.html"

# Discord API endpoints
OAUTH2_URL = "https://discord.com/api/oauth2/authorize"
TOKEN_URL = "https://discord.com/api/oauth2/token"
USER_URL = "https://discord.com/api/v9/users/@me"

app = FastAPI()
templates = Jinja2Templates(directory="templates")

@app.get("/login")
async def login():
    # Redirect user to Discord OAuth2 login page
    redirect_uri = f"https://discord.com/oauth2/authorize?client_id={CLIENT_ID}&response_type=code&redirect_uri={REDIRECT_URI}&scope=identify+guilds+applications.commands.permissions.update+guilds.join+connections"
    return RedirectResponse(redirect_uri)

@app.get("/callback")
async def callback(request: Request):
    # Get the authorization code from the URL
    code = request.query_params.get('code')
    if not code:
        raise HTTPException(status_code=400, detail="No code provided")

    # Exchange the code for an access token
    data = {
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": REDIRECT_URI,
        "scope": "identify"
    }

    response = requests.post(TOKEN_URL, data=data, headers={"Content-Type": "application/x-www-form-urlencoded"})
    token_data = response.json()
    access_token = token_data.get("access_token")

    if not access_token:
        raise HTTPException(status_code=400, detail="Unable to get access token")

    # Fetch user data using the access token
    user_response = requests.get(USER_URL, headers={"Authorization": f"Bearer {access_token}"})
    user_data = user_response.json()

    username = user_data["username"]
    avatar_url = f"https://cdn.discordapp.com/avatars/{user_data['id']}/{user_data['avatar']}.png"

    # Send the access token and user data back to the frontend for storage
    return templates.TemplateResponse("index.html", {
        "request": request, 
        "username": username, 
        "avatar_url": avatar_url, 
        "access_token": access_token  # Include access token to be stored in localStorage
    })
