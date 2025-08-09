document.addEventListener('DOMContentLoaded', () => {
  // Handle button clicks to show corresponding sections
  const showDashboardButton = document.getElementById('show-dashboard');
  const showRaidButton = document.getElementById('show-raid');
  const showCommandsButton = document.getElementById('show-commands');
  const showLeaderboardButton = document.getElementById('show-leaderboard');

  const dashboardSection = document.getElementById('dashboard');
  const currentRaidSection = document.getElementById('current_raid');
  const commandsSection = document.getElementById('commands');
  const leaderboardSection = document.getElementById('leaderboard');

  showDashboardButton.addEventListener('click', () => {
    hideAllSections();
    dashboardSection.style.display = 'block';
  });

  showRaidButton.addEventListener('click', () => {
    hideAllSections();
    currentRaidSection.style.display = 'block';
  });

  showCommandsButton.addEventListener('click', () => {
    hideAllSections();
    commandsSection.style.display = 'block';
  });

  showLeaderboardButton.addEventListener('click', () => {
    hideAllSections();
    leaderboardSection.style.display = 'block';
  });

  function hideAllSections() {
    dashboardSection.style.display = 'none';
    currentRaidSection.style.display = 'none';
    commandsSection.style.display = 'none';
    leaderboardSection.style.display = 'none';
  }
});
