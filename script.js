const d = document;
const button = d.getElementById("button");
const buttonDark = d.getElementById("dark");
const body = d.body;
const text1 = d.getElementById("box-1-text");
const text2 = d.getElementById("box-2-text");
const text3 = d.getElementById("box-3-text");
const box1 = d.getElementById("box-1");
const box2 = d.getElementById("box-2");
const box3 = d.getElementById("box-3");
const result = d.getElementById("result");
const checkbox = d.querySelector("#mode")
const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const displayTimer = d.getElementById("timer");
const englishInput = d.getElementById("englischinput");
const germanInput = d.getElementById("deutschinput");
const send = d.getElementById("senden");
const save = d.getElementById("speichern");
const file = d.getElementById("file-selector");
const eng = d.getElementById("eng");
const downloadLink = d.getElementById("downloadlink");
const localstorage = d.getElementById("localstorage");
const getLocalstorage = d.getElementById("getLocalstorage");
const deleteLocalstorage = d.getElementById("deleteLocalstorage");
let score = d.getElementById("score");
let scoreCorrect = 0;
let scoreTotal = 0;
let timer = 0;
let Interval = null;
let timeActive = false;
let countdownActive = false;
let vocabulary = {
    vocabularies: undefined
};
let isMuted = true;
let texts = [text1, text2, text3];
let isLoaded = false;
const audio = new Audio("soundeffect.mp3")

englishInput ? englishInput.addEventListener("keydown", (evt) => {
    if (evt.keyCode === 13) {
        safeValue();
        list();
        englishInput.value = "";
        germanInput.value = "";
        germanInput.select();

    }
}) : ""
germanInput ? germanInput.addEventListener("keydown", (evt) => {
    if (evt.keyCode === 13) {
        englishInput.select();

    }
}) : ""

//upload JSON
fetch("./scratch.json")
    .then(response => response.json())
    .then(json => vocabulary = json);

//Change mode
checkbox ? checkbox.addEventListener("change", changeMode) : '';

//Auto darkmode
if (userPrefersDark) {
    darkmode();
}

//Start Button
button ? button.addEventListener("click", randomGenerator) : '';

//Send Button
send ? send.addEventListener("click", () => {
    safeValue();
    list();
}) : '';
//Change Darkmode
buttonDark ? buttonDark.addEventListener("click", () => {
    body.classList.toggle("darkmode");
}) : '';


function randomGenerator() {
    if (isLoaded === false) {
        vocabulary = JSON.parse(localStorage.getItem("ItemS") ? localStorage.getItem("ItemS") : "{}");
    }

    if (timer === 0) {
        changeMode();
    }

    if (countdownActive) {
        startCountdown();
    }

    if (timer === 0 && timeActive) {
        startTimer();
    }
    if (timeActive) {
        if (scoreTotal >= 10) {
            end();
        }
    }


    //Generate the Vokabularies
    button.innerText = "Weiter"
    try {
        const random1 = randomNumber(0, vocabulary.vocabularies.length);
        eng.innerText = vocabulary.vocabularies[random1].eng;
        const randomBox = randomNumber(0, texts.length);
        let randomBox1 = randomNumber(0, texts.length);
        while (randomBox === randomBox1) {
            randomBox1 = randomNumber(0, texts.length);
        }
        let randomBox2 = randomNumber(0, texts.length);
        while (randomBox2 === randomBox || randomBox2 === randomBox1) {
            randomBox2 = randomNumber(0, texts.length);
        }
        texts[randomBox].innerText = vocabulary.vocabularies[random1].de;
        let random2 = randomNumber(0, vocabulary.vocabularies.length);
        while (random1 === random2) {
            return random2 = randomNumber(0, vocabulary.vocabularies.length);
        }
        texts[randomBox2].innerText = vocabulary.vocabularies[random2].de;
        let random3 = randomNumber(0, vocabulary.vocabularies.length);
        while (random1 === random3 || random2 === random3) {
            return random3 = randomNumber(0, vocabulary.vocabularies.length);
        }
        texts[randomBox1].innerText = vocabulary.vocabularies[random3].de;
    } catch (e) {
        alert("Du hast keine Vokabeln eingetragen! Drücke auf das Zahnrad um Vokabeln hinzuzufügen.")
    }


}

//Generate Random Number
function randomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

box1 ? box1.addEventListener("click", () => getValue(text1)) : '';
box2 ? box2.addEventListener("click", () => getValue(text2)) : '';
box3 ? box3.addEventListener("click", () => getValue(text3)) : '';

function getValue(text) {
    const index = vocabulary.vocabularies.findIndex(function (lel) {
        return lel.de === text.innerText
    });

    if (eng.innerText === vocabulary.vocabularies[index].eng) {
        if (!isMuted) {
            audio.play()
        }
        changeColor(true);
        result.innerText = ("Richtig. Sehr gut!");
        scoreCorrect++;
        scoreTotal++;
        randomGenerator();
    } else {
        changeColor(false);
        result.innerText = ("Falsch! Versuche es nochmal!");
        scoreTotal++;
    }

    score.innerText = scoreCorrect + "/" + scoreTotal;
}

