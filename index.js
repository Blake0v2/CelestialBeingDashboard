const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

// Sample data (Normally, you would fetch this from a database)
const raidTimes = {
  "dedu_island": { start: 15, end: 29 },
  "snow_island": { start: 30, end: 44 },
  "jungle_island": { start: 15, end: 29 }
};

// Sample user data (to simulate after OAuth2)
let currentUser = {
  username: "ExampleUser",
  avatarURL: "https://i.pinimg.com/originals/88/9b/c6/889bc64ff365e83366adf10b1a5c4db5.png"
};

// Route for serving static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Route to get raid times
app.get('/api/getRaidTimes', (req, res) => {
  res.json({ raidTimes });
});

// OAuth2 Authentication route (simulated login)
app.get('/auth', (req, res) => {
  // Simulating OAuth2
  currentUser = { username: "NewUser", avatarURL: "https://example.com/avatar.png" };
  res.redirect('/dashboard');
});

// Route to get the current user info (username, avatar)
app.get('/api/getUserInfo', (req, res) => {
  res.json(currentUser);
});

// Current Raid Status Page (checks and renders the page with active raids)
app.get('/current-raid', (req, res) => {
  const activeRaids = getCurrentRaid();
  res.render('current_raid', {
    currentTime: new Date().toLocaleTimeString(),
    raidStatus: activeRaids
  });
});

// Helper function to check the current active raids based on time
function getCurrentRaid() {
  const currentMinute = new Date().getMinutes();
  let activeRaids = [];

  for (const raid in raidTimes) {
    const times = raidTimes[raid];
    if (times.start <= currentMinute && currentMinute <= times.end) {
      activeRaids.push(raid);
    }
  }

  return activeRaids.length > 0 ? activeRaids : ['jungle_island'];
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
