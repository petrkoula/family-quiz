# Product Requirements Document (PRD)
## Photo Quiz - Interactive Team Quiz Application

**Version:** 1.0
**Date:** 2026-06-10
**Status:** Implemented
**Technology Stack:** HTML/CSS/JavaScript, Node.js, Socket.io

---

## 1. Executive Summary

Photo Quiz is an interactive presentation application that displays photos with accompanying quiz questions to an audience. The system supports real-time team participation via mobile devices, automatic scoring, and live leaderboard tracking. Designed for both standalone presentation mode and collaborative team quiz mode.

---

## 2. Product Overview

### 2.1 Core Functionality

- **Presenter Mode**: Full-screen photo presentation with quiz questions
- **Team Mode**: Mobile interface for teams to submit answers via QR code
- **Admin Panel**: Real-time monitoring of responses and team scores
- **Offline Support**: Works standalone without server for basic presentations

### 2.2 Use Cases

1. **Family gatherings**: Interactive quiz about family photos
2. **Corporate events**: Team-building quizzes
3. **Educational settings**: Interactive classroom quizzes
4. **Parties/Events**: Entertainment with competitive scoring

---

## 3. Functional Requirements

### 3.1 Presenter Application

#### 3.1.1 Photo Display
- **Initial State**: Photo displayed fullscreen (100% viewport), centered
- **Photo Format**: Support for JPG/PNG images
- **Photo Count**: 23 photos in collection
- **Photo Source**: Local `/images` folder with sequential naming
- **Transition**: Smooth transitions between photos

#### 3.1.2 Questions Display
- **Trigger**: Spacebar key press
- **Layout Transition**:
  - Photo shrinks to 33.33% width (left side)
  - Questions appear on 66.67% width (right side)
- **Questions per Photo**: Exactly 3 questions
- **Question Cycling**: Navigate between questions using arrow up/down keys
- **Single Question Display**: Only one question visible at a time
- **Progress Indicator**: Visual dot indicator showing current question (1/3, 2/3, 3/3)

#### 3.1.3 Question Format
```javascript
{
  "text": "Question text in Czech",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct": 0  // Index of correct answer (0-based)
}
```

- **Language**: Czech (cs-CZ)
- **Options**: 2-4 answer choices per question
- **Answer Display**: Grid layout, 2 columns
- **Font**: Arial/Helvetica for readability
- **Font Sizes**:
  - Question text: 2.4rem (bold)
  - Answer options: 1.8rem
  - Correct answer: 2.0rem (highlighted)

#### 3.1.4 Keyboard Controls

| Key | Action | Condition |
|-----|--------|-----------|
| **Spacebar** | Toggle show/hide questions | Always available |
| **← (Left)** | Previous photo | Only when questions hidden |
| **→ (Right)** | Next photo | Only when questions hidden |
| **↑ (Up)** | Previous question | Only when questions visible |
| **↓ (Down)** | Next question | Only when questions visible |
| **A** | Reveal correct answer | Only when questions visible |
| **F** | Toggle fullscreen | Always available |
| **ESC** | Hide questions or exit fullscreen | Context-dependent |

