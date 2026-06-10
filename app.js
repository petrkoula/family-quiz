// Quiz Data - Edit your questions here
const quizData = [
  {
    "image": "IMG_4246_1.jpg",
    "questions": [
      {
        "text": "Který módní prvek křičí '70. léta cool'?",
        "options": ["Kožená bunda", "Zvonové kalhoty", "Boty na platformě", "Disco koule"],
        "correct": 0
      },
      {
        "text": "Ty kníry by se daly nejlépe popsat jako:",
        "options": ["Sotva viditelné", "Legendární", "Ironický hipster", "Náhodné"],
        "correct": 1
      },
      {
        "text": "Co chybí této klasické póze?",
        "options": ["Sluneční brýle", "Cigareta", "Kytara", "Nic - je to dokonalé"],
        "correct": 3
      }
    ]
  },
  {
    "image": "IMG_4246_2.jpg",
    "questions": [
      {
        "text": "Kolik miminek je na gauči?",
        "options": ["Jedno hodně široké", "Dvě roztomilá miminka", "Tři maličká miminka", "Sněm miminek"],
        "correct": 1
      },
      {
        "text": "Co si tato miminka myslí?",
        "options": ["Kdy je svačina?", "Proč jsme napůl nazí?", "Je to fotka?", "Všechno výše uvedené"],
        "correct": 3
      },
      {
        "text": "Které miminko vypadá víc překvapeně?",
        "options": ["Levé miminko", "Pravé miminko", "Obě stejně šokovaná", "Ani jedno - jsou profíci"],
        "correct": 1
      }
    ]
  },
  {
    "image": "IMG_4246_3.jpg",
    "questions": [
      {
        "text": "Co má toto batole na sobě?",
        "options": ["Designový outfit", "Bílé pyžamo/oblečení", "Kostým superhrdiny", "Svatební šaty"],
        "correct": 1
      },
      {
        "text": "Výraz tohoto dítěte říká:",
        "options": ["Něco kuju", "Kde je svačina?", "Chyceno uprostřed myšlenky", "Budoucí modelka"],
        "correct": 2
      },
      {
        "text": "Z jakého desetiletí je tahle fotka?",
        "options": ["1950", "1960-70", "1980", "1990"],
        "correct": 1
      }
    ]
  },
  {
    "image": "IMG_4246_4.jpg",
    "questions": [
      {
        "text": "Kolikrát se tato osoba objevuje ve fotokolekci?",
        "options": ["Poprvé", "Podruhé", "Je všude", "Ztratil jsem počet"],
        "correct": 1
      },
      {
        "text": "Co je to za budovu za ním?",
        "options": ["Nákupní centrum", "Kancelářská budova", "Panelák", "Tajné velitelství"],
        "correct": 2
      },
      {
        "text": "Módní vibe je tady:",
        "options": ["Business casual", "Sportovní", "Retro cool", "Budoucí inspirace hipsterů"],
        "correct": 2
      }
    ]
  },
  {
    "image": "IMG_4246_5.jpg",
    "questions": [
      {
        "text": "Kolik laku na vlasy bylo použito?",
        "options": ["Trochu", "Půl plechovky", "Celá plechovka", "Celý obchod"],
        "correct": 2
      },
      {
        "text": "Tohle je nejspíš:",
        "options": ["Casual selfie", "Profesionální portrét", "Fotka na pas", "Policejní fotka"],
        "correct": 1
      },
      {
        "text": "Její úsměv naznačuje:",
        "options": ["Mírný diskomfort", "Čistou sebevědomost", "Fotograf něco řekl", "Myslí na oběd"],
        "correct": 1
      }
    ]
  },
  {
    "image": "IMG_4246_6.jpg",
    "questions": [
      {
        "text": "Kdo je hvězdou této pouliční fotky?",
        "options": ["Osoba v pozadí", "Usmívající se žena v popředí", "Samotná ulice", "Všichni stejně"],
        "correct": 1
      },
      {
        "text": "Tohle vypadá jako:",
        "options": ["Běžná procházka", "Nákupy", "Foto příležitost", "Útěk"],
        "correct": 2
      },
      {
        "text": "Kolik lidí můžete napočítat?",
        "options": ["Jen jednoho", "Dva lidi", "Tři nebo více", "Dav"],
        "correct": 2
      }
    ]
  },
  {
    "image": "IMG_4246_7.jpg",
    "questions": [
      {
        "text": "V jaké formaci jsou tito tři lidé?",
        "options": ["Vedle sebe", "Lidská pyramida/věž", "V kruhu", "Náhodný chaos"],
        "correct": 1
      },
      {
        "text": "Všichni mají na sobě:",
        "options": ["Casual oblečení", "Uniformy", "Kostýmy", "Pyžama"],
        "correct": 1
      },
      {
        "text": "Kdo má na fotce nejtěžší práci?",
        "options": ["Člověk dole", "Člověk uprostřed", "Člověk nahoře", "Fotograf"],
        "correct": 0
      }
    ]
  },
  {
    "image": "IMG_4246_8.jpg",
    "questions": [
      {
        "text": "Na čem jedou tyto dvě osoby?",
        "options": ["Kolo", "Skútr/motorka", "Kůň", "Kouzelný koberec"],
        "correct": 1
      },
      {
        "text": "Jak vypadají?",
        "options": ["Vyděšeně", "Znuděně", "Šťastně a bezstarostně", "Ztraceně"],
        "correct": 2
      },
      {
        "text": "Viditelné bezpečnostní vybavení:",
        "options": ["Plná výbava", "Pouze helmy", "Nic - čistý 70s vibe", "Bublinkové fólie"],
        "correct": 2
      }
    ]
  },
  {
    "image": "IMG_4246_9.jpg",
    "questions": [
      {
        "text": "S čím si miminko hraje?",
        "options": ["Plyšák", "Košík/přepravka", "Telefon", "Dálkový ovladač"],
        "correct": 1
      },
      {
        "text": "Výraz miminka je:",
        "options": ["Pláč", "Hysterický smích", "Zmatený", "Plánuje ovládnout svět"],
        "correct": 1
      },
      {
        "text": "Tahle fotka byla pořízena v:",
        "options": ["Parku", "Postýlce", "Autě", "Restauraci"],
        "correct": 1
      }
    ]
  },
  {
    "image": "IMG_4246_10.jpg",
    "questions": [
      {
        "text": "Tohle je:",
        "options": ["Pracovní schůzka", "Rodinné setkání", "Koncert", "Protest"],
        "correct": 1
      },
      {
        "text": "Kolik lidí je u stolu?",
        "options": ["2-3 lidé", "4-5 lidí", "6-7 lidí", "Moc na počítání"],
        "correct": 1
      },
      {
        "text": "Co je na stole?",
        "options": ["Jen talíře", "Jídlo a nádobí", "Domácí úkoly", "Deskové hry"],
        "correct": 1
      }
    ]
  },
  {
    "image": "IMG_4246_11.jpg",
    "questions": [
      {
        "text": "Jaké vozidlo je na fotce?",
        "options": ["Kolo", "Auto", "Motorka", "Skateboard"],
        "correct": 2
      },
      {
        "text": "Osoba:",
        "options": ["Jede na ní", "Stojí vedle ní", "Opravuje ji", "Prodává ji"],
        "correct": 1
      },
      {
        "text": "Tahle motorka vypadá:",
        "options": ["Úplně nová", "Vintage cool", "Rozbitá", "Neviditelná"],
        "correct": 1
      }
    ]
  },
  {
    "image": "IMG_4246_12.jpg",
    "questions": [
      {
        "text": "Jaké zvíře je na fotce?",
        "options": ["Pes", "Kočka", "Křeček", "Drak"],
        "correct": 1
      },
      {
        "text": "Vlasy osoby jsou:",
        "options": ["Rovné", "Kudrnaté/afro", "Holá hlava", "Duhové"],
        "correct": 1
      },
      {
        "text": "Kdo je šťastnější - člověk nebo kočka?",
        "options": ["Člověk", "Kočka", "Oba stejně", "Ani jeden - kočka vypadá naštvaně"],
        "correct": 0
      }
    ]
  },
  {
    "image": "IMG_4246_13.jpg",
    "questions": [
      {
        "text": "Kde byla pořízena tahle fotka?",
        "options": ["Pláž/nábřeží", "Poušť", "Les", "Nákupní centrum"],
        "correct": 0
      },
      {
        "text": "O co se opírá?",
        "options": ["Nic", "Zábradlí lodi", "Auto", "Kamarádku"],
        "correct": 1
      },
      {
        "text": "Její styl oblečení je:",
        "options": ["Formální šaty", "Casual letní oblečení", "Zimní kabát", "Skafandr"],
        "correct": 1
      }
    ]
  },
  {
    "image": "IMG_4246_14.jpg",
    "questions": [
      {
        "text": "Kolik lidí je na fotce?",
        "options": ["2-3", "4-6", "7-9", "Celý dav (10+)"],
        "correct": 2
      },
      {
        "text": "Je tam miminko v:",
        "options": ["Batohu", "Kočárku", "Náručí", "Košíku"],
        "correct": 1
      },
      {
        "text": "Budova za nimi vypadá jako:",
        "options": ["Škola", "Kostel/vládní budova", "Nákupní centrum", "Hrad"],
        "correct": 1
      }
    ]
  },
  {
    "image": "IMG_4246_15.jpg",
    "questions": [
      {
        "text": "Tento pár je oblečený na:",
        "options": ["Den na pláži", "Formální akci (ples/svatba)", "Tělocvik", "Halloween"],
        "correct": 1
      },
      {
        "text": "Jaká je kvalita fotky?",
        "options": ["Křišťálově čistá", "Zrnitá vintage", "Photoshopovaná", "Holografická"],
        "correct": 1
      },
      {
        "text": "Pánův motýlek je:",
        "options": ["Na klipsu", "Skutečný motýlek", "Chybí", "Vlastně normální kravata"],
        "correct": 1
      }
    ]
  },
  {
    "image": "IMG_4246_16.jpg",
    "questions": [
      {
        "text": "Co tato osoba dělá?",
        "options": ["Tančí", "Objímá někoho", "Cvičí", "Plave"],
        "correct": 1
      },
      {
        "text": "Jak vypadají její šaty?",
        "options": ["Tmavé elegantní", "Světlé s mašlí", "Sportovní", "Neviditelné"],
        "correct": 1
      },
      {
        "text": "Tahle fotka je:",
        "options": ["Spontánní okamžik", "Pečlivě naaranžovaná", "Náhodný snímek", "Fotomontáž"],
        "correct": 0
      }
    ]
  },
  {
    "image": "IMG_4246_17.jpg",
    "questions": [
      {
        "text": "Kolik dětí je na fotce?",
        "options": ["Jedno", "Dvě", "Tři", "Čtyři"],
        "correct": 2
      },
      {
        "text": "Kde sedí?",
        "options": ["Na židlích", "Na gauči", "Na zemi", "Na stromě"],
        "correct": 1
      },
      {
        "text": "Nálada na fotce je:",
        "options": ["Smutná", "Veselá a klidná", "Napjatá", "Chaotická"],
        "correct": 1
      }
    ]
  },
  {
    "image": "IMG_4246_18.jpg",
    "questions": [
      {
        "text": "Kolik lidí je na této skupinové fotce?",
        "options": ["Méně než 10", "10-15", "15-20", "Více než 20"],
        "correct": 2
      },
      {
        "text": "Vypadá to jako:",
        "options": ["Rodinná oslava", "Školní maturitní ples", "Pracovní meeting", "Koncert"],
        "correct": 1
      },
      {
        "text": "Lidé vzadu stojí:",
        "options": ["Náhodně", "Ve dvou řadách", "V kruhu", "Sedí"],
        "correct": 1
      }
    ]
  },
  {
    "image": "IMG_4246_19.jpg",
    "questions": [
      {
        "text": "Tento pár drží:",
        "options": ["Knihu", "Kytici/květinu", "Telefon", "Nic"],
        "correct": 1
      },
      {
        "text": "Jeho oblek je:",
        "options": ["Casual džíny", "Tmavý formální oblek", "Sportovní", "Bílý smoking"],
        "correct": 1
      },
      {
        "text": "Její šaty jsou:",
        "options": ["Tmavé", "Světlé elegantní", "Barevné", "Sportovní"],
        "correct": 1
      }
    ]
  },
  {
    "image": "IMG_4246_20.jpg",
    "questions": [
      {
        "text": "Děti jsou oblečené jako:",
        "options": ["Piráti", "Ženich a nevěsta", "Superhrdiny", "Zvířátka"],
        "correct": 1
      },
      {
        "text": "Holčička má na hlavě:",
        "options": ["Klobouk", "Závoj", "Korunu", "Nic"],
        "correct": 1
      },
      {
        "text": "Tohle vypadá jako:",
        "options": ["Skutečná svatba", "Dětská hra/kostým", "Halloween", "Divadelní představení"],
        "correct": 1
      }
    ]
  },
  {
    "image": "IMG_4246_21.jpg",
    "questions": [
      {
        "text": "Co je na stole?",
        "options": ["Jenom talíře", "Dort/dezert", "Počítač", "Květiny"],
        "correct": 1
      },
      {
        "text": "Kolik žen je u stolu?",
        "options": ["Jedna", "Dvě", "Tři", "Čtyři"],
        "correct": 1
      },
      {
        "text": "Vypadají:",
        "options": ["Smutně", "Vesele a uvolněně", "Unavené", "Rozzlobené"],
        "correct": 1
      }
    ]
  },
  {
    "image": "IMG_4246_22.jpg",
    "questions": [
      {
        "text": "Jaké jsou šaty?",
        "options": ["Jednoduché", "Nadýchané bílé/krajkové", "Černé elegantní", "Barevné"],
        "correct": 1
      },
      {
        "text": "Tahle fotka připomíná:",
        "options": ["Běžný den", "Divadelní kostým", "Sportovní akci", "Pracovní oblečení"],
        "correct": 1
      },
      {
        "text": "Kolik látky bylo použito na tyto šaty?",
        "options": ["Minimum", "Normálně", "Hodně", "Celý obchod"],
        "correct": 3
      }
    ]
  },
  {
    "image": "IMG_4246_23.jpg",
    "questions": [
      {
        "text": "Co se děje na této fotce?",
        "options": ["Koncert", "Lidový tanec/představení", "Cvičení", "Obřad"],
        "correct": 1
      },
      {
        "text": "Lidé jsou oblečeni v:",
        "options": ["Džínách", "Krojích/tradičních šatech", "Oblecích", "Pyžamech"],
        "correct": 1
      },
      {
        "text": "Kde se to odehrává?",
        "options": ["Venku", "Na pódiu/jevišti", "V kostele", "Doma"],
        "correct": 1
      }
    ]
  }
];

