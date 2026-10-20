const components = [
    {
        name: "Resistor",
        symbol: "─/\\/\\─",
        category: "Passive Component",
        description: "Opposes the flow of electric current.",
        uses: "Current limiting and voltage division.",
        unit: "Ohm (Ω)"
    },
    {
        name: "Capacitor",
        symbol: "─| |─",
        category: "Passive Component",
        description: "Stores energy in an electric field.",
        uses: "Filtering and voltage smoothing.",
        unit: "Farad (F)"
    },
    {
        name: "Diode",
        symbol: "─|>|─",
        category: "Semiconductor Component",
        description: "Allows current mainly in one direction.",
        uses: "Rectification and protection.",
        unit: "Forward voltage (V)"
    },
    {
        name: "LED",
        symbol: "LED 💡",
        category: "Semiconductor Component",
        description: "Emits light when forward biased.",
        uses: "Indicators and lighting.",
        unit: "Forward voltage (V)"
    },
    {
        name: "Transistor",
        symbol: "NPN / PNP",
        category: "Semiconductor Component",
        description: "Amplifies signals or acts as a switch.",
        uses: "Amplifiers and switching circuits.",
        unit: "Voltage and current ratings"
    },
    {
        name: "Inductor",
        symbol: "─((((─",
        category: "Passive Component",
        description: "Stores energy in a magnetic field.",
        uses: "Filters and DC-DC converters.",
        unit: "Henry (H)"
    },
    {
        name: "Battery",
        symbol: "─| |─",
        category: "Power Source",
        description: "Supplies electrical energy.",
        uses: "Powering electronic circuits.",
        unit: "Volt (V)"
    },
    {
        name: "Switch",
        symbol: "─o/ o─",
        category: "Control Component",
        description: "Opens or closes an electrical circuit.",
        uses: "Turning circuits ON and OFF.",
        unit: "Voltage and current ratings"
    }
];

// NAVIGATION

function showSection(id) {
    const selected = document.getElementById(id);

    if (!selected) {
        return;
    }

    document.querySelectorAll(".section").forEach(section => {
        section.classList.remove("active");
    });

    selected.classList.add("active");

    if (id === "favorites") {
        displayFavorites();
    }

    window.scrollTo(0, 0);
}

// COMPONENT SEARCH

function displayComponents() {
    const search = document.getElementById("search");
    const list = document.getElementById("componentList");

    const query = search.value.trim().toLowerCase();

    const filtered = components.filter(component =>
        component.name.toLowerCase().includes(query) ||
        component.category.toLowerCase().includes(query) ||
        component.description.toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
        list.innerHTML = "<p>No components found.</p>";
        return;
    }

    list.innerHTML = filtered.map(component => `
        <div class="card">
            <h3>${component.name}</h3>
            <div class="symbol">${component.symbol}</div>
            <p><b>Type:</b> ${component.category}</p>
            <p>${component.description}</p>
            <p><b>Uses:</b> ${component.uses}</p>
            <p><b>Unit:</b> ${component.unit}</p>
            <button onclick="toggleFavorite('${component.name}')">
                ⭐ Add / Remove Favourite
            </button>
        </div>
    `).join("");
}

// FAVOURITES

function getFavorites() {
    try {
        const saved = JSON.parse(localStorage.getItem("favorites"));
        return Array.isArray(saved) ? saved : [];
    } catch (error) {
        return [];
    }
}

function toggleFavorite(name) {
    let favorites = getFavorites();

    if (favorites.includes(name)) {
        favorites = favorites.filter(item => item !== name);
    } else {
        favorites.push(name);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));

    if (document.getElementById("favorites").classList.contains("active")) {
        displayFavorites();
    }
}

function displayFavorites() {
    const list = document.getElementById("favoriteList");
    const favorites = getFavorites();

    const selected = components.filter(component =>
        favorites.includes(component.name)
    );

    if (selected.length === 0) {
        list.innerHTML = "<p>No favourites saved yet.</p>";
        return;
    }

    list.innerHTML = selected.map(component => `
        <div class="card">
            <h3>${component.name}</h3>
            <div class="symbol">${component.symbol}</div>
            <p>${component.description}</p>
            <button onclick="toggleFavorite('${component.name}');
                displayFavorites();">
                Remove Favourite
            </button>
        </div>
    `).join("");
}

// OHM'S LAW

function calculateOhm() {
    const vText = document.getElementById("voltage").value.trim();
    const iText = document.getElementById("current").value.trim();
    const rText = document.getElementById("resistance").value.trim();

    const inputs = [vText, iText, rText];
    const count = inputs.filter(value => value !== "").length;

    const result = document.getElementById("ohmResult");

    if (count !== 2) {
        result.textContent = "Enter exactly two values.";
        return;
    }

    const V = vText === "" ? null : Number(vText);
    const I = iText === "" ? null : Number(iText);
    const R = rText === "" ? null : Number(rText);

    if ([V, I, R].some(value =>
        value !== null && (!Number.isFinite(value) || value <= 0)
    )) {
        result.textContent = "Enter positive values only.";
        return;
    }

    if (V === null) {
        const answer = I * R;

        document.getElementById("voltage").value = answer;
        result.textContent = `Voltage = ${answer} V`;
    } else if (I === null) {
        const answer = V / R;

        document.getElementById("current").value = answer;
        result.textContent = `Current = ${answer} A`;
    } else if (R === null) {
        const answer = V / I;

        document.getElementById("resistance").value = answer;
        result.textContent = `Resistance = ${answer} Ω`;
    }
}

