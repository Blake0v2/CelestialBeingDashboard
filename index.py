import requests
from flask import Flask, request, redirect, session, render_template

app = Flask(__name__)
app.secret_key = 'fU1A3c0N34o7_VWm9VrkfR9wdN_HAlQmC7aLuF03RJo='  # Secure key

CLIENT_ID = 'Y1404595445275164804'
CLIENT_SECRET = 'IjqoOntGo2wBJROdA815y5QP7pJBzteO'
REDIRECT_URI = 'https://blake0v2.github.io/CelestialBeingDashboard/dashboard.html'  # Check if this URL works for your setup

@app.route('/login')
def login():
    # Redirect user to Discord OAuth2 authorization page
    oauth_url = f'https://discord.com/oauth2/authorize?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&response_type=code&scope=identify'
    return redirect(oauth_url)

@app.route('/callback')
def callback():
    # Get the authorization code from Discord's redirect
    code = request.args.get('code')
    if not code:
        return "Error: No code received", 400  # Handle missing code

    # Exchange the code for an access token
    token_url = 'https://discord.com/api/oauth2/token'
    data = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'code': code,
        'grant_type': 'authorization_code',
        'redirect_uri': REDIRECT_URI,
        'scope': 'identify',
    }
    headers = {'Content-Type': 'application/x-www-form-urlencoded'}
    response = requests.post(token_url, data=data, headers=headers)
    
    if response.status_code != 200:
        return f"Error: {response.status_code} - {response.text}", 400  # Handle token request failure

    # Parse the token response
    tokens = response.json()
    access_token = tokens.get('access_token')
    if not access_token:
        return "Error: No access token received", 400

    # Fetch user info using the access token
    user_info_url = 'https://discord.com/api/v10/users/@me'
    headers = {'Authorization': f'Bearer {access_token}'}
    user_response = requests.get(user_info_url, headers=headers)
    
    if user_response.status_code != 200:
        return f"Error: {user_response.status_code} - {user_response.text}", 400  # Handle user info fetch failure

    user_data = user_response.json()

    # Store user data in session
    session['username'] = user_data['username']
    session['avatar_url'] = f"https://cdn.discordapp.com/avatars/{user_data['id']}/{user_data['avatar']}.png"

    # Redirect to dashboard
    return redirect('/dashboard')

@app.route('/dashboard')
def dashboard():
    # Render the dashboard with user info (username and avatar)
    return render_template('index.html', username=session.get('username'), avatar_url=session.get('avatar_url'))

if __name__ == "__main__":
    app.run(debug=True)
