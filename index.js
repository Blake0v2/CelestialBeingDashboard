// This code will handle the OAuth2 flow and update the user info on the dashboard page

// Get the "code" from the URL (the code parameter is passed after the user authorizes Discord)
const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');

// Check if the code is available in the URL (this happens when Discord redirects back to the dashboard)
if (code) {
    // Send the code to your backend to exchange for an access token and get user data
    fetch('http://localhost:3000/callback?code=' + code) // Call your backend's callback route
        .then(response => response.json()) // Expect JSON response
        .then(data => {
            // Extract the username and avatar URL from the JSON response
            const username = data.username;
            const avatarUrl = data.avatarUrl;

            // Dynamically set the username and avatar on the page
            document.getElementById('username').textContent = username; // Update the username element
            document.getElementById('user-avatar-img').src = avatarUrl; // Update the avatar image element
        })
        .catch(error => {
            console.error('Error fetching user data:', error); // Log any error
        });
} else {
    console.error('No code parameter found in the URL'); // In case the code is missing (shouldn't happen if redirect works correctly)
}

// Function to show a specific page and hide others
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.style.display = 'none');

    // Show the selected page
    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.style.display = 'block';
    }
}

