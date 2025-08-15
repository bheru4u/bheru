document.addEventListener('DOMContentLoaded', () => {
    // Game elements
    const wordsToTypeContainer = document.getElementById('words-to-type');
    const userInput = document.getElementById('user-input');
    const keyboard = document.getElementById('keyboard');
    const restartBtn = document.getElementById('restart-btn');
    const levelSelect = document.getElementById('level-select');

    // Stats display
    const timeDisplay = document.getElementById('time');
    const wpmDisplay = document.getElementById('wpm');
    const accuracyDisplay = document.getElementById('accuracy');
    const levelDisplay = document.getElementById('level');

    // Interstitial popup elements
    const interstitialOverlay = document.getElementById('interstitial-overlay');
    const countdownDisplay = document.getElementById('countdown');
    const nextLevelBtn = document.getElementById('next-level-btn');
    const popupWpm = document.getElementById('popup-wpm');
    const popupAccuracy = document.getElementById('popup-accuracy');

    const levels = [
        { name: "Level 1: The Basics", words: ["the", "be", "to", "of", "and", "a", "in", "that", "have", "it", "for", "not", "on", "with", "he", "as", "you", "do", "at"] },
        { name: "Level 2: Common Words", words: ["this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", "there", "their"] },
        { name: "Level 3: Getting Longer", words: ["about", "which", "would", "people", "into", "other", "than", "its", "over", "also", "after", "should", "because", "every", "example"] },
        { name: "Level 4: Tricky Letters", words: ["query", "jump", "quiz", "zone", "extra", "major", "joke", "fuzzy", "wave", "pack", "quick", "jive", "box", "zephyr", "glaze"] },
        { name: "Level 5: Punctuation Practice", words: ["don't", "it's", "you're", "world's", "well-being", "long-term", "state-of-the-art", "user-friendly", "e-mail", "re-evaluate", "co-worker"] }
    ];

    // Game state variables
    let timer;
    let interstitialTimer;
    let time = 0;
    let currentWordIndex = 0;
    let correctStrokes = 0;
    let totalStrokes = 0;
    let gameStarted = false;
    let currentLevel = 0;

    function populateLevelSelector() {
        levels.forEach((level, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = level.name;
            levelSelect.appendChild(option);
        });
    }

    function showInterstitial(finalWpm, finalAccuracy) {
        clearInterval(timer);
        interstitialOverlay.classList.remove('hidden');
        userInput.blur();

        // Display stats in the popup
        popupWpm.textContent = finalWpm;
        popupAccuracy.textContent = `${finalAccuracy}%`;

        let countdown = 5;
        countdownDisplay.textContent = countdown;

        interstitialTimer = setInterval(() => {
            countdown--;
            countdownDisplay.textContent = countdown;
            if (countdown <= 0) {
                proceedToNextLevel();
            }
        }, 1000);
    }

    function proceedToNextLevel() {
        clearInterval(interstitialTimer);
        interstitialOverlay.classList.add('hidden');
        loadLevel(currentLevel + 1);
    }

    function loadLevel(levelIndex) {
        if (levelIndex >= levels.length) {
            wordsToTypeContainer.innerHTML = "<h1>Congratulations! You've completed all levels!</h1>";
            userInput.style.display = 'none';
            keyboard.classList.add('hidden');
            clearInterval(timer);
            return;
        }

        currentLevel = levelIndex;
        levelDisplay.textContent = currentLevel + 1;
        levelSelect.value = currentLevel;

        const level = levels[currentLevel];
        wordsToTypeContainer.innerHTML = '';
        level.words.forEach(word => {
            const wordSpan = document.createElement('span');
            wordSpan.classList.add('word');
            word.split('').forEach(letter => {
                const letterSpan = document.createElement('span');
                letterSpan.textContent = letter;
                wordSpan.appendChild(letterSpan);
            });
            wordsToTypeContainer.appendChild(wordSpan);
            const spaceSpan = document.createElement('span');
            spaceSpan.innerHTML = '&nbsp;';
            wordsToTypeContainer.appendChild(spaceSpan);
        });

        userInput.value = '';
        userInput.focus();
        resetStats();
        updateCurrentWord();
        updateKeyboardHighlight();
    }

    function initializeGame() {
        userInput.style.display = 'block';
        keyboard.classList.remove('hidden');
        interstitialOverlay.classList.add('hidden');
        clearInterval(interstitialTimer);
        populateLevelSelector();
        loadLevel(0);
    }

    function resetStats() {
        clearInterval(timer);
        time = 0;
        currentWordIndex = 0;
        correctStrokes = 0;
        totalStrokes = 0;
        gameStarted = false;
        timeDisplay.textContent = time;
        wpmDisplay.textContent = 0;
        accuracyDisplay.textContent = 100;
    }

    // (Other functions remain the same)
    function updateCurrentWord() {
        const wordSpans = wordsToTypeContainer.querySelectorAll('.word');
        wordSpans.forEach((span, index) => {
            span.classList.remove('current');
            if (index === currentWordIndex) {
                span.classList.add('current');
            }
        });
        updateKeyboardHighlight();
    }

    function updateKeyboardHighlight() {
        keyboard.querySelectorAll('.key.highlight').forEach(key => key.classList.remove('highlight'));
        const wordSpans = wordsToTypeContainer.querySelectorAll('.word');
        if (currentWordIndex >= wordSpans.length) return;

        const currentWordSpan = wordSpans[currentWordIndex];
        const typedValue = userInput.value;
        const currentWord = currentWordSpan.textContent;
        const nextChar = currentWord.charAt(typedValue.length);

        if (nextChar) {
            const key = keyboard.querySelector(`.key[data-key="${nextChar.toLowerCase()}"]`);
            if (key) key.classList.add('highlight');
        } else if (typedValue.length === currentWord.length) {
            const spaceKey = keyboard.querySelector(`.key[data-key=" "]`);
            if (spaceKey) spaceKey.classList.add('highlight');
        }
    }

    function handleKeyPressFeedback(keyChar, isCorrect) {
        const keyElement = keyboard.querySelector(`.key[data-key="${keyChar.toLowerCase()}"]`);
        if (keyElement) {
            const feedbackClass = isCorrect ? 'key-correct' : 'key-incorrect';
            keyElement.classList.add(feedbackClass);
            setTimeout(() => keyElement.classList.remove(feedbackClass), 200);
        }
    }

    function startGame() {
        if (!gameStarted) {
            gameStarted = true;
            timer = setInterval(() => {
                time++;
                timeDisplay.textContent = time;
                calculateWPM();
            }, 1000);
        }
    }

    function calculateWPM() {
        const charsTyped = correctStrokes;
        const minutes = time / 60;
        const wpm = minutes > 0 ? Math.round((charsTyped / 5) / minutes) : 0;
        wpmDisplay.textContent = wpm;
        return wpm;
    }

    function calculateAccuracy() {
        const accuracy = totalStrokes > 0 ? Math.round((correctStrokes / totalStrokes) * 100) : 100;
        accuracyDisplay.textContent = accuracy;
        return accuracy;
    }

    userInput.addEventListener('input', () => {
        if (interstitialOverlay.classList.contains('hidden') === false) {
            userInput.value = '';
            return;
        }
        startGame();
        const wordSpans = wordsToTypeContainer.querySelectorAll('.word');
        if (currentWordIndex >= wordSpans.length) return;

        const currentWordSpan = wordSpans[currentWordIndex];
        const currentWord = currentWordSpan.textContent;
        const typedValue = userInput.value;

        totalStrokes++;

        const letterSpans = currentWordSpan.querySelectorAll('span');
        for (let i = 0; i < letterSpans.length; i++) {
            if (i < typedValue.length) {
                if (typedValue[i] === currentWord[i]) {
                    letterSpans[i].className = 'correct';
                } else {
                    letterSpans[i].className = 'incorrect';
                }
            } else {
                letterSpans[i].className = '';
            }
        }

        const lastChar = typedValue.slice(-1);
        if (lastChar) {
            const isCorrect = lastChar === currentWord[typedValue.length - 1];
            handleKeyPressFeedback(lastChar, isCorrect);
        }

        if (typedValue.endsWith(' ')) {
            if (typedValue.trim() === currentWord) {
                correctStrokes += currentWord.length + 1;
            }
            currentWordIndex++;
            userInput.value = '';

            if (currentWordIndex >= wordSpans.length) {
                const finalWpm = calculateWPM();
                const finalAccuracy = calculateAccuracy();
                showInterstitial(finalWpm, finalAccuracy);
            } else {
                updateCurrentWord();
            }
        }

        calculateAccuracy();
        updateKeyboardHighlight();
    });

    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace') {
            const backspaceKey = keyboard.querySelector('.key[data-key="Backspace"]');
            if(backspaceKey) {
                backspaceKey.classList.add('key-correct');
                setTimeout(() => backspaceKey.classList.remove('key-correct'), 100);
            }
        }
    });

    levelSelect.addEventListener('change', (e) => {
        const levelIndex = parseInt(e.target.value, 10);
        loadLevel(levelIndex);
    });

    nextLevelBtn.addEventListener('click', proceedToNextLevel);
    restartBtn.addEventListener('click', () => loadLevel(currentLevel));

    initializeGame();
});
