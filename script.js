document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const textToTypeEl = document.getElementById('text-to-type');
    const timeEl = document.getElementById('time');
    const wpmEl = document.getElementById('wpm');
    const accuracyEl = document.getElementById('accuracy');
    const levelSelector = document.getElementById('level');
    const keyboardEl = document.getElementById('keyboard');
    const resultModal = document.getElementById('result-modal');
    const resultWpmEl = document.getElementById('result-wpm');
    const resultAccuracyEl = document.getElementById('result-accuracy');
    const nextLevelBtn = document.getElementById('next-level-btn');
    const countdownEl = document.getElementById('countdown');

    // Game Data & State
    let countdownTimer = null;
    const levels = Array.from({ length: 200 }, (_, i) => {
        if (i < 5) return `asdf jkl;`;
        if (i < 10) return `asdfg hjkl;`;
        if (i < 20) return `qwer yuio`;
        if (i < 30) return `zxcv m,./`;
        if (i < 50) return `the quick brown fox`;
        if (i < 75) return `jumps over the lazy dog`;
        if (i < 100) return `pack my box with five dozen liquor jugs`;
        if (i < 150) return `How quickly daft jumping zebras vex.`;
        if (i < 199) return `Mr. Jock, TV quiz PhD, bags few lynx.`;
        return `Congratulations! You've reached the final level. Your typing skills are truly impressive. Keep practicing to maintain your speed and accuracy!`;
    });

    const keyboardLayout = [
        ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
        ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
        ['CapsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
        ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
        [' ', ' ', ' ', 'Space', ' ', ' ', ' ']
    ];

    const fingerMapping = {
        '`': { hand: 'left', finger: 'pinky' }, '1': { hand: 'left', finger: 'pinky' }, 'q': { hand: 'left', finger: 'pinky' }, 'a': { hand: 'left', finger: 'pinky' }, 'z': { hand: 'left', finger: 'pinky' },
        '~': { hand: 'left', finger: 'pinky' }, '!': { hand: 'left', finger: 'pinky' }, 'Q': { hand: 'left', finger: 'pinky' }, 'A': { hand: 'left', finger: 'pinky' }, 'Z': { hand: 'left', finger: 'pinky' },
        '2': { hand: 'left', finger: 'ring' }, 'w': { hand: 'left', finger: 'ring' }, 's': { hand: 'left', finger: 'ring' }, 'x': { hand: 'left', finger: 'ring' },
        '@': { hand: 'left', finger: 'ring' }, 'W': { hand: 'left', finger: 'ring' }, 'S': { hand: 'left', finger: 'ring' }, 'X': { hand: 'left', finger: 'ring' },
        '3': { hand: 'left', finger: 'middle' }, 'e': { hand: 'left', finger: 'middle' }, 'd': { hand: 'left', finger: 'middle' }, 'c': { hand: 'left', finger: 'middle' },
        '#': { hand: 'left', finger: 'middle' }, 'E': { hand: 'left', finger: 'middle' }, 'D': { hand: 'left', finger: 'middle' }, 'C': { hand: 'left', finger: 'middle' },
        '4': { hand: 'left', finger: 'index' }, 'r': { hand: 'left', finger: 'index' }, 'f': { hand: 'left', finger: 'index' }, 'v': { hand: 'left', finger: 'index' },
        '$': { hand: 'left', finger: 'index' }, 'R': { hand: 'left', finger: 'index' }, 'F': { hand: 'left', finger: 'index' }, 'V': { hand: 'left', finger: 'index' },
        '5': { hand: 'left', finger: 'index' }, 't': { hand: 'left', finger: 'index' }, 'g': { hand: 'left', finger: 'index' }, 'b': { hand: 'left', finger: 'index' },
        '%': { hand: 'left', finger: 'index' }, 'T': { hand: 'left', finger: 'index' }, 'G': { hand: 'left', finger: 'index' }, 'B': { hand: 'left', finger: 'index' },
        '6': { hand: 'right', finger: 'index' }, 'y': { hand: 'right', finger: 'index' }, 'h': { hand: 'right', finger: 'index' }, 'n': { hand: 'right', finger: 'index' },
        '^': { hand: 'right', finger: 'index' }, 'Y': { hand: 'right', finger: 'index' }, 'H': { hand: 'right', finger: 'index' }, 'N': { hand: 'right', finger: 'index' },
        '7': { hand: 'right', finger: 'index' }, 'u': { hand: 'right', finger: 'index' }, 'j': { hand: 'right', finger: 'index' }, 'm': { hand: 'right', finger: 'index' },
        '&': { hand: 'right', finger: 'index' }, 'U': { hand: 'right', finger: 'index' }, 'J': { hand: 'right', finger: 'index' }, 'M': { hand: 'right', finger: 'index' },
        '8': { hand: 'right', finger: 'middle' }, 'i': { hand: 'right', finger: 'middle' }, 'k': { hand: 'right', finger: 'middle' }, ',': { hand: 'right', finger: 'middle' },
        '*': { hand: 'right', finger: 'middle' }, 'I': { hand: 'right', finger: 'middle' }, 'K': { hand: 'right', finger: 'middle' }, '<': { hand: 'right', finger: 'middle' },
        '9': { hand: 'right', finger: 'ring' }, 'o': { hand: 'right', finger: 'ring' }, 'l': { hand: 'right', finger: 'ring' }, '.': { hand: 'right', finger: 'ring' },
        '(': { hand: 'right', finger: 'ring' }, 'O': { hand: 'right', finger: 'ring' }, 'L': { hand: 'right', finger: 'ring' }, '>': { hand: 'right', finger: 'ring' },
        '0': { hand: 'right', finger: 'pinky' }, 'p': { hand: 'right', finger: 'pinky' }, ';': { hand: 'right', finger: 'pinky' }, '/': { hand: 'right', finger: 'pinky' },
        ')': { hand: 'right', finger: 'pinky' }, 'P': { hand: 'right', finger: 'pinky' }, ':': { hand: 'right', finger: 'pinky' }, '?': { hand: 'right', finger: 'pinky' },
        '-': { hand: 'right', finger: 'pinky' }, '[': { hand: 'right', finger: 'pinky' }, "'": { hand: 'right', finger: 'pinky' },
        '_': { hand: 'right', finger: 'pinky' }, '{': { hand: 'right', finger: 'pinky' }, '"': { hand: 'right', finger: 'pinky' },
        '=': { hand: 'right', finger: 'pinky' }, ']': { hand: 'right', finger: 'pinky' }, '\\': { hand: 'right', finger: 'pinky' },
        '+': { hand: 'right', finger: 'pinky' }, '}': { hand: 'right', finger: 'pinky' }, '|': { hand: 'right', finger: 'pinky' },
        ' ': { hand: 'right', finger: 'thumb' }
    };

    let state = {
        currentLevel: 0,
        text: '',
        spans: null,
        timer: null,
        time: 60,
        typedIndex: 0,
        mistakes: 0,
        totalTyped: 0,
        isTyping: false,
        startTime: null
    };

    function init() {
        createKeyboard();
        populateLevels();
        loadLevel(0);

        document.addEventListener('keydown', handleKeyDown);
        levelSelector.addEventListener('change', (e) => loadLevel(parseInt(e.target.value)));
        nextLevelBtn.addEventListener('click', () => {
            if (countdownTimer) clearInterval(countdownTimer);
            loadNextLevel();
        });
    }

    function loadNextLevel() {
        resultModal.style.display = 'none';
        const nextLevel = state.currentLevel + 1 < levels.length ? state.currentLevel + 1 : 0;
        loadLevel(nextLevel);
    }

    function loadLevel(levelIndex) {
        // Clear any running timers from the previous state
        if (state.timer) clearInterval(state.timer);
        if (countdownTimer) clearInterval(countdownTimer);

        // Reset properties on the existing state object
        state.currentLevel = levelIndex;
        state.text = levels[levelIndex];
        state.spans = null;
        state.timer = null;
        state.time = 60;
        state.typedIndex = 0;
        state.mistakes = 0;
        state.totalTyped = 0;
        state.isTyping = false;
        state.startTime = null;

        levelSelector.value = state.currentLevel;

        textToTypeEl.innerHTML = '';
        state.text.split('').forEach(char => {
            const span = document.createElement('span');
            span.textContent = char;
            textToTypeEl.appendChild(span);
        });
        state.spans = textToTypeEl.children;

        resetGame();
    }

    function handleKeyDown(e) {
        // If an input, textarea, or select is focused, don't handle the keydown
        if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA' || document.activeElement.tagName === 'SELECT') {
            return;
        }

        e.preventDefault();
        const { key } = e;

        if (!state.isTyping && key.length === 1) {
            state.isTyping = true;
            state.startTime = new Date();
            startTimer();
        }

        if (key === 'Backspace') {
            if (state.typedIndex > 0) {
                state.typedIndex--;
                const span = state.spans[state.typedIndex];
                if (span.classList.contains('incorrect')) {
                    state.mistakes--;
                }
                span.classList.remove('correct', 'incorrect');
                updateHighlights();
            }
        } else if (key.length === 1 && state.typedIndex < state.text.length) {
            const targetChar = state.text[state.typedIndex];
            const currentSpan = state.spans[state.typedIndex];

            if (key === targetChar) {
                currentSpan.classList.add('correct');
            } else {
                currentSpan.classList.add('incorrect');
                state.mistakes++;
            }
            state.typedIndex++;
            state.totalTyped++;
            updateHighlights();
        }

        updateStats();

        if (state.typedIndex === state.text.length) {
            endGame();
        }
    }

    function startTimer() {
        state.time = 60;
        timeEl.textContent = state.time;
        state.timer = setInterval(() => {
            state.time--;
            timeEl.textContent = state.time;
            if (state.time <= 0) {
                endGame();
            }
            updateStats();
        }, 1000);
    }

    function resetGame() {
        timeEl.textContent = state.time;
        wpmEl.textContent = 0;
        accuracyEl.textContent = '100%';
        resultModal.style.display = 'none';
        updateHighlights();
    }

    function endGame() {
        clearInterval(state.timer);
        state.isTyping = false;
        const finalWPM = calculateWPM();
        const finalAccuracy = calculateAccuracy();

        resultWpmEl.textContent = finalWPM;
        resultAccuracyEl.textContent = `${finalAccuracy}%`;
        resultModal.style.display = 'flex';

        let countdownValue = 5;
        countdownEl.textContent = countdownValue;

        countdownTimer = setInterval(() => {
            countdownValue--;
            countdownEl.textContent = countdownValue;
            if (countdownValue === 0) {
                clearInterval(countdownTimer);
                loadNextLevel();
            }
        }, 1000);
    }

    function updateStats() {
        if (state.isTyping) {
            wpmEl.textContent = calculateWPM();
            accuracyEl.textContent = `${calculateAccuracy()}%`;
        }
    }

    function calculateWPM() {
        const grossTyped = state.typedIndex;
        const netTyped = grossTyped - state.mistakes;
        const minutes = (new Date() - state.startTime) / 60000;
        return minutes > 0 ? Math.round((netTyped / 5) / minutes) : 0;
    }

    function calculateAccuracy() {
        return state.totalTyped > 0 ? Math.round(((state.totalTyped - state.mistakes) / state.totalTyped) * 100) : 100;
    }

    function updateHighlights() {
        // Cursor on text
        document.querySelectorAll('.current').forEach(el => el.classList.remove('current'));
        if (state.typedIndex < state.text.length) {
            state.spans[state.typedIndex].classList.add('current');
        }

        // Keyboard and fingers
        const nextChar = state.typedIndex < state.text.length ? state.text[state.typedIndex] : null;
        highlightKey(nextChar);
    }

    function highlightKey(char) {
        document.querySelectorAll('.key.active').forEach(k => k.classList.remove('active'));

        if (char) {
            const keyEl = document.querySelector(`.key[data-key="${char.toLowerCase() === ' ' ? 'space' : char.toLowerCase()}"]`);
            if (keyEl) {
                keyEl.classList.add('active');
            }
        }
    }

    function createKeyboard() {
        keyboardEl.innerHTML = '';
        keyboardLayout.forEach(row => {
            const rowEl = document.createElement('div');
            rowEl.classList.add('keyboard-row');
            row.forEach(key => {
                const keyEl = document.createElement('div');
                keyEl.classList.add('key');

                const dataKey = key.toLowerCase();
                keyEl.setAttribute('data-key', dataKey);

                const fingerInfo = fingerMapping[key] || fingerMapping[key.toLowerCase()];
                const hintText = fingerInfo ? fingerInfo.finger : '';

                keyEl.innerHTML = `
                    <span class="key-char">${key}</span>
                    <span class="finger-hint">${hintText}</span>
                `;

                if (dataKey === 'space') keyEl.classList.add('space');
                if (key.length > 1 && key !== ' ') keyEl.style.flexGrow = '1.5';

                rowEl.appendChild(keyEl);
            });
            keyboardEl.appendChild(rowEl);
        });
    }

    function populateLevels() {
        levels.forEach((_, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `Level ${index + 1}`;
            levelSelector.appendChild(option);
        });
    }

    init();
});
