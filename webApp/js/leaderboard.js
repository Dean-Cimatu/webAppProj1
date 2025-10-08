// Leaderboard Handler
document.addEventListener('DOMContentLoaded', function() {
    loadLeaderboard();
});

function loadLeaderboard() {
    const leaderboardData = auth.getLeaderboard();
    const mainContent = document.querySelector('.main-content');
    
    if (mainContent && leaderboardData.length > 0) {
        // Create leaderboard table
        const leaderboardHTML = `
            <div id="leaderboard">
                <table class="leaderboard-table">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Player</th>
                            <th>High Score</th>
                            <th>Games Played</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${leaderboardData.map((player, index) => `
                            <tr class="${index < 3 ? 'top-three' : ''}">
                                <td class="rank">${index + 1}</td>
                                <td class="username">${player.username}</td>
                                <td class="score">${player.highScore}</td>
                                <td class="games">${player.gamesPlayed}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
        
        // Insert after the h1 title
        const h1 = mainContent.querySelector('h1');
        if (h1) {
            h1.insertAdjacentHTML('afterend', leaderboardHTML);
        }
        
        // Add CSS styles for the leaderboard table
        addLeaderboardStyles();
    } else if (mainContent) {
        // No data available message
        const h1 = mainContent.querySelector('h1');
        if (h1) {
            h1.insertAdjacentHTML('afterend', `
                <div id="leaderboard">
                    <p style="text-align: center; color: gold; font-size: 1.2em; margin: 20px;">
                        No players have registered yet. Be the first to play!
                    </p>
                </div>
            `);
        }
    }
}

function addLeaderboardStyles() {
    // Check if styles are already added
    if (document.getElementById('leaderboard-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'leaderboard-styles';
    style.textContent = `
        .leaderboard-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            font-family: 'Pickyside', monospace;
            background: rgba(0, 0, 0, 0.7);
            border-radius: 10px;
            overflow: hidden;
        }
        
        .leaderboard-table th {
            background: rgba(128, 0, 0, 0.8);
            color: gold;
            padding: 15px;
            text-align: center;
            font-weight: bold;
            border-bottom: 2px solid gold;
        }
        
        .leaderboard-table td {
            padding: 12px 15px;
            text-align: center;
            color: white;
            border-bottom: 1px solid rgba(255, 215, 0, 0.3);
        }
        
        .leaderboard-table tr:hover {
            background: rgba(255, 215, 0, 0.1);
        }
        
        .leaderboard-table .top-three {
            background: rgba(255, 215, 0, 0.2);
        }
        
        .leaderboard-table .rank {
            font-weight: bold;
            font-size: 1.2em;
        }
        
        .leaderboard-table .top-three .rank {
            color: gold;
        }
        
        .leaderboard-table .username {
            font-weight: bold;
        }
        
        .leaderboard-table .score {
            color: #90EE90;
            font-weight: bold;
        }
    `;
    
    document.head.appendChild(style);
}