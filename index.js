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

// Optional: If you want the "Commands" page to be displayed by default when the page loads
document.addEventListener('DOMContentLoaded', () => {
    showPage('dashboard'); // Change to 'commands' if you want the Commands page to open by default
});
