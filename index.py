import requests
from flask import Flask, request, redirect, session, render_template

app = Flask(__name__)
app.secret_key = 'fU1A3c0N34o7_VWm9VrkfR9wdN_HAlQmC7aLuF03RJo='  

CLIENT_ID = 'Y1404595445275164804'
CLIENT_SECRET = 'IjqoOntGo2wBJROdA815y5QP7pJBzteO'
REDIRECT_URI = 'https://blake0v2.github.io/CelestialBeingDashboard/dashboard.html'  # Check if this URL works for your setup

@app.route('/login')
def login():
    oauth_url = f'https://discord.com/oauth2/authorize?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&response_type=code&scope=identify'
    return redirect(oauth_url)

@app.route('/callback')
def callback():
    code = request.args.get('code')
    if not code:
        return "Error: No code received", 400  # Handle missing code

    token_url = 'https://discord.com/api/oauth2/token'
    data = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'code': code,
        'grant_type': 'authorization_code',
        'redirect_uri': REDIRECT_URI,
        'scope': 'identify',
    }
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    response = requests.post(token_url, data=data, headers=headers)
    if response.status_code != 200:
        return f"Error: {response.status_code} - {response.text}", 400  # Handle token request failure
    
    tokens = response.json()
    access_token = tokens.get('access_token')
    if not access_token:
        return "Error: No access token received", 400

    # Fetch user info
    user_info_url = 'https://discord.com/api/v10/users/@me'
    headers = {
        'Authorization': f'Bearer {access_token}'
    }
    user_response = requests.get(user_info_url, headers=headers)
    if user_response.status_code != 200:
        return f"Error: {user_response.status_code} - {user_response.text}", 400  # Handle user info fetch failure
    
    user_data = user_response.json()

    # Store user data in session or database
    session['username'] = user_data['username']
    session['avatar_url'] = f"https://cdn.discordapp.com/avatars/{user_data['id']}/{user_data['avatar']}.png"

    return redirect('/dashboard')

@app.route('/dashboard')
def dashboard():
    # Render dashboard with user info
    return render_template('dashboard.html', username=session.get('username'), avatar_url=session.get('avatar_url'))

if __name__ == "__main__":
    app.run(debug=True)
