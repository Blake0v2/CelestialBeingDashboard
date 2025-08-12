function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.style.display = 'none');

    // Show the selected page
    const selectedPage = document.getElementById(pageId);
    selectedPage.style.display = 'block';

    // Update Dashboard username and avatar dynamically (example)
    if (pageId === 'dashboard') {
        const username = "Blake0_o"; // Replace with actual username from Discord OAuth
        const avatarURL = "https://i.postimg.cc/GhC7KjR7/Hunter-XHunter-GIF-ezgif-com-effects.gif"; // Replace with the actual avatar URL from Discord OAuth
        document.getElementById('username').textContent = username;
        document.getElementById('user-avatar').innerHTML = `<img src="${avatarURL}" alt="User Avatar">`;
    }
}
