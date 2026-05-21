# Cloud Code Editor

A web-based IDE clone built with React, Vite, Node.js, Socket.IO, and Xterm.js.

## Features
- **File Explorer**: Create, delete, and view files in a remote workspace.
- **Code Editor**: Real-time code editing using Monaco Editor.
- **Terminal**: Integrated PowerShell terminal for running backend commands.
- **Modern UI**: Polished, dark-themed UI matching popular code editors.

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation

1. Clone the repository
2. Install dependencies for the backend:
   ```bash
   cd backend
   npm install
   ```
3. Install dependencies for the frontend:
   ```bash
   cd frontend
   npm install
   ```

### Running the App

Start the backend:
```bash
cd backend
npm run dev
```

Start the frontend (in a separate terminal):
```bash
cd frontend
npm run dev
```

Open your browser to `http://localhost:5173/coding/?replId=myworkspace` to see the editor in action.
