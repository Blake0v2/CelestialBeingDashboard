// In callback.html (or script in dashboard.html)
const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');

if (code) {
    const tokenRequest = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            client_id: '1404595445275164804',
            client_secret: 'GYQLIfibrg7cBDkirmcfAATsFrsgL-00',
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: 'https://blake0v2.github.io/CelestialBeingDashboard/dashboard.html',
            scope: 'identify'
        })
    });

    const data = await tokenRequest.json();
    const accessToken = data.access_token;

    // Fetch user data
    const userRequest = await fetch('https://discord.com/api/v10/users/@me', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    const userData = await userRequest.json();
    
    // Save user data to localStorage
    localStorage.setItem('discordUser', JSON.stringify(userData));

    // Redirect to the dashboard
    window.location.href = 'dashboard.html';
}

// Function to show a specific page and hide others
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.style.display = 'none');
    pages.forEach(page => {
        page.style.display = 'none';
    });

    // Show the selected page
    const selectedPage = document.getElementById(pageId);
    selectedPage.style.display = 'block';
    if (selectedPage) {
        selectedPage.style.display = 'block';
    }
}
