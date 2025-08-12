// OAuth2 Authentication
window.onload = function() {
  // Check if the user is authenticated
  const user = localStorage.getItem('discord_user');
  
  if (!user) {
    // If no user info, redirect to OAuth2 for authentication
    window.location.href = 'https://discord.com/oauth2/authorize?client_id=1404595445275164804&response_type=code&redirect_uri=https%3A%2F%2Fblake0v2.github.io%2FTheArchAngels%2Fdashboard.html&scope=identify+guilds+applications.commands.permissions.update+connections';
  } else {
    // If user is authenticated, load their info
    loadUserInfo(user);
  }
};

// Add user info after authentication (for OAuth)
function loadUserInfo(user) {
  document.querySelector('.message-box h1').textContent = `Welcome, ${user}`;
}

// Save user info after OAuth2 authentication
function handleOAuth2Callback() {
  // Check if there's an 'code' parameter in the URL (which means OAuth2 has redirected here)
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  
  if (code) {
    // Exchange the OAuth2 code for an access token and fetch user info
    fetch(`https://discord.com/api/v10/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: '1404595445275164804',
        client_secret: 'eWrP3MUeY5hGA7_gJR7rWUoPSv7FzZsP',  // You need to replace this with your client secret
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: 'https://blake0v2.github.io/TheArchAngels/dashboard.html',
        scope: 'identify',
      }),
    })
    .then(response => response.json())
    .then(data => {
      // Use the access token to fetch the user's Discord info
      const accessToken = data.access_token;
      fetch('https://discord.com/api/v10/users/@me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
      .then(response => response.json())
      .then(userData => {
        // Save user info to localStorage
        localStorage.setItem('discord_user', userData.username);
        // Reload the page to show the authenticated user's data
        window.location.reload();
      });
    });
  }
}

// Call the function to handle OAuth2 callback if needed
if (window.location.search.includes('code=')) {
  handleOAuth2Callback();
}

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
