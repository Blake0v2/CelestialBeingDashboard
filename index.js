function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.style.display = 'none');

    // Show the selected page
    const selectedPage = document.getElementById(pageId);
    selectedPage.style.display = 'block';

    // Update Dashboard username dynamically (example)
    if (pageId === 'dashboard') {
        const username = "User"; // This should come from the Discord OAuth data
        document.getElementById('username').textContent = username;
    }
}