// App state
let currentIndex = 0;
let currentQuestionIndex = 0;
let questionsVisible = false;
let answersRevealed = false;

// DOM elements
const photoEl = document.getElementById('photo');
const progressEl = document.getElementById('progress');
const questionsContainer = document.getElementById('questions-container');
const spaceHint = document.getElementById('space-hint');
const photoContainer = document.querySelector('.photo-container');

// Load quiz data
function loadQuizData() {
    loadPhoto(currentIndex);
}

// Load photo and update UI
function loadPhoto(index) {
    if (!quizData[index]) return;

    const quiz = quizData[index];
    photoEl.src = `images/${quiz.image}`;
    progressEl.textContent = `Foto ${index + 1} / ${quizData.length}`;

    // Reset to first question
    currentQuestionIndex = 0;

    // Hide questions when changing photos
    hideQuestions();

    // Render questions (but keep them hidden)
    renderQuestions(quiz.questions);
}

// Render current question only
function renderQuestions(questions) {
    const questionsDiv = questionsContainer.querySelector('.questions');
    questionsDiv.innerHTML = '';

    if (!questions || questions.length === 0) return;

    const q = questions[currentQuestionIndex];

    // Question progress dots
    const counterEl = document.createElement('div');
    counterEl.className = 'question-counter';
    for (let i = 0; i < questions.length; i++) {
        const dot = document.createElement('span');
        dot.className = i === currentQuestionIndex ? 'dot active' : 'dot';
        counterEl.appendChild(dot);
    }

    // Question element
    const questionEl = document.createElement('div');
    questionEl.className = 'question';

    const questionText = document.createElement('div');
    questionText.className = 'question-text';
    questionText.textContent = q.text;

    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'options';

    q.options.forEach((option, optIdx) => {
        const optionEl = document.createElement('div');
        optionEl.className = 'option';
        optionEl.textContent = option;
        optionEl.dataset.index = optIdx;
        optionEl.dataset.correct = optIdx === q.correct;
        optionsDiv.appendChild(optionEl);
    });

    questionEl.appendChild(questionText);
    questionEl.appendChild(optionsDiv);

    questionsDiv.appendChild(counterEl);
    questionsDiv.appendChild(questionEl);
}

