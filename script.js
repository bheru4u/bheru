document.addEventListener('DOMContentLoaded', () => {
    const wordsToTypeContainer = document.getElementById('words-to-type');
    const userInput = document.getElementById('user-input');
    const timeDisplay = document.getElementById('time');
    const wpmDisplay = document.getElementById('wpm');
    const accuracyDisplay = document.getElementById('accuracy');
    const restartBtn = document.getElementById('restart-btn');
    const keyboard = document.getElementById('keyboard');

    const words = [
        "the", "be", "to", "of", "and", "a", "in", "that", "have", "I",
        "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
        "this", "but", "his", "by", "from", "they", "we", "say", "her", "she",
        "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
        "so", "up", "out", "if", "about", "who", "get", "which", "go", "me"
    ];

    let timer;
    let time = 0;
    let currentWordIndex = 0;
    let correctStrokes = 0;
    let totalStrokes = 0;
    let gameStarted = false;

    function initializeGame() {
        wordsToTypeContainer.innerHTML = '';
        words.slice(0, 20).forEach(word => {
            const wordSpan = document.createElement('span');
            wordSpan.classList.add('word');
            // Wrap each letter in a span
            word.split('').forEach(letter => {
                const letterSpan = document.createElement('span');
                letterSpan.textContent = letter;
                wordSpan.appendChild(letterSpan);
            });
            wordsToTypeContainer.appendChild(wordSpan);
            // Add a space span after each word
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
        // Remove previous highlight
        keyboard.querySelectorAll('.key.highlight').forEach(key => key.classList.remove('highlight'));

        const wordSpans = wordsToTypeContainer.querySelectorAll('.word');
        if (currentWordIndex >= wordSpans.length) {
            return; // Game over
        }

        const currentWordSpan = wordSpans[currentWordIndex];
        const typedValue = userInput.value;
        const currentWord = currentWordSpan.textContent;
        const nextChar = currentWord.charAt(typedValue.length);

        if (nextChar) {
            const key = keyboard.querySelector(`.key[data-key="${nextChar.toLowerCase()}"]`);
            if (key) {
                key.classList.add('highlight');
            }
        } else if (typedValue.length === currentWord.length) { // End of word, highlight space
            const spaceKey = keyboard.querySelector(`.key[data-key=" "]`);
            if (spaceKey) {
                spaceKey.classList.add('highlight');
            }
        }
    }

    function handleKeyPressFeedback(keyChar, isCorrect) {
        const keyElement = keyboard.querySelector(`.key[data-key="${keyChar.toLowerCase()}"]`);
        if (keyElement) {
            const feedbackClass = isCorrect ? 'key-correct' : 'key-incorrect';
            keyElement.classList.add(feedbackClass);
            setTimeout(() => {
                keyElement.classList.remove(feedbackClass);
            }, 200); // Remove feedback after 200ms
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
        // WPM is often calculated based on 5-character words
        const charsTyped = correctStrokes;
        const minutes = time / 60;
        const wpm = minutes > 0 ? Math.round((charsTyped / 5) / minutes) : 0;
        wpmDisplay.textContent = wpm;
    }

    function calculateAccuracy() {
        const accuracy = totalStrokes > 0 ? Math.round((correctStrokes / totalStrokes) * 100) : 100;
        accuracyDisplay.textContent = accuracy;
    }

    userInput.addEventListener('input', () => {
        startGame();
        const wordSpans = wordsToTypeContainer.querySelectorAll('.word');
        if (currentWordIndex >= wordSpans.length) return;

        const currentWordSpan = wordSpans[currentWordIndex];
        const currentWord = currentWordSpan.textContent;
        const typedValue = userInput.value;

        totalStrokes++;

        // Handle letter-by-letter feedback
        const letterSpans = currentWordSpan.querySelectorAll('span');
        let isCorrect = true;
        for (let i = 0; i < typedValue.length; i++) {
            if (typedValue[i] === currentWord[i]) {
                letterSpans[i].classList.add('correct');
                letterSpans[i].classList.remove('incorrect');
            } else {
                letterSpans[i].classList.add('incorrect');
                letterSpans[i].classList.remove('correct');
                isCorrect = false;
            }
        }

        // Remove styling from letters that were deleted
        for (let i = typedValue.length; i < letterSpans.length; i++) {
            letterSpans[i].classList.remove('correct', 'incorrect');
        }

        // Keyboard feedback for the last typed character
        const lastChar = typedValue.slice(-1);
        const correspondingChar = currentWord[typedValue.length - 1];
        if (lastChar) {
            handleKeyPressFeedback(lastChar, lastChar === correspondingChar);
        }


        // Word completion
        if (typedValue.endsWith(' ')) {
            if (typedValue.trim() === currentWord) {
                correctStrokes += currentWord.length + 1; // +1 for space
            } else {
                 // No penalty for now, just doesn't count as correct
            }
            currentWordIndex++;
            updateCurrentWord();
            userInput.value = '';

            if (currentWordIndex === wordSpans.length) {
                clearInterval(timer);
                keyboard.querySelectorAll('.key.highlight').forEach(key => key.classList.remove('highlight'));
            }
        }

        calculateAccuracy();
        updateKeyboardHighlight();
    });

    // Handle backspace visual effect
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace') {
            const backspaceKey = keyboard.querySelector('.key[data-key="Backspace"]');
            if(backspaceKey) {
                backspaceKey.classList.add('key-correct'); // or some other highlight
                setTimeout(() => backspaceKey.classList.remove('key-correct'), 100);
            }
        }
    });

    restartBtn.addEventListener('click', () => {
        initializeGame();
    });

    initializeGame();
});
