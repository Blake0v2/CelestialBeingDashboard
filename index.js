// OAuth2 Authentication
window.onload = function() {
  if (!localStorage.getItem('discord_user')) {
    window.location.href = 'https://discord.com/oauth2/authorize?client_id=1404595445275164804&response_type=code&redirect_uri=https%3A%2F%2Fblake0v2.github.io%2FTheArchAngels%2Fdashboard.html&scope=identify+guilds+applications.commands.permissions.update+connections';
  }
};

// Navigation Functionality
document.getElementById('dashboardBtn').addEventListener('click', function() {
  showPage('welcomeMessage');
});

document.getElementById('commandsBtn').addEventListener('click', function() {
  showPage('commandsPage');
});

document.getElementById('currentRaidBtn').addEventListener('click', function() {
  showPage('currentRaidPage');
});

// Show the selected page
function showPage(pageId) {
  const pages = document.querySelectorAll('.page-container');
  const messageBox = document.getElementById('welcomeMessage');
  
  // Hide all pages and the welcome message
  pages.forEach(page => page.style.display = 'none');
  messageBox.style.display = 'none';
  
  // Show the selected page
  if (pageId === 'welcomeMessage') {
    messageBox.style.display = 'block';
  } else {
    document.getElementById(pageId).style.display = 'block';
  }
}

// Add user info after authentication (for OAuth)
function loadUserInfo() {
  const user = localStorage.getItem('discord_user');
  if (user) {
    document.querySelector('.message-box h1').textContent = `Welcome, ${user}`;
  }
}

// Current Raid Status and Page Routes
const currentRaid = {
  "snow_island": "Not started",
  "jungle_island": "Not started",
  "dedu_island": "Not started"
};

const raidTimes = {
  "dedu_island": { start: 15, end: 29 },
  "snow_island": { start: 30, end: 44 },
  "jungle_island": { start: 15, end: 29 },
};

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

app.get('/current_raid', (req, res) => {
  res.json({ current_raid: currentRaid });
});

app.get('/current_raid_page', (req, res) => {
  const activeRaids = getCurrentRaid();
  const raidStatus = activeRaids.length > 0 ? 'In Progress' : 'Not started';

  const raidStatusDict = {
    "dedu_island": raidStatus,
    "snow_island": raidStatus,
    "jungle_island": raidStatus
  };

  res.render('current_raid', {
    currentTime: new Date().toLocaleTimeString(),
    raidStatus: raidStatusDict
  });
});

// Call the function to load the user info
loadUserInfo();
