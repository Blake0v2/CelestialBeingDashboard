const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const app = express();

// Your Discord OAuth2 credentials
const CLIENT_ID = 'YOUR_CLIENT_ID';
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET';
const REDIRECT_URI = 'http://localhost:3000/auth/discord/callback';
const DISCORD_API_URL = 'https://discord.com/api/v10';

app.get('/auth/discord', (req, res) => {
    const authUrl = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify`;
    res.redirect(authUrl);
});

app.get('/auth/discord/callback', async (req, res) => {
    const { code } = req.query;

    try {
        // Exchange the code for an access token
        const tokenResponse = await axios.post(
            'https://discord.com/api/v10/oauth2/token',
            querystring.stringify({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                code,
                grant_type: 'authorization_code',
                redirect_uri: REDIRECT_URI,
                scope: 'identify'
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        const accessToken = tokenResponse.data.access_token;

        // Use the access token to get the user's information
        const userResponse = await axios.get(`${DISCORD_API_URL}/users/@me`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const user = userResponse.data;
        const avatarUrl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;

        // Pass user data to the frontend
        res.json({ username: user.username, avatarUrl });
    } catch (error) {
        console.error(error);
        res.status(500).send('Authentication failed');
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
