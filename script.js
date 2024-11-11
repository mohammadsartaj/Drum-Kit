// Lesson patterns with key codes
const lessons = {
    we_will_rock_you: [65, 65, 68], // Clap, Clap, Kick
    back_in_black: [68, 65, 72, 65, 68], // Kick, Clap, Ride, Clap, Kick
    smells_like_teen_spirit: [83, 68, 83, 70, 83, 68, 83], // Hi-Hat, Kick, Hi-Hat, Open-Hat...
    yo_yo_honey_singh: [68, 74, 68, 74, 83, 83, 68, 74], // Kick, Snare, Kick, Snare, Hi-Hat, Hi-Hat, Kick, Snare
    desi_kalakar: [70, 68, 74, 68, 74, 83, 74, 68, 70] // Open-Hat, Kick, Snare, Kick, Snare, Hi-Hat, Snare, Kick, Open-Hat
};

const playButton = document.getElementById("play-for-me");
const tryButton = document.getElementById("try-yourself");

document.getElementById("lesson-select").addEventListener("change", selectLesson);
playButton.addEventListener("click", playForMe);
tryButton.addEventListener("click", tryYourself);

function selectLesson(event) {
    const lessonName = event.target.value;
    if (lessons[lessonName]) {
        displayLesson(lessonName);
    } else {
        document.getElementById("lesson-display").textContent = "";
    }
}

function displayLesson(lessonName) {
    const lessonPattern = lessons[lessonName];
    const lessonKeys = lessonPattern.map((keyCode) => {
        const keyElement = document.querySelector(`div[data-key="${keyCode}"]`);
        const soundText = keyElement ? keyElement.querySelector(".sound").textContent : "";
        const keyText = keyElement ? keyElement.querySelector("kbd").textContent : "";
        return `<span class="highlight-key">"${keyText}"</span>`; // Highlighted key
    });
    document.getElementById("lesson-display").innerHTML = `Pattern: ${lessonKeys.join(" -> ")}`;
}

function playForMe() {
    const lessonName = document.getElementById("lesson-select").value;
    const lessonPattern = lessons[lessonName];
    if (!lessonPattern) return;

    playButton.disabled = true;
    tryButton.disabled = true;

    lessonPattern.forEach((keyCode, index) => {
        setTimeout(() => {
            const audio = document.querySelector(`audio[data-key="${keyCode}"]`);
            const key = document.querySelector(`div[data-key="${keyCode}"]`);
            if (!audio || !key) return;

            key.classList.add("playing");
            audio.currentTime = 0;
            audio.play();

            setTimeout(() => key.classList.remove("playing"), 200);
        }, index * 600); // Delay between notes
    });

    // Re-enable buttons after the sequence completes
    setTimeout(() => {
        playButton.disabled = false;
        tryButton.disabled = false;
    }, lessonPattern.length * 600);
}

function tryYourself() {
    const lessonName = document.getElementById("lesson-select").value;
    if (!lessons[lessonName]) return;

    displayLesson(lessonName);
}

// Function to handle key presses for manual play
function removeTransition(e) {
    if (e.propertyName !== "transform") return;
    e.target.classList.remove("playing");
}

function playSound(e) {
    const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`);
    const key = document.querySelector(`div[data-key="${e.keyCode}"]`);
    if (!audio) return;

    key.classList.add("playing");
    audio.currentTime = 0;
    audio.play();
}

// Enable mouse clicks to play sounds
function playSoundByClick(e) {
    if (!e.target.closest('.key')) return; // Ignore clicks outside keys
    const key = e.target.closest('.key');
    const keyCode = key.getAttribute('data-key');
    const audio = document.querySelector(`audio[data-key="${keyCode}"]`);
    if (!audio) return;

    key.classList.add("playing");
    audio.currentTime = 0;
    audio.play();
}

const keys = Array.from(document.querySelectorAll(".key"));
keys.forEach((key) => key.addEventListener("transitionend", removeTransition));
window.addEventListener("keydown", playSound);
document.querySelector(".keys").addEventListener("click", playSoundByClick);

// Optional: Disable buttons if no lesson is selected
function updateButtonsState() {
    const lessonName = document.getElementById("lesson-select").value;
    playButton.disabled = !lessonName;
    tryButton.disabled = !lessonName;
}

// Update button state when lesson is selected
document.getElementById("lesson-select").addEventListener("change", updateButtonsState);

// Initialize button state on page load
updateButtonsState();
