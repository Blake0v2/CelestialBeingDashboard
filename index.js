function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.style.display = 'none');

    // Show the selected page
    const selectedPage = document.getElementById(pageId);
    selectedPage.style.display = 'block';

    // Update Dashboard username and avatar dynamically
    if (pageId === 'dashboard') {
        const username = "User"; // Replace with actual username from Discord OAuth
        const avatarURL = "https://i.postimg.cc/Pr31Rx40/Here-is-a-non-realistic-profile-picture-in-a-gold-white-and-blue-theme-inspired-by-an-Archangel.png"; // Replace with the actual avatar URL from Discord OAuth
        document.getElementById('username').textContent = username;
        document.getElementById('user-avatar').innerHTML = `<img src="${avatarURL}" alt="User Avatar">`;
    }
}
