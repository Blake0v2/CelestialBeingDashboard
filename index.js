const express = require('express');
const axios = require('axios');
const path = require('path');
const cookieParser = require('cookie-parser');
const { Client, Intents } = require('discord.js');
const ejs = require('ejs');

const app = express();
const port = 8000;

// Discord Bot Setup
const CLIENT_ID = '1389852325648007290';
const CLIENT_SECRET = 'dWOJvWCWiFWTKiw7xmrQa1iLoY7Pd6Ng';
const REDIRECT_URI = 'https://discord.com/oauth2/authorize?client_id=1389852325648007290&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Fapi%2Fauth%2Fdiscord%2Fredirect&scope=identify';
const GUILD_ID = '1365848012194316312';
const ADMIN_ROLE_IDS = ['1365851423081762897', '1390148617091678300'];
const DISCORD_API_BASE = 'https://discord.com/api';

const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS] });

let sessions = {};

// Setup Express and Static Directory
app.use(express.static(path.join(__dirname, 'static')));
app.use(express.json());
app.use(cookieParser());

// EJS Template Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'templates'));

// Redirect to Login
app.get('/', (req, res) => {
  res.redirect('/login');
});

// Login Route to initiate OAuth
app.get('/login', (req, res) => {
  const discordOAuthURL = `${DISCORD_API_BASE}/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=identify%20guilds%20guilds.members.read`;
  res.redirect(discordOAuthURL);
});

// Callback Route to handle OAuth callback and retrieve user data
app.get('/callback', async (req, res) => {
  const { code } = req.query;

  try {
    // Get Access Token
    const tokenResponse = await axios.post(
      `${DISCORD_API_BASE}/oauth2/token`,
      new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
        scope: 'identify guilds guilds.members.read'
      })
    );

    const accessToken = tokenResponse.data.access_token;
    if (!accessToken) {
      return res.status(401).send('Authentication failed.');
    }

    // Fetch User Info
    const userResponse = await axios.get(`${DISCORD_API_BASE}/users/@me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    
    const user = userResponse.data;

    // Fetch Member Info from the Guild
    const memberResponse = await axios.get(`${DISCORD_API_BASE}/guilds/${GUILD_ID}/members/${user.id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const memberData = memberResponse.data;
    const userId = user.id;
    const userRoles = memberData.roles || [];
    const isAdmin = userRoles.some(role => ADMIN_ROLE_IDS.includes(role));
    const isOwner = userId === memberData.guild.owner_id;

    const userAvatarUrl = `https://cdn.discordapp.com/avatars/${userId}/${user.avatar}.png`;

    // Store session data
    sessions[userId] = {
      username: user.username,
      discriminator: user.discriminator,
      admin: isAdmin || isOwner,
      avatarUrl: userAvatarUrl
    };

    res.cookie('user_id', userId); // Store user_id in cookie
    res.redirect(`/dashboard?user_id=${userId}`);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// Dashboard Route
app.get('/dashboard', (req, res) => {
  const userId = req.cookies.user_id;
  if (!userId || !sessions[userId]) {
    return res.redirect('/login');
  }

  const userData = sessions[userId];
  const commands = userData.admin ? getAdminCommands() : getUserCommands();

  res.render('dashboard', {
    username: `${userData.username}#${userData.discriminator}`,
    admin: userData.admin,
    commands: commands,
    userAvatarUrl: userData.avatarUrl
  });
});

// Logout Route
app.get('/logout', (req, res) => {
  const userId = req.cookies.user_id;
  if (userId) {
    delete sessions[userId];
  }
  res.clearCookie('user_id');
  res.redirect('/login');
});

// Admin Commands Function
function getAdminCommands() {
  return {
    economy: [
      { name: '/in progress', description: ':D' },
      { name: '/needed sumthing', description: 'uhh' }
    ],
  };
}
// User Commands Function
function getUserCommands() {
  return {
    economy: [
      { name: '/balance', description: 'Check your account balance' },
      { name: '/daily', description: 'Claim your daily reward' },
      { name: '/leaderboard', description: 'View the top 10 users with the most money' },
      { name: '/stocks', description: 'Check current stocks' },
      { name: '/buy', description: 'Buy items from the Arch Angel market' },
      { name: '/sell', description: 'Sell your stocks for money' },
      { name: '/portfolio', description: 'View your portfolio' }
    ],
    gambling: [
      { name: '/slots', description: 'Play slots and spin for a chance to win!' },
      { name: '/coinflip', description: 'Toss a coin and hope you win!' },
      { name: '/clicker', description: 'Click the button to earn money!' },
      { name: '/blackjack', description: 'Play blackjack to win money!' },
      { name: '/roll', description: 'Roll the dice and win!' },
      { name: '/duel', description: 'Challenge others to a duel' },
      { name: '/bomb', description: 'Defuse a bomb and win money' },
      { name: '/rob', description: 'Rob another user for their money' },
      { name: '/lootbox', description: 'Find treasure in a loot box!' }
    ],
    grind: [
      { name: '!key', description: 'Ping the Key Farm role to find people to grind with!' },
      { name: '!desert', description: 'Ping the Desert role to find grinding partners' },
      { name: '!needcarry', description: 'Ping high rank users to help you grind' },
      { name: '!carry', description: 'Ping low rank users that you can carry' },
      { name: '!apply4carry', description: 'Apply for the Carry Verified role' },
      { name: '!apply4needcarry', description: 'Apply for the Need Carry role' },
    ],
    staff: [
      { name: '/kick', description: 'Kick a user from the server' },
      { name: '/ban', description: 'Ban a user from the server' },
      { name: '/warn', description: 'Warn a user for their actions' },
      { name: '/mute', description: 'Temporarily mute a user' },
      { name: '/purge', description: 'Delete messages in bulk' }
    ]
  };
}

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