// Toggle questions visibility
function toggleQuestions() {
    questionsVisible = !questionsVisible;

    if (questionsVisible) {
        questionsContainer.classList.remove('hidden');
        photoContainer.classList.add('with-questions');
        spaceHint.textContent = 'Mezerník skryje | ↑↓ Otázky | A Odpovědi';
    } else {
        questionsContainer.classList.add('hidden');
        photoContainer.classList.remove('with-questions');
        spaceHint.textContent = 'Mezerník zobrazí otázky | F pro celou obrazovku';
        // Reset answers when hiding
        hideAnswers();
    }
}

// Navigate to next question
function nextQuestion() {
    if (!questionsVisible || !quizData[currentIndex]) return;

    const totalQuestions = quizData[currentIndex].questions.length;
    if (currentQuestionIndex < totalQuestions - 1) {
        currentQuestionIndex++;
        renderQuestions(quizData[currentIndex].questions);
        hideAnswers();
    }
}

// Navigate to previous question
function previousQuestion() {
    if (!questionsVisible || !quizData[currentIndex]) return;

    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestions(quizData[currentIndex].questions);
        hideAnswers();
    }
}

// Show correct answers
function revealAnswers() {
    if (!questionsVisible) return;

    answersRevealed = true;
    const options = questionsContainer.querySelectorAll('.option');
    options.forEach(option => {
        if (option.dataset.correct === 'true') {
            option.classList.add('correct');
        }
    });
}

