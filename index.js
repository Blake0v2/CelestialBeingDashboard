const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Define OAuth2 client credentials
const CLIENT_ID = '1404595445275164804';
const CLIENT_SECRET = 'GYQLIfibrg7cBDkirmcfAATsFrsgL-00';
const REDIRECT_URI = 'https://blake0v2.github.io/CelestialBeingDashboard/dashboard.html'; // Update to correct redirect URL

// Step 1: Redirect user to Discord's OAuth2 authorization page
app.get('/login', (req, res) => {
    const oauth2URL = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify`;
    res.redirect(oauth2URL);
});

// Step 2: Handle the callback from Discord after user logs in
app.get('/callback', async (req, res) => {
    const code = req.query.code;

    if (code) {
        try {
            // Step 3: Exchange the authorization code for an access token
            const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: REDIRECT_URI,
                scope: 'identify'
            }).toString(), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            const { access_token } = tokenResponse.data;

            // Step 4: Fetch the user's Discord data
            const userResponse = await axios.get('https://discord.com/api/v10/users/@me', {
                headers: { Authorization: `Bearer ${access_token}` }
            });

            // Step 5: Send user data back to the frontend (your dashboard page)
            const userData = userResponse.data;

            // For simplicity, pass user data to frontend via redirect URL
            res.redirect(`${REDIRECT_URI}?userData=${encodeURIComponent(JSON.stringify(userData))}`);
        } catch (err) {
            console.error('Error fetching user data:', err);
            res.redirect(REDIRECT_URI); // Redirect to the login page in case of error
        }
    } else {
        res.redirect(REDIRECT_URI); // Redirect if no code exists in query
    }
});

// Start the server
app.listen(port, () => {
    console.log(`App running at http://localhost:${port}`);
});
