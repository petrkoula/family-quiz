# 🎯 Family Quiz

Interactive photo quiz application with real-time team participation. Perfect for family gatherings, parties, corporate events, or educational settings.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0-brightgreen.svg)

## ✨ Features

### 🖼️ Presentation Mode
- **23 Vintage Family Photos** with custom Czech quiz questions
- **Fullscreen Support** for projector/TV displays
- **Smooth Navigation** with keyboard controls
- **Question Cycling** - one question at a time with visual progress dots
- **Answer Reveal** with beautiful animations

### 📱 Team Participation (Server Mode)
- **QR Code Access** - teams join instantly via phone
- **Real-time Sync** - questions appear on all devices simultaneously
- **Automatic Scoring** - points awarded for correct answers
- **Live Leaderboard** - see team rankings update in real-time
- **Admin Dashboard** - monitor all responses and export results

### 🎨 Design Highlights
- Clean, minimalist interface
- High-contrast colors for projector visibility
- Large, readable fonts (optimized for distance viewing)
- Touch-friendly mobile interface
- Smooth animations and transitions

## 🚀 Quick Start

### Standalone Mode (No Teams)

Perfect for simple presentations without audience participation.

```bash
# Just open in browser
open index.html
```

### Server Mode (With Teams)

Enable real-time team participation via QR codes.

**Prerequisites:**
- Node.js 14.0 or higher ([Download](https://nodejs.org/))

**Setup:**
```bash
# 1. Install dependencies
install.bat          # Windows
# or
npm install          # Mac/Linux

# 2. Start server
start-server.bat     # Windows
# or
node server.js       # Mac/Linux
```

**Access:**
- 🎬 **Presenter**: http://localhost:3000/index.html
- 📱 **Teams**: http://localhost:3000/team.html (or scan QR code)
- 📊 **Admin**: http://localhost:3000/admin.html

## 🎮 Controls

### Presenter Controls

| Key | Action | When Available |
|-----|--------|----------------|
| **SPACE** | Show/hide questions | Always |
| **← →** | Previous/next photo | Questions hidden |
| **↑ ↓** | Previous/next question | Questions visible |
| **A** | Reveal correct answer | Questions visible |
| **F** | Toggle fullscreen | Always |
| **ESC** | Exit fullscreen/hide questions | Context |

### Mobile Team Interface

- **Tap** to select answer
- **Submit** button to send response
- See your **score** update automatically
- **Progress dots** show question number

## 📖 How It Works

### Presentation Flow

```
1. 🖼️  Show photo (fullscreen)
2. ⌨️  Press SPACE → questions appear (photo 1/3, questions 2/3)
3. 📱 Teams see question on phones
4. ⏱️  Teams submit answers
5. ⌨️  Press A → reveal correct answer
6. ✅ Points auto-awarded
7. ⌨️  Press ↓ → next question
8. 🔁 Repeat for 3 questions
9. ⌨️  Press SPACE → hide questions
10. ⌨️ Press → → next photo
```

### Architecture

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│  Presenter  │◄───────►│   Node.js    │◄───────►│    Teams    │
│  (Browser)  │ Socket  │   Server     │ Socket  │  (Mobile)   │
└─────────────┘         └──────────────┘         └─────────────┘
                              ▲
                              │ Socket.io
                              ▼
                        ┌──────────────┐
                        │ Admin Panel  │
                        └──────────────┘
```

## 🛠️ Configuration

### Edit Questions

Questions are embedded in `app.js`:

```javascript
const quizData = [
  {
    "image": "IMG_4246_1.jpg",
    "questions": [
      {
        "text": "Your question in Czech?",
        "options": ["A", "B", "C", "D"],
        "correct": 0  // Index of correct answer
      }
      // ... 2 more questions
    ]
  }
  // ... 22 more photos
]
```

### Change Server Port

Edit `server.js`:
```javascript
const PORT = 3000;  // Change to your preferred port
```

### Add More Photos

1. Add images to `/images` folder
2. Add quiz entry in `app.js`
3. Restart server

## 📁 Project Structure

```
family-quiz/
├── images/              # 23 vintage family photos
├── index.html           # Presenter interface
├── team.html            # Mobile team interface
├── admin.html           # Admin dashboard
├── app.js               # Presenter logic & quiz data
├── styles.css           # Styling
├── server.js            # Node.js WebSocket server
├── package.json         # Dependencies
├── install.bat          # Windows installer
├── start-server.bat     # Windows server launcher
├── README.md            # This file
├── README-SERVER.md     # Detailed server setup
└── PRD.md               # Product requirements doc
```

## 📊 Admin Panel Features

- **📈 Live Leaderboard** - Teams ranked by score
- **📝 Response Monitor** - See who answered what
- **📋 Full History** - All responses with timestamps
- **💾 CSV Export** - Download results for analysis

## 🌐 Network Setup

### For Local Network (WiFi)

1. **Start server** with `start-server.bat`
2. **Note the network IP** displayed in console:
   ```
   Network: http://192.168.1.105:3000
   ```
3. **Teams scan QR code** or visit that URL
4. **Ensure same WiFi** - all devices on same network
5. **Check firewall** - allow port 3000 if needed

### Finding Your IP

**Windows:**
```cmd
ipconfig
```
Look for "IPv4 Address"

**Mac/Linux:**
```bash
ifconfig | grep inet
```

## 🔧 Troubleshooting

### Server won't start
- ✅ Check Node.js installed: `node --version`
- ✅ Run `install.bat` to install dependencies
- ✅ Check port 3000 not already in use

### Teams can't connect
- ✅ Verify same WiFi network
- ✅ Check Windows Firewall allows Node.js
- ✅ Try disabling antivirus temporarily
- ✅ Verify correct IP address

### QR code not showing
- ✅ Must use server mode (`start-server.bat`)
- ✅ Check browser console (F12) for errors
- ✅ Verify Socket.io loaded correctly

## 📚 Documentation

- **[README-SERVER.md](README-SERVER.md)** - Detailed server setup guide
- **[PRD.md](PRD.md)** - Complete product requirements document
- **In-app help** - Press `?` (future feature)

## 🤝 Contributing

This is a family project, but feel free to fork and adapt for your own use!

## 📄 License

MIT License - feel free to use and modify.

## 🎉 Credits

- **Questions**: AI-generated based on real family photos
- **Photos**: Private family collection (23 vintage photos from 60s-80s)
- **Technology**: Vanilla JS, Socket.io, Node.js
- **Design**: Custom CSS with gradient backgrounds

## 💡 Use Cases

- 🏠 **Family Reunions** - Quiz about family history
- 🎉 **Parties** - Interactive entertainment
- 🏢 **Corporate Events** - Team building activity
- 🎓 **Education** - Classroom engagement tool
- 🎪 **Events** - Audience participation game

---

**Made with ❤️ for interactive family fun**

For technical specifications and implementation in other technologies, see [PRD.md](PRD.md)