// Hide answers
function hideAnswers() {
    answersRevealed = false;
    const options = questionsContainer.querySelectorAll('.option');
    options.forEach(option => {
        option.classList.remove('correct');
    });
}

// Navigate to next photo
function nextPhoto() {
    // Don't change photo when questions are visible
    if (questionsVisible) return;

    if (currentIndex < quizData.length - 1) {
        currentIndex++;
        loadPhoto(currentIndex);
    }
}

// Navigate to previous photo
function previousPhoto() {
    // Don't change photo when questions are visible
    if (questionsVisible) return;

    if (currentIndex > 0) {
        currentIndex--;
        loadPhoto(currentIndex);
    }
}

// Hide questions
function hideQuestions() {
    questionsVisible = false;
    questionsContainer.classList.add('hidden');
    photoContainer.classList.remove('with-questions');
    spaceHint.textContent = 'Mezerník zobrazí otázky | F pro celou obrazovku';
    hideAnswers();
}

// Toggle fullscreen
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log('Error attempting to enable fullscreen:', err);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// Keyboard event handler
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case ' ':
            e.preventDefault();
            toggleQuestions();
            break;
        case 'ArrowRight':
            e.preventDefault();
            nextPhoto();
            break;
        case 'ArrowLeft':
            e.preventDefault();
            previousPhoto();
            break;
        case 'ArrowDown':
            e.preventDefault();
            nextQuestion();
            break;
        case 'ArrowUp':
            e.preventDefault();
            previousQuestion();
            break;
        case 'a':
        case 'A':
            e.preventDefault();
            revealAnswers();
            break;
        case 'f':
        case 'F':
            e.preventDefault();
            toggleFullscreen();
            break;
        case 'Escape':
            if (questionsVisible) {
                hideQuestions();
            } else if (document.fullscreenElement) {
                document.exitFullscreen();
            }
            break;
    }
});

