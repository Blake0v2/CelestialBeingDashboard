const express = require('express');
const axios = require('axios');
const app = express();

// Replace these with your actual Discord credentials
const clientID = '1404595445275164804';
const clientSecret = 'YkBCpYRVpC5zktTrmvlQDeMcg1zpKtdD';
const redirectUri = 'https://blake0v2.github.io/TheArchAngels/dashboard.html';
const scope = 'identify';

app.get('/login', (req, res) => {
  const authUrl = `https://discord.com/oauth2/authorize?client_id=${clientID}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
  res.redirect(authUrl);
});

app.get('/oauth/callback', async (req, res) => {
  const { code } = req.query;

  // Exchange authorization code for an access token
  try {
    const response = await axios.post(
      'https://discord.com/oauth2/token',
      new URLSearchParams({
        client_id: clientID,
        client_secret: clientSecret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      })
    );
    const { access_token } = response.data;

    // Fetch user information
    const userResponse = await axios.get('https://discord.com/api/v9/users/@me', {
      headers: { Authorization: `Bearer ${access_token}` }
    });
    const user = userResponse.data;

    // Send user data (username, avatar) to frontend
    res.redirect(`/welcome?username=${user.username}&avatar=${user.avatar}&userId=${user.id}`);
  } catch (error) {
    res.status(500).send('OAuth2 authentication failed');
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

// Function to show a specific page and hide others
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.style.display = 'none';
    });

    // Show the selected page
    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.style.display = 'block';
    }
}

// Optional: If you want the "Commands" page to be displayed by default when the page loads
document.addEventListener('DOMContentLoaded', () => {
    showPage('dashboard'); // Change to 'commands' if you want the Commands page to open by default
});
