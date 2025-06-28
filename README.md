# Chat Box

A minimalist real-time chat application featuring a clean UI and seamless messaging experience.

## 🚀 Features
- **Real-time messaging** — Fast, bidirectional chat using WebSockets.
- **Minimalist design** — Built with Next.js and Tailwind CSS for a sleek, responsive interface.
- **Robust backend** — Fastify-powered server handles user connections and message broadcasting.
- **Open-source** — View code, report issues, and contribute at [github.com/ismailassil/chat-box](https://github.com/ismailassil/chat-box).

## 🛠️ Tech Stack
- **Frontend**: Next.js, React, Tailwind CSS  
- **Backend**: Fastify, WebSocket  
- **Other**: JavaScript, TypeScript

## 📦 Getting Started

### Prerequisites
- Node.js (v14+ recommended)
- npm or yarn

### Install & Run
1. Clone the repo:
```bash
git clone https://github.com/ismailassil/chat-box.git
cd chat-box
```

2. Install dependencies:

```bash
npm install
```

3. Start the dev server:

```bash
npm run dev
```

4. Open your browser and go to:

```
    http://localhost:3000
```

💡 How It Works

    The frontend (Next.js) connects to the Fastify backend through WebSockets.

    The server listens for messages and broadcasts them to all connected clients.

    The UI is kept minimal and responsive for a distraction-free chatting experience.