// Initialize app
loadQuizData();

// ==================================================
// WebSocket Integration for Teams
// ==================================================

let socket = null;
let isServerMode = false;

// Check if Socket.io is available (server mode)
if (typeof io !== 'undefined') {
    try {
        socket = io();
        isServerMode = true;
        console.log('Connected to quiz server');

        // Generate QR code for team URL
        const protocol = window.location.protocol;
        const hostname = window.location.hostname;
        const port = window.location.port;
        const teamUrl = `${protocol}//${hostname}${port ? ':' + port : ''}/team.html`;

        // Show QR code
        const qrcodeContainer = document.getElementById('qrcode-container');
        if (qrcodeContainer && typeof QRCode !== 'undefined') {
            qrcodeContainer.style.display = 'block';
            document.getElementById('team-url').textContent = teamUrl;

            QRCode.toCanvas(document.getElementById('qrcode'), teamUrl, {
                width: 200,
                margin: 2,
                color: {
                    dark: '#667eea',
                    light: '#ffffff'
                }
            }, function (error) {
                if (error) console.error('QR Code error:', error);
            });
        }

    } catch (e) {
        console.log('Running in standalone mode (no server)');
        isServerMode = false;
    }
}

// Broadcast game state changes to server
function broadcastGameState() {
    if (socket && isServerMode) {
        socket.emit('updateGameState', {
            currentPhotoIndex: currentIndex,
            currentQuestionIndex: currentQuestionIndex,
            questionsVisible: questionsVisible
        });
    }
}

// Override functions to broadcast changes
const originalLoadPhoto = loadPhoto;
loadPhoto = function(index) {
    originalLoadPhoto(index);
    broadcastGameState();
};

const originalToggleQuestions = toggleQuestions;
toggleQuestions = function() {
    originalToggleQuestions();
    broadcastGameState();
};

const originalNextQuestion = nextQuestion;
nextQuestion = function() {
    originalNextQuestion();
    broadcastGameState();
};

const originalPreviousQuestion = previousQuestion;
previousQuestion = function() {
    originalPreviousQuestion();
    broadcastGameState();
};

const originalRevealAnswers = revealAnswers;
revealAnswers = function() {
    originalRevealAnswers();
    if (socket && isServerMode && quizData[currentIndex]) {
        const correctAnswer = quizData[currentIndex].questions[currentQuestionIndex].correct;
        socket.emit('revealAnswer', {
            photoIndex: currentIndex,
            questionIndex: currentQuestionIndex,
            correctAnswer: correctAnswer
        });
    }
};