#### 3.1.5 Answer Reveal
- **Visual Treatment**:
  - Green background (#48bb78)
  - White text
  - Checkmark symbol (✓)
  - Scale transformation (1.05x)
  - Shadow effect for emphasis
- **Trigger**: 'A' key press
- **Effect**: Highlights correct answer, triggers scoring in server mode

### 3.2 Server Mode (Team Participation)

#### 3.2.1 Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│   Presenter     │◄───────►│   Node.js        │◄───────►│   Team Devices  │
│   (Browser)     │ Socket  │   Server         │ Socket  │   (Mobile)      │
│                 │         │   (Port 3000)    │         │                 │
└─────────────────┘         └──────────────────┘         └─────────────────┘
                                     ▲
                                     │ Socket
                                     ▼
                            ┌──────────────────┐
                            │   Admin Panel    │
                            │   (Browser)      │
                            └──────────────────┘
```

#### 3.2.2 Server Requirements
- **Technology**: Node.js (v14+)
- **Framework**: Express.js
- **Real-time Communication**: Socket.io
- **Port**: 3000 (configurable)
- **Network**: Local WiFi network

#### 3.2.3 Team Registration
- **Input**: Team name (max 30 characters)
- **Validation**: Non-empty string required
- **Storage**: Server maintains team registry
- **Socket Mapping**: Each team associated with unique socket ID

#### 3.2.4 QR Code Integration
- **Display**: Top-right corner of presenter screen (when server running)
- **Content**: URL to team interface (`http://[IP]:3000/team.html`)
- **Library**: qrcode.js
- **Size**: 200x200 pixels
- **Colors**: Purple (#667eea) on white

#### 3.2.5 Game State Synchronization

Server broadcasts state changes:
```javascript
{
  currentPhotoIndex: 0,       // Current photo (0-22)
  currentQuestionIndex: 0,    // Current question (0-2)
  questionsVisible: false     // Questions visibility
}
```

**State Changes**:
- Photo navigation (← →)
- Question navigation (↑ ↓)
- Question visibility toggle (Spacebar)

#### 3.2.6 Answer Submission Flow

1. **Team sees question** (auto-synchronized from presenter)
2. **Team selects answer** (single-choice from options)
3. **Team submits answer** (button click)
4. **Server receives**:
```javascript
{
  photoIndex: 5,
  questionIndex: 2,
  answer: 1  // Selected option index
}
```
5. **Server stores** response with timestamp
6. **Admin panel updates** in real-time

#### 3.2.7 Scoring System

- **Points**: 1 point per correct answer
- **Timing**: Scored when presenter reveals answer (presses 'A')
- **Calculation**: Server compares team answer to correct answer
- **Update**: Scores broadcast to all clients immediately
- **Persistence**: Maintained in server memory (session-based)

### 3.3 Team Interface (Mobile)

#### 3.3.1 Registration Screen
- **Fields**: Team name input
- **Button**: "Připojit se" (Join)
- **Validation**: Client-side check for empty input
- **Transition**: Auto-hide after successful registration

#### 3.3.2 Quiz Interface

**Status Indicators**:
```
⏳ Čekáme na další otázku... (Waiting - yellow)
✅ Odpovězte na otázku! (Active - green)
✓ Odpověď odeslána! (Submitted - blue)
```

**Layout**:
- Team score display (top)
- Photo number indicator (e.g., "Fotka 5 / 23")
- Question progress dots (3 dots, current highlighted)
- Question text (large, centered)
- Answer options (vertical buttons)
- Submit button (disabled until answer selected)

#### 3.3.3 Answer Selection
- **Interaction**: Tap/click answer button
- **Visual Feedback**: Selected answer highlighted (purple background)
- **Single Selection**: Previous selection automatically deselected
- **Submit Button**: Enabled only when answer selected

#### 3.3.4 Responsive Design
- **Target Devices**: Mobile phones (iOS/Android)
- **Breakpoint**: 768px
- **Touch-friendly**: Minimum 44x44px touch targets
- **Font Scaling**: Larger fonts for mobile readability

### 3.4 Admin Panel

#### 3.4.1 Current Question Display
- **Status Badge**: "✅ Otázka aktivní" or "Čeká se na otázku"
- **Question Text**: Full question displayed
- **Photo/Question Numbers**: "Fotka X / 23 | Otázka Y / 3"
- **Styling**: Purple gradient background

#### 3.4.2 Leaderboard
- **Sorting**: Descending by score
- **Display**:
  - Rank number
  - Team name
  - Current score
- **Update Frequency**: Real-time via WebSocket
- **Empty State**: "Zatím nejsou připojené žádné týmy"

#### 3.4.3 Current Responses
- **Display**: Teams that answered current question
- **Information**:
  - Team name
  - Answer selected (by number)
- **Status**: "Pending" badge
- **Reset**: Clears when moving to next question

#### 3.4.4 Response History
- **Table Columns**:
  - Team name
  - Photo number
  - Question number
  - Answer given
  - Timestamp
- **Ordering**: Most recent first
- **Pagination**: N/A (scrollable)

#### 3.4.5 Export Functionality
- **Format**: CSV (Comma-Separated Values)
- **Filename**: `quiz-vysledky-YYYY-MM-DD.csv`
- **Content**:
```csv
Pořadí,Tým,Skóre
1,"Team Name",15
2,"Another Team",12
```
- **Trigger**: "📊 Export výsledků" button
- **Download**: Browser download prompt

---

## 4. Technical Specifications

### 4.1 Data Structure

#### 4.1.1 Quiz Data Format (quiz-data.json or embedded in app.js)
```javascript
const quizData = [
  {
    "image": "IMG_4246_1.jpg",
    "questions": [
      {
        "text": "Question in Czech?",
        "options": ["A", "B", "C", "D"],
        "correct": 0
      },
      {
        "text": "Second question?",
        "options": ["A", "B", "C"],
        "correct": 1
      },
      {
        "text": "Third question?",
        "options": ["A", "B"],
        "correct": 0
      }
    ]
  }
  // ... 22 more photos
]
```

#### 4.1.2 Server State Schema
```javascript
{
  currentPhotoIndex: 0,
  currentQuestionIndex: 0,
  questionsVisible: false,
  teams: {
    [socketId]: {
      name: "Team Name",
      score: 0,
      responses: []
    }
  },
  responses: {
    "0-0": {  // photoIndex-questionIndex
      [socketId]: {
        teamName: "Team Name",
        answer: 1,
        timestamp: 1234567890
      }
    }
  }
}
```

### 4.2 WebSocket Events

#### 4.2.1 Client → Server

| Event | Payload | Description |
|-------|---------|-------------|
| `registerTeam` | `"Team Name"` | Team registration |
| `submitAnswer` | `{photoIndex, questionIndex, answer}` | Answer submission |
| `updateGameState` | `{currentPhotoIndex, currentQuestionIndex, questionsVisible}` | Presenter state update |
| `revealAnswer` | `{photoIndex, questionIndex, correctAnswer}` | Trigger scoring |

#### 4.2.2 Server → Client

| Event | Payload | Description |
|-------|---------|-------------|
| `gameState` | `{currentPhotoIndex, currentQuestionIndex, questionsVisible}` | Game state broadcast |
| `teamsUpdate` | `{[socketId]: {...}}` | Team list and scores |
| `responseUpdate` | `{photoIndex, questionIndex, responses}` | New answer received |
| `answerRevealed` | `{photoIndex, questionIndex, correctAnswer}` | Correct answer revealed |

### 4.3 File Structure
```
/quiz
  /images/
    IMG_4246_1.jpg ... IMG_4246_23.jpg
  /node_modules/        (gitignored)
  .gitignore
  index.html            # Presenter
  app.js                # Presenter logic
  styles.css            # Presenter styles
  team.html             # Team interface
  admin.html            # Admin panel
  server.js             # Node.js server
  package.json          # Dependencies
  quiz-data.json        # Question data (optional)
  install.bat           # Installation script
  start-server.bat      # Server startup script
  README.md             # Basic documentation
  README-SERVER.md      # Server setup guide
  PRD.md                # This document
```

### 4.4 Dependencies (package.json)
```json
{
  "dependencies": {
    "express": "^4.18.2",     // Web server
    "socket.io": "^4.6.1",    // WebSocket
    "qrcode": "^1.5.3"        // QR code generation
  }
}
```

### 4.5 Browser Compatibility
- **Chrome/Edge**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Mobile Safari**: iOS 14+
- **Chrome Mobile**: Android 5+

---

## 5. UI/UX Requirements

### 5.1 Design Principles
- **Minimalist**: Clean interface, focus on content
- **High Contrast**: Readable from distance (projector/TV)
- **Touch-Friendly**: Mobile interface optimized for fingers
- **Accessible**: Large fonts, clear visual hierarchy

### 5.2 Color Palette
- **Primary**: `#667eea` (Purple)
- **Secondary**: `#764ba2` (Dark Purple)
- **Success**: `#48bb78` (Green)
- **Warning**: `#fef3c7` (Yellow background)
- **Info**: `#dbeafe` (Blue background)
- **Gray Scale**: `#f8f9fa`, `#e2e8f0`, `#cbd5e0`

### 5.3 Typography
- **Font Family**: Arial, Helvetica, sans-serif
- **Question Text**: 2.4rem, bold
- **Answer Options**: 1.8rem, semi-bold
- **UI Text**: 1.1-1.4rem
- **Mobile**: Scaled appropriately for readability

### 5.4 Animations
- **Photo Transition**: Smooth resize (0.4s ease)
- **Questions Appear**: Slide from right (0.4s ease)
- **Progress Dots**: Scale and glow on active (0.3s ease)
- **Correct Answer**: Scale up (1.05x) with shadow

### 5.5 Progress Dots
- **Design**: Circular indicators (3 dots)
- **States**:
  - Inactive: 12px diameter, light gray (#cbd5e0)
  - Active: 16px diameter, purple (#667eea), glow effect
- **Spacing**: 12px gap between dots
- **Animation**: Smooth scale transition

---

## 6. Non-Functional Requirements

### 6.1 Performance
- **Load Time**: < 2 seconds for presenter interface
- **Image Load**: Progressive/lazy loading for large images
- **WebSocket Latency**: < 100ms for state updates
- **Concurrent Teams**: Support 50+ simultaneous connections

### 6.2 Scalability
- **Photos**: Easily extendable (add more photos)
- **Questions**: Configurable (2-4 questions per photo)
- **Language**: Localizable (currently Czech)

### 6.3 Security
- **Network**: Local network only (not exposed to internet)
- **Validation**: Input sanitization for team names
- **CORS**: Socket.io configured for same-origin

### 6.4 Reliability
- **Graceful Degradation**: Standalone mode if server fails
- **Connection Resilience**: Auto-reconnect on socket disconnect
- **Error Handling**: User-friendly error messages

### 6.5 Maintainability
- **Code Quality**: Clean, commented code
- **Modularity**: Separate concerns (presentation/server/admin)
- **Documentation**: Comprehensive README files

---

## 7. Installation & Deployment

### 7.1 Prerequisites
- **Node.js**: v14.0 or higher
- **npm**: Comes with Node.js
- **Web Browser**: Modern browser (see compatibility)

### 7.2 Installation Steps
1. Run `install.bat` (Windows) or `npm install`
2. Wait for dependencies to download
3. Verify `node_modules/` folder created

### 7.3 Running the Application

**Standalone Mode** (no team participation):
```
Open index.html in browser
```

**Server Mode** (with teams):
```
Run: start-server.bat
Open: http://localhost:3000/index.html
```

### 7.4 Configuration
- **Quiz Data**: Edit `app.js` (quizData array) or create `quiz-data.json`
- **Server Port**: Edit `server.js` (PORT constant)
- **Images**: Add to `/images` folder

---

## 8. User Workflows

### 8.1 Presenter Workflow

```
1. Start server (start-server.bat)
2. Open presenter (http://localhost:3000/index.html)
3. Press F for fullscreen
4. Show QR code to teams
5. Wait for teams to join
6. Navigate photos with arrow keys
7. Press Spacebar to show question
8. Wait for teams to answer
9. Press A to reveal answer (auto-scores)
10. Press arrow down for next question
11. Repeat steps 8-10 for all 3 questions
12. Press Spacebar to hide questions
13. Press right arrow for next photo
14. Repeat for all 23 photos
```

### 8.2 Team Workflow

```
1. Scan QR code with phone
2. Enter team name
3. Tap "Připojit se"
4. Wait for question to appear
5. Read question and options
6. Tap selected answer
7. Tap "Odeslat odpověď"
8. See confirmation message
9. Wait for next question
10. Check score after each answer reveal
```

### 8.3 Admin Workflow

```
1. Open admin panel (http://localhost:3000/admin.html)
2. Monitor team registrations
3. Watch real-time responses
4. Track leaderboard
5. Export results at end
```

---

## 9. Future Enhancements (Out of Scope v1.0)

### 9.1 Potential Features
- **Multiple Choice**: Allow multiple correct answers
- **Timer**: Countdown timer for each question
- **Hints**: Progressive hint system
- **Media**: Video/audio questions
- **Achievements**: Badges for teams
- **Analytics**: Detailed response analytics
- **Cloud Sync**: Save/load quiz sessions
- **Mobile Presenter**: Control from phone
- **Audience Poll**: Live polling mode
- **Custom Themes**: Configurable color schemes

### 9.2 Platform Extensions
- **Mobile Apps**: Native iOS/Android apps
- **Web Platform**: Cloud-hosted version
- **Desktop App**: Electron packaging
- **PowerPoint Plugin**: Integration with PPT

---

## 10. Success Metrics

### 10.1 Technical Metrics
- ✅ All 23 photos load successfully
- ✅ Questions cycle smoothly
- ✅ Keyboard navigation works without lag
- ✅ WebSocket connections stable for 30+ minute session
- ✅ Scores calculate correctly

### 10.2 User Experience Metrics
- ✅ Teams can join within 30 seconds
- ✅ Questions readable from 10+ feet away
- ✅ Mobile interface usable on phones 4"+ screen
- ✅ Export generates valid CSV
- ✅ Zero crashes during typical session

---

## 11. Testing Requirements

### 11.1 Unit Testing
- Question data loading
- Answer validation
- Score calculation
- Socket event handling

### 11.2 Integration Testing
- Client-server communication
- Multi-client scenarios
- State synchronization
- Error handling

### 11.3 Manual Testing Checklist
- [ ] All keyboard shortcuts work
- [ ] QR code generates correctly
- [ ] Teams can register
- [ ] Answers submit successfully
- [ ] Scores update correctly
- [ ] Admin panel shows real-time data
- [ ] CSV export works
- [ ] Fullscreen mode works
- [ ] Standalone mode works
- [ ] Mobile interface responsive

---

## 12. Known Limitations

1. **Session Persistence**: Scores lost on server restart
2. **Network Only**: Requires local WiFi for team mode
3. **Browser Dependent**: No offline installer
4. **Single Session**: One active quiz session per server
5. **Manual Question Entry**: No GUI for question editing
6. **No Authentication**: Open access to all interfaces

---

## 13. Support & Maintenance

### 13.1 Documentation
- `README.md`: Basic usage guide
- `README-SERVER.md`: Server setup detailed guide
- `PRD.md`: This document

### 13.2 Common Issues
- **Port 3000 in use**: Change PORT in server.js
- **Firewall blocking**: Allow Node.js in firewall
- **Teams can't connect**: Check WiFi network same
- **QR code not showing**: Ensure server mode active

---

## 14. Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-06-10 | Initial release with all core features |

---

## 15. Glossary

- **Presenter**: Person controlling the quiz presentation
- **Team**: Group of participants answering questions
- **Socket.io**: Real-time bidirectional event-based communication library
- **QR Code**: Quick Response code for easy mobile access
- **WebSocket**: Protocol providing full-duplex communication channels
- **Progress Dots**: Visual indicator showing question progression

---

**End of PRD**

*For implementation in other technologies, follow this specification to ensure feature parity.*
