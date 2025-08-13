from flask import Flask, jsonify
import discord

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

