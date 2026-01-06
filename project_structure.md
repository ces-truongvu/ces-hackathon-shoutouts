# Project Structure: EOS Shout-Out Mattermost Plugin

This project follows the standard Mattermost Plugin architecture, separating the React webapp from the Node.js/Go server logic.

```
eos-shoutout-plugin/
├── plugin.json                 # Manifest file (ID, version, permissions)
├── server/                     # Backend Logic (Go or Node.js)
│   ├── main.go                 # Plugin entry point (API hooks)
│   ├── store/                  # SQLite database interactions
│   ├── bot/                    # Bot notification logic
│   └── api/                    # REST API endpoints (/api/v1/shoutouts)
├── webapp/                     # Frontend (React 18)
│   ├── src/
│   │   ├── index.tsx           # Entry point (registerPlugin)
│   │   ├── components/         # Atomic UI Components
│   │   │   ├── RecognitionWizard.tsx
│   │   │   ├── StreakFire.tsx
│   │   │   ├── Leaderboard.tsx
│   │   │   ├── DuoButton.tsx
│   │   │   └── OwlMascot.tsx
│   │   ├── styles/
│   │   │   └── main.css        # Global styles
│   │   ├── types/
│   │   │   └── index.ts        # TypeScript interfaces
│   │   ├── utils/
│   │   │   └── theme.ts        # Central Theme Configuration
│   │   └── App.tsx             # Main Root Component
│   ├── package.json
│   └── webpack.config.js
└── assets/                     # Static assets (icon, profile images)
```