function clearOhm() {
    document.getElementById("voltage").value = "";
    document.getElementById("current").value = "";
    document.getElementById("resistance").value = "";
    document.getElementById("ohmResult").textContent = "";
}

// RESISTOR CALCULATOR

const colors = [
    ["Black", 0],
    ["Brown", 1],
    ["Red", 2],
    ["Orange", 3],
    ["Yellow", 4],
    ["Green", 5],
    ["Blue", 6],
    ["Violet", 7],
    ["Grey", 8],
    ["White", 9]
];

function setupColorSelect(id, multiplier = false) {
    const select = document.getElementById(id);

    select.innerHTML = colors.map(color =>
        `<option value="${color[1]}">${color[0]}</option>`
    ).join("");

    if (multiplier) {
        select.innerHTML += `
            <option value="-1">Gold × 0.1</option>
            <option value="-2">Silver × 0.01</option>
        `;
    }
}

function calculateResistor() {
    const first = Number(document.getElementById("band1").value);
    const second = Number(document.getElementById("band2").value);
    const multiplier = Number(document.getElementById("multiplier").value);

    const resistance = (first * 10 + second) * Math.pow(10, multiplier);

    let value;

    if (resistance >= 1000000) {
        value = (resistance / 1000000) + " MΩ";
    } else if (resistance >= 1000) {
        value = (resistance / 1000) + " kΩ";
    } else {
        value = resistance + " Ω";
    }

    document.getElementById("resistorResult").textContent =
        "Resistance = " + value + " (excluding tolerance)";
}

// COMPONENT COMPARISON

function setupComparison() {
    const options = components.map(component =>
        `<option value="${component.name}">${component.name}</option>`
    ).join("");

    document.getElementById("component1").innerHTML = options;
    document.getElementById("component2").innerHTML = options;

    document.getElementById("component2").selectedIndex = 1;
}

function compareComponents() {
    const firstName = document.getElementById("component1").value;
    const secondName = document.getElementById("component2").value;

    const first = components.find(item => item.name === firstName);
    const second = components.find(item => item.name === secondName);

    const result = document.getElementById("compareResult");

    result.innerHTML = `
        <table>
            <tr>
                <th>Feature</th>
                <th>${first.name}</th>
                <th>${second.name}</th>
            </tr>
            <tr>
                <td>Category</td>
                <td>${first.category}</td>
                <td>${second.category}</td>
            </tr>
            <tr>
                <td>Description</td>
                <td>${first.description}</td>
                <td>${second.description}</td>
            </tr>
            <tr>
                <td>Uses</td>
                <td>${first.uses}</td>
                <td>${second.uses}</td>
            </tr>
        </table>
    `;
}

// QUIZ

const questions = [
    {
        question: "Which component opposes current flow?",
        answers: ["Capacitor", "Resistor", "Battery", "LED"],
        correct: 1
    },
    {
        question: "What is the unit of capacitance?",
        answers: ["Ohm", "Henry", "Farad", "Volt"],
        correct: 2
    },
    {
        question: "Which component emits light?",
        answers: ["LED", "Inductor", "Switch", "Resistor"],
        correct: 0
    },
    {
        question: "Which component stores energy in a magnetic field?",
        answers: ["Diode", "Capacitor", "Inductor", "Switch"],
        correct: 2
    },
    {
        question: "What is the unit of resistance?",
        answers: ["Ampere", "Ohm", "Farad", "Watt"],
        correct: 1
    }
];

let questionIndex = 0;
let score = 0;
let answered = false;

function showQuestion() {
    const question = questions[questionIndex];

    document.getElementById("question").textContent =
        `Question ${questionIndex + 1}: ${question.question}`;

    document.getElementById("quizResult").textContent = "";

    document.getElementById("answers").innerHTML =
        question.answers.map((answer, index) => `
            <button class="answer-btn" onclick="checkAnswer(${index})">
                ${answer}
            </button>
        `).join("");

    document.getElementById("nextButton").textContent =
        questionIndex === questions.length - 1
            ? "Finish Quiz"
            : "Next Question";

    answered = false;
}

function checkAnswer(index) {
    if (answered) return;

    answered = true;

    const question = questions[questionIndex];

    document.querySelectorAll("#answers button").forEach(button => {
        button.disabled = true;
    });

    const result = document.getElementById("quizResult");

    if (index === question.correct) {
        score++;
        result.textContent = "Correct answer!";
    } else {
        result.textContent =
            "Correct answer: " + question.answers[question.correct];
    }
}

function nextQuestion() {
    if (!answered) {
        document.getElementById("quizResult").textContent =
            "Please select an answer first.";
        return;
    }

    questionIndex++;

    if (questionIndex >= questions.length) {
        document.getElementById("question").textContent =
            "Quiz Completed!";

        document.getElementById("answers").innerHTML = "";

        document.getElementById("quizResult").textContent =
            `Your final score: ${score}/${questions.length}`;

        const button = document.getElementById("nextButton");
        button.textContent = "Restart Quiz";
        button.onclick = restartQuiz;

        return;
    }

    showQuestion();
}

function restartQuiz() {
    questionIndex = 0;
    score = 0;
    answered = false;

    const button = document.getElementById("nextButton");
    button.onclick = nextQuestion;

    showQuestion();
}

// INITIAL SETUP

setupColorSelect("band1");
setupColorSelect("band2");
setupColorSelect("multiplier", true);

setupComparison();
displayComponents();
showQuestion();