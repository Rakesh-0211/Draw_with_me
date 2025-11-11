# 🎨 Collaborative Canvas (Draw With Me)

A real-time collaborative drawing app built with **Node.js**, **Socket.IO**, and **Vanilla JavaScript**, allowing multiple users to draw together on a shared canvas — live and in sync.

---

## 🚀 Live Demo
https://draw-with-me-h09i.onrender.com/

---

## 🧩 Features

- Real-time collaborative drawing using WebSockets (Socket.IO)
- Multiple users can draw together live
- Brush and eraser tools
- Adjustable stroke width and color
- Undo / Redo for previous actions
- Clear Canvas — wipes the board globally
- Online user list with unique colors
- Responsive design for both desktop and mobile
- Clean modern UI with pure CSS

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Node.js, Express.js |
| Realtime Engine | Socket.IO |
| Deployment | Render |

---

## 🗂️ Project Structure

```
Draw_with_me/
├── client/
│   ├── index.html
│   ├── style.css
│   ├── canvas.js
│   ├── websocket.js
│   └── main.js
│
├── server/
│   ├── server.js
│   ├── rooms.js
│   └── drawing-state.js
│
├── package.json
└── README.md
```

---

## ⚙️ Installation & Local Setup

```
git clone https://github.com/Rakesh-0211/Draw_with_me.git
cd Draw_with_me
npm install
npm start
```

Then open:
```
http://localhost:3000
```

---

## 🌐 Deployment (Render)

1. Push your project to GitHub  
2. Go to https://render.com  
3. Create a **New Web Service**  
4. Connect your GitHub repo  
5. Set:
   - **Build Command:** npm install  
   - **Start Command:** node server/server.js  
6. Click **Deploy**

Your deployed link:
```
https://draw-with-me-h09i.onrender.com/
```

---

## 🧠 How It Works

- Each connected user joins a shared Socket.IO room.  
- Drawing actions (start, move, end) are broadcast live to all users.  
- The server maintains global drawing state for undo, redo, and clear.  
- Each client continuously re-renders updates in real time using `<canvas>`.

---

## 💻 Socket Events Summary

| Event | Direction | Description |
|--------|------------|-------------|
| presence:join | client → server | user joins a drawing room |
| cursor:update | client → server | send live cursor position |
| stroke:start / stroke:point / stroke:end | both | handle drawing in real time |
| op:undo / op:redo | client → server | undo or redo last stroke |
| canvas:clear | client → server | clear the board globally |
| state:replace | server → client | broadcast updated drawing state |

---

## 🎨 UI Overview

- Left sidebar: Drawing tools, color picker, width slider, undo/redo/clear buttons, online users.  
- Right canvas area: Shared real-time drawing space.  
- Fully responsive on desktop and mobile.  
- Smooth dark UI with blue accent color scheme.

---

## 💡 Use Cases

- Collaborative whiteboard  
- Classroom sketch tool  
- Remote brainstorming  
- Multiplayer drawing app  

---

## 🤝 Contributing

```
1. Fork the repository
2. Create a new branch: git checkout -b feature-name
3. Make your changes and commit: git commit -m "Add new feature"
4. Push to your fork: git push origin feature-name
5. Create a Pull Request
```

---

## 🧾 License

Licensed under the **MIT License** — feel free to use and modify.

---

## 👨‍💻 Author

**Rakesh-0211**  
GitHub: https://github.com/Rakesh-0211/Draw_with_me  
Project Deployment: https://draw-with-me-h09i.onrender.com/

---

> “Creativity is allowing yourself to make mistakes. Art is knowing which ones to keep.”
