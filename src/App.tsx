import React from "react";

const App: React.FC = () => {
    return (
        <div className="app-root">
            <div
                style={{
                    margin: "auto",
                    textAlign: "center",
                    padding: "2rem",
                }}
                >
                    <h1>Windborne Balloon Explorer (WIP)</h1>
                    <p>
                        Scaffold is working. Next step: hook up live balloon data, map, and leaderboard.
                    </p>
            </div>
        </div>
    );
};

export default App;