const express = require('express');
const path = require('path');
const ejs = require('ejs');

const app = express();
const port = 8000;

// Static user data for demonstration
const userData = {
  username: 'User123',
  discriminator: '4567',
  avatarUrl: 'https://cdn.discordapp.com/avatars/1234567890/abcdef12345.png',
  admin: true,  // Hardcoded as admin for simplicity
};

// Static bot commands for demonstration
const commands = {
  economy: [
    { name: '/balance', description: 'Check your account balance' },
    { name: '/daily', description: 'Claim your daily reward' },
    { name: '/leaderboard', description: 'View the top 10 users with the most money' },
    { name: '/stocks', description: 'Check current stocks' },
    { name: '/buy', description: 'Buy items from the Arch Angel market' },
    { name: '/sell', description: 'Sell your stocks for money' },
    { name: '/portfolio', description: 'View your portfolio' },
  ],
  gambling: [
    { name: '/slots', description: 'Play slots and spin for a chance to win!' },
    { name: '/coinflip', description: 'Toss a coin and hope you win!' },
    { name: '/clicker', description: 'Click the button to earn money!' },
    { name: '/blackjack', description: 'Play blackjack to win money!' },
    { name: '/roll', description: 'Roll the dice and win!' },
  ],
};

// Setup Express and Static Directory
app.use(express.static(path.join(__dirname, 'static')));
app.use(express.json());

// EJS Template Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'templates'));

// Dashboard Route (No Authentication)
app.get('/dashboard', (req, res) => {
  res.render('dashboard', {
    username: `${userData.username}#${userData.discriminator}`,
    admin: userData.admin,
    userAvatarUrl: userData.avatarUrl,
    displayName: userData.username,
    commands: commands,
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
