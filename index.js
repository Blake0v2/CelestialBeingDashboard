const express = require('express');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const { Client } = require('discord.js');
const app = express();

// Set up Express to serve static files and parse cookies
app.use(express.static('public'));  // Serve static files from the 'public' folder
app.use(cookieParser());

// Discord bot credentials
const CLIENT_ID = "your_client_id";  // Replace with your Discord client ID
const CLIENT_SECRET = "your_client_secret";  // Replace with your Discord client secret
const REDIRECT_URI = "http://localhost:3000/callback";  // Adjust as needed for production
const GUILD_ID = "your_guild_id";  // Replace with your Discord guild ID
const ADMIN_ROLE_IDS = [1365851423081762897, 1390148617091678300];  // List of admin role IDs
const DISCORD_API_BASE = 'https://discord.com/api';

// Set up a simple in-memory session store
const sessions = {};

// Create a new Discord client instance
const bot = new Client();
bot.login("your_bot_token");  // Replace with your bot token

app.get('/', (req, res) => {
  res.redirect('/login');
});

// Login route that redirects to Discord OAuth2
app.get('/login', (req, res) => {
  const discordOAuthUrl = `${DISCORD_API_BASE}/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=identify%20guilds%20guilds.members.read`;
  res.redirect(discordOAuthUrl);
});

// Callback route after Discord OAuth2 login
app.get('/callback', async (req, res) => {
  const code = req.query.code;
  
  const tokenResponse = await axios.post(`${DISCORD_API_BASE}/oauth2/token`, null, {
    params: {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: REDIRECT_URI,
      scope: 'identify guilds guilds.members.read',
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  const { access_token } = tokenResponse.data;

  if (!access_token) {
    return res.status(401).send('Authentication failed.');
  }

  const userResponse = await axios.get(`${DISCORD_API_BASE}/users/@me`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  const user = userResponse.data;
  const userId = user.id;
  const userAvatarUrl = `https://cdn.discordapp.com/avatars/${userId}/${user.avatar}.png`;

  // Fetch user member data from the guild
  const memberResponse = await axios.get(`${DISCORD_API_BASE}/guilds/${GUILD_ID}/members/${userId}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  const memberData = memberResponse.data;
  const userRoles = memberData.roles || [];
  const isAdmin = userRoles.some(role => ADMIN_ROLE_IDS.includes(parseInt(role)));
  const isOwner = userId === memberData.guild.owner_id;

  sessions[userId] = {
    username: user.username,
    discriminator: user.discriminator,
    admin: isAdmin || isOwner,
    avatar_url: userAvatarUrl,
  };

  res.cookie('user_id', userId);
  res.redirect(`/dashboard?user_id=${userId}`);
});

// Dashboard route (after login)
app.get('/dashboard', (req, res) => {
  const userId = req.cookies.user_id;

  if (!userId || !sessions[userId]) {
    return res.redirect('/login');
  }

  const userData = sessions[userId];
  const commands = userData.admin ? {
    economy: [
      { name: '/balance', description: 'Check your account balance' },
      { name: '/daily', description: 'Claim your daily reward of $100!' },
      { name: '/leaderboard', description: 'See the top 10 users with the most money!' },
    ],
    gambling: [
      { name: '/slots', description: 'Play slots and spin a good row!' },
      { name: '/coinflip', description: 'Toss a coin and hope you\'re lucky!' },
    ],
    staff: [
      { name: '/kick', description: 'Kick a member from the server' },
      { name: '/ban', description: 'Ban a member from the server' },
    ],
  } : {
    economy: [
      { name: '/balance', description: 'Check your account balance' },
    ],
  };

  res.render('dashboard', {
    username: `${userData.username}#${userData.discriminator}`,
    admin: userData.admin,
    commands,
    user_avatar_url: userData.avatar_url,
    display_name: userData.username,
  });
});

// Log out route
app.get('/logout', (req, res) => {
  const userId = req.cookies.user_id;

  if (userId) {
    delete sessions[userId];
  }

  res.clearCookie('user_id');
  res.redirect('/login');
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