function end() {
    if (!countdownActive) {
        if (scoreCorrect > 8) {
            alert("Du hast " + scoreCorrect + " von " + scoreTotal + " Richtig." + " Du hast " + timer + " Sekunden gebraucht. Sehr gut!");
        } else {
            alert("Du hast " + scoreCorrect + " von " + scoreTotal + " Richtig." + " Du hast " + timer + " Sekunden gebraucht. Du musst weiter üben.");
        }
        scoreTotal = 0;
        scoreCorrect = 0;
        timeActive = false;
        stopTimer()
    }

    if (countdownActive && timer === 0) {
        alert("Du hast " + scoreCorrect + " von " + scoreTotal + " in innerhalb von 20 Sekunden richtig beantwortet.")
        scoreTotal = 0;
        scoreCorrect = 0;
        timeActive = false;
        countdownActive = false;
        stopTimer()
    }
    scoreTotal = 0;
    scoreCorrect = 0;
}

function startTimer() {
    if (Interval === null) {
        Interval = setInterval(() => {
            timer++;
            displayTimer.innerText = timer;
        }, 1000);
    }
}

function startCountdown() {
    if (Interval === null) {
        Interval = setInterval(() => {
            timer--;
            displayTimer.innerText = timer;
            if (timer === 0) {
                end()
            }
        }, 1000);
    }
}

function stopTimer() {
    if (timeActive) {
        timer = 0;
    }
    if (countdownActive) {
        timer = 20;
        scoreCorrect = 0;
        scoreTotal = 0;
    }

    displayTimer.innerText = timer;
    clearInterval(Interval);
    Interval = null
}

function darkmode() {
    body.classList.toggle("darkmode");
}

function changeColor(correct) {
    if (correct) {
        d.getElementById("result").style.color = "green";
    } else {
        d.getElementById("result").style.color = "red";
    }
}

function changeMode() {
    switch (checkbox.value) {
        case "Üben":
            timeActive = false;
            countdownActive = false;
            break;
        case "Countdown":
            if (timer === 0) {
                timer = 20;
                scoreCorrect = 0;
                scoreTotal = 0;
            }
            timeActive = false;
            countdownActive = true;
            break;
        case "Timer":
            timeActive = true;
            countdownActive = false;
            break;
        default:
            timeActive = false;
            countdownActive = false;
    }
}

function safeValue() {
    vocabulary.vocabularies.push({"eng": englishInput.value, "de": germanInput.value})
}

if (save) {
    save ? save.addEventListener("click", uploadFile) : ""
}

function uploadFile() {
    const importedFile = file.files[0];

    const reader = new FileReader();
    reader.onload = function () {
        const fileContent = JSON.parse(reader.result);
        vocabulary = fileContent;
    };
    reader.readAsText(importedFile);
}

downloadLink ? downloadLink.addEventListener("click", onDownload) : ""

function download(content, fileName, contentType) {
    const a = document.createElement("a");
    const blob = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    a.click();
}

function onDownload() {
    download(JSON.stringify(vocabulary), "yourfile.json", "text/plain");
}

getLocalstorage ? getLocalstorage.addEventListener("click", () => {

    vocabulary = JSON.parse(localStorage.getItem("ItemS") ? localStorage.getItem("ItemS") : "{}")
    console.log(vocabulary)

}) : ""
localstorage ? localstorage.addEventListener("click", () => {
    localStorage.setItem("ItemS", JSON.stringify(vocabulary));
    //localStorage.setItem("ItemS", JSON.stringify(vocabulary));
}) : ""

deleteLocalstorage ? deleteLocalstorage.addEventListener("click", () => {
    localStorage.clear();

}) : "";

function list() {
    console.log(vocabulary);
    document.getElementById("vobabularies-list").innerHTML = "";
    for (const prop in vocabulary.vocabularies) {
        document.getElementById("vobabularies-list").innerHTML += "<tr>" + "<td>" + vocabulary.vocabularies[prop].eng + "</td>" + "<td>" + vocabulary.vocabularies[prop].de + "</td>" + "<td>" + "<button onclick=myFunction(" + prop + ") class='delete-btn'>" + "X" + "</button>" + "</td>" + "</tr>";
    }
}

function myFunction(prop) {
    console.log(vocabulary.vocabularies[prop]);

    if (prop > -1) {
        vocabulary.vocabularies.splice(prop, 1);

        console.log(vocabulary, "Test123");
    }
    list();
}

/*deleteLocalstorage.addEventListener("click", removeStorage)

    function removeStorage() {
        localstorage.clear()
    }
*/
// const x = localstorage.getItem("ItemS")
// console.log(x)
// if(x === "ja"){
//     alert("darf")
//
// }
