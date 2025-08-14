from flask import Flask, jsonify

app = Flask(__name__)

# Dummy user data for demonstration purposes
user_data = {
    "123456789": {"balance": 1000},
    "987654321": {"balance": 2000},
    "112233445": {"balance": 1500},
    # Add more users as needed
}

@app.route("/api/leaderboard")
def leaderboard():
    sorted_users = sorted(user_data.items(), key=lambda x: x[1].get("balance", 0), reverse=True)
    top_users = sorted_users[:10]
    leaderboard_data = []

    for idx, (user_id, user_info) in enumerate(top_users, 1):
        balance = user_info.get("balance", 0)  
        name = f"User {user_id}"  # Replace with fetching actual user name if available
        leaderboard_data.append({
            "rank": idx,
            "name": name,
            "balance": balance
        })

    return jsonify(leaderboard_data)

if __name__ == "__main__":
    app.run(debug=True)

// Function to show a specific page and hide others
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.style.display = 'none');

    // Show the selected page
    const selectedPage = document.getElementById(pageId);
    selectedPage.style.display = 'block';

    // If the selected page is 'leaderboard', fetch and display leaderboard data
    if (pageId === 'leaderboard') {
        fetchLeaderboard();
    }
}

// Function to fetch and display the leaderboard
function fetchLeaderboard() {
    fetch('/api/leaderboard')
        .then(response => response.json())
        .then(data => {
            const leaderboardContainer = document.getElementById('leaderboard-container');
            leaderboardContainer.innerHTML = ''; // Clear previous content

            if (data.length === 0) {
                leaderboardContainer.innerHTML = '<p>No leaderboard data available.</p>';
                return;
            }

            data.forEach(user => {
                const userElement = document.createElement('div');
                userElement.classList.add('leaderboard-item');
                userElement.innerHTML = `
                    <p><strong>Rank ${user.rank}:</strong> ${user.name} - <strong>${user.balance}</strong> Celestials</p>
                `;
                leaderboardContainer.appendChild(userElement);
            });
        })
        .catch(error => {
            console.error('Error fetching leaderboard:', error);
        });
}

// Example of page switching logic
document.getElementById('leaderboard').addEventListener('show', fetchLeaderboard);
