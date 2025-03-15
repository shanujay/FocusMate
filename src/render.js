// Main Page Elements
const mainPage = document.getElementById("mainPage");
// Images
const moonImage = document.getElementById("moonImg");
const bunnyImage = document.getElementById("bunnyImg");
// Buttons
const focusButton = document.getElementById("focusButton");
const deepFocusButton = document.getElementById("deepFocusButton");


// Audio Object 
const clickSound = new Audio('assets/sounds/click.mp3');
const notificationSound = new Audio('assets/sounds/shine-sound.mp3');


// Timer Page Elements
const timerPage = document.getElementById("timerPage");
const timerDisplay = document.getElementById("timer");
const pomodoroTimer = document.getElementById("pomodoroTimer");
// Timer Controls
const controlButtons = document.getElementById("controlButtons");
const pauseResumeButton = document.getElementById("pauseResumeButton");
const stopButton = document.getElementById("stopButton");
// Time Durations
const focusDuration = 20 * 60;
const deepFocusDuration = 50 * 60;
const breakDuration = 10 * 60; // 10-minute break

let countdown;
let timeLeft;
let initialTime;
let isPaused = false;

// Stages
const totalFocusStages = 7;
const totalBreakStages = 23;

// Timer Images
const pomodoroTimerImages = [
    "assets/timer/Timer_1.png", 
    "assets/timer/Timer_2.png",
    "assets/timer/Timer_3.png",
    "assets/timer/Timer_4.png",
    "assets/timer/Timer_5.png",
    "assets/timer/Timer_6.png",
    "assets/timer/Timer_7.png",
];

// Break Timer Images
const breakTimerImages = Array.from({ length: 23 }, (_, i) => `assets/break/breakTimerImg_${i + 1}.png`);

// Window Controls
// Minimize window
document.getElementById("minimize-btn").addEventListener("click", () => {
    window.electron.minimizeWindow();  // Call the method exposed in preload.js
});
// Close window
document.getElementById("close-btn").addEventListener("click", () => {
    window.electron.closeWindow();  // Call the method exposed in preload.js
});


// Main Page Functions
// Focus Button
focusButton.addEventListener("click", () => {
    clickSound.play();
    setTimerPage();
    startPomodoroSession(focusDuration, false);
});
// Deep Focus Button
deepFocusButton.addEventListener("click", () => {
    clickSound.play();
    setTimerPage();
    startPomodoroSession(deepFocusDuration, false);
});


// Timer Page Functions
// Timer Controls
// Pause/Resume Button
pauseResumeButton.addEventListener("click", () => {
    // click sound
    clickSound.play();

    if (isPaused) {
        isPaused = false;
        countdownTimer(timeLeft, false);
        pauseResumeButton.src = "assets/pause_btn_img.png"; 
    } else {
        isPaused = true;
        clearInterval(countdown);
        pauseResumeButton.src = "assets/play_btn_img.png";
    }
});
// Stop Button
stopButton.addEventListener("click", () => {
    clearInterval(countdown);
    // click sound
    clickSound.play();

    let confirmStop = confirm("Do you want to stop the timer?");
    
    if (confirmStop) {
        resetMainPage();
    } else {
        // Resume timer
        countdownTimer(timeLeft, false);
    }
});


// Timer Page Set Function
function setTimerPage() {
    mainPage.style.display = "none";
    timerPage.style.display = "flex";
}
// Reset Main Page Function
function resetMainPage() {
    mainPage.style.display = "flex";
    timerPage.style.display = "none";
    clearInterval(countdown);
}

// Start Pomodoro Session Function
async function startPomodoroSession(sessionType, isBreak) {
    let totalPomodoroCount = 0;
    let totalBreakCount = 0;

    while (totalPomodoroCount < 2) {
        totalPomodoroCount++;
        console.log(`Starting Pomodoro Session ${totalPomodoroCount}`);

        controlButtons.style.display = "flex";
        
        resetTimerImage(false);
        await countdownTimer(sessionType, false); 

        // Play notification sound 
        notificationSound.play();

        if (totalBreakCount < 2) {
            totalBreakCount++;
            console.log(`Starting Break ${totalBreakCount}`);
            let takeBreak = confirm("Time's up! Do you want to take a 10-minute break?");
            if (takeBreak) {
                resetTimerImage(true);
                controlButtons.style.display = "none";
                await countdownTimer(breakDuration, true);

                // Play notification sound 
                notificationSound.play();

                alert("Break is over! Starting next Pomodoro session.");
            }
        }
    }
    resetMainPage();
}

// Timer countdown function
function countdownTimer(duration, isBreak) {
    return new Promise((resolve) => {
        clearInterval(countdown);
        timeLeft = duration;
        initialTime = duration;
        isPaused = false;

        countdown = setInterval(() => {
            if (isPaused) return;

            let minutes = Math.floor(timeLeft / 60);
            let seconds = timeLeft % 60;
            timerDisplay.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

            updateTimerImage(isBreak);

            if (timeLeft <= 0) {
                clearInterval(countdown);
                resolve();
            }

            timeLeft--;
        }, 1000);
    });
}

// Timer Image update Function
function updateTimerImage(isBreak) {
    const elapsedTime = initialTime - timeLeft;
    const totalStages = isBreak ? totalBreakStages : totalFocusStages;
    const images = isBreak ? breakTimerImages : pomodoroTimerImages;

    const currentStage = Math.floor((elapsedTime / initialTime) * totalStages);

    if (currentStage < images.length) {
        pomodoroTimer.src = images[currentStage];
    }
}

// Reset Timer Image Function
function resetTimerImage(isBreak) {
    pomodoroTimer.src = isBreak ? breakTimerImages[0] : pomodoroTimerImages[0];
}
