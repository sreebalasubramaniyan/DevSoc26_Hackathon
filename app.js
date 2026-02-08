// Browser support: Chrome/Edge desktop works best.
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const clearBtn = document.getElementById("clearBtn");
const copyBtn = document.getElementById("copyBtn");

const finalText = document.getElementById("finalText");
const liveText = document.getElementById("liveText");
const statusEl = document.getElementById("status");

const langSel = document.getElementById("lang");
const interimChk = document.getElementById("interim");

let recognition = null;
let isRunning = false;

function setStatus(msg) {
  statusEl.textContent = `Status: ${msg}`;
}

function initRecognition() {
  if (!SpeechRecognition) {
    setStatus("SpeechRecognition not supported in this browser. Try Chrome/Edge.");
    startBtn.disabled = true;
    return null;
  }

  const r = new SpeechRecognition();
  r.continuous = true;
  r.interimResults = interimChk.checked;
  r.lang = langSel.value;

  r.onstart = () => {
    isRunning = true;
    startBtn.disabled = true;
    stopBtn.disabled = false;
    setStatus("listening...");
  };

  r.onend = () => {
    isRunning = false;
    startBtn.disabled = false;
    stopBtn.disabled = true;
    liveText.textContent = "";
    setStatus("stopped");
  };

  r.onerror = (e) => {
    setStatus(`error: ${e.error}`);
  };

  r.onresult = (event) => {
    let interim = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;

      if (event.results[i].isFinal) {
        finalText.value += transcript.trim() + " ";
      } else {
        interim += transcript;
      }
    }

    liveText.textContent = interimChk.checked ? interim : "";
  };

  return r;
}

function start() {
  if (!recognition) recognition = initRecognition();
  if (!recognition || isRunning) return;

  // refresh settings each time you start
  recognition.lang = langSel.value;
  recognition.interimResults = interimChk.checked;

  // Must be triggered by user gesture (button click), otherwise it won't start.
  recognition.start();
}

function stop() {
  if (recognition && isRunning) recognition.stop();
}

startBtn.addEventListener("click", start);
stopBtn.addEventListener("click", stop);

clearBtn.addEventListener("click", () => {
  finalText.value = "";
  liveText.textContent = "";
  setStatus("cleared");
});

copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(finalText.value.trim());
    setStatus("copied to clipboard");
  } catch {
    setStatus("copy failed (browser blocked clipboard).");
  }
});
