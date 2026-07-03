// ===============================
// Elements
// ===============================

const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const profileMenu = document.getElementById("profileMenu");
const themeSelect = document.getElementById("themeSelect");
const textarea = document.getElementById("question");
const sendBtn = document.getElementById("sendBtn");

// ===============================
// Desktop Sidebar
// ===============================

function toggleDesktopSidebar(){

    sidebar.classList.toggle("collapsed");

    localStorage.setItem(
        "sidebar",
        sidebar.classList.contains("collapsed")
    );

}

// Restore state

window.addEventListener("load",()=>{

    if(localStorage.getItem("sidebar")==="true"){

        sidebar.classList.add("collapsed");

    }

});

// ===============================
// Mobile Sidebar
// ===============================

function toggleMobileSidebar(){

    sidebar.classList.add("show");
    overlay.classList.add("show");

}

function closeMobileSidebar(){

    sidebar.classList.remove("show");
    overlay.classList.remove("show");

}

// Close sidebar if screen resized

window.addEventListener("resize",()=>{

    if(window.innerWidth>768){

        sidebar.classList.remove("show");
        overlay.classList.remove("show");

    }

});

// ===============================
// Profile Menu
// ===============================

function toggleProfileMenu(){

    profileMenu.classList.toggle("show");

}

// Close when clicking outside

document.addEventListener("click",(e)=>{

    const profile=document.querySelector(".profile");

    if(
        !profile.contains(e.target) &&
        !profileMenu.contains(e.target)
    ){

        profileMenu.classList.remove("show");

    }

});

// ===============================
// Theme
// ===============================

window.addEventListener("load",()=>{

    const savedTheme=localStorage.getItem("theme");

    if(savedTheme){

        themeSelect.value=savedTheme;
        applyTheme(savedTheme);

    }

});

themeSelect.addEventListener("change",()=>{

    const theme=themeSelect.value;

    localStorage.setItem("theme",theme);

    applyTheme(theme);

});

function applyTheme(theme){

    if(theme==="Dark"){

        document.body.classList.add("dark");

    }

    else if(theme==="Light"){

        document.body.classList.remove("dark");

    }

    else{

        if(window.matchMedia("(prefers-color-scheme:dark)").matches){

            document.body.classList.add("dark");

        }

        else{

            document.body.classList.remove("dark");

        }

    }

}

// ===============================
// Auto Height Textarea
// ===============================

textarea.addEventListener("input",()=>{

    textarea.style.height="55px";

    textarea.style.height=textarea.scrollHeight+"px";

});

// ===============================
// Send Question
// ===============================

textarea.addEventListener("keydown", function (event) {

    if (event.key === "Enter" && !event.shiftKey) {

        event.preventDefault();

        askQuestion();

    }

});

// Send button

sendBtn.addEventListener("click", askQuestion);


// ===============================
// Ask Question
// ===============================

function askQuestion() {

    const question = textarea.value.trim();

    if (question === "") return;

    addUserMessage(question);

    textarea.value = "";

    textarea.style.height = "55px";

    showTyping();

    // Later this will call Flask API
    setTimeout(() => {

        hideTyping();

        addAIMessage("This answer will come from your uploaded PDF.");

    }, 1200);

}


// ===============================
// Chat Messages
// ===============================

const chatContainer = document.getElementById("chatContainer");

function addUserMessage(message) {

    chatContainer.innerHTML += `

    <div class="message user">

        <div class="bubble">

            ${message}

        </div>

    </div>

    `;

    chatContainer.scrollTop = chatContainer.scrollHeight;

}

function addAIMessage(message) {

    chatContainer.innerHTML += `

    <div class="message ai">

        <div class="bubble">

            ${message}

        </div>

    </div>

    `;

    chatContainer.scrollTop = chatContainer.scrollHeight;

}


// ===============================
// Typing Animation
// ===============================

const typing = document.getElementById("typingIndicator");

function showTyping() {

    typing.style.display = "block";

    chatContainer.scrollTop = chatContainer.scrollHeight;

}

function hideTyping() {

    typing.style.display = "none";

}


// ===============================
// Upload PDF
// ===============================

const pdfInput = document.getElementById("pdfInput");

pdfInput.addEventListener("change", function () {

    if (this.files.length === 0) return;

    const file = this.files[0];

    addPdfToHistory(file.name);

    document.getElementById("currentPdf").innerText = file.name;

    document.getElementById("uploadSection").style.display = "none";

    chatContainer.innerHTML = "";

});


// ===============================
// History
// ===============================

function addPdfToHistory(name) {

    const todayGroup = document.querySelector(".history-group");

    const item = document.createElement("div");

    item.className = "history-item";

    item.innerHTML = `

        <span class="material-symbols-outlined">

            picture_as_pdf

        </span>

        ${name}

    `;

    item.onclick = function () {

        openPdf(name);

    };

    todayGroup.appendChild(item);

}


// ===============================
// Open PDF
// ===============================

function openPdf(pdfName) {

    document.getElementById("currentPdf").innerText = pdfName;

    chatContainer.innerHTML = "";

}


// ===============================
// New Chat
// ===============================

document.getElementById("newChatBtn")
.addEventListener("click", function () {

    document.getElementById("uploadSection").style.display = "flex";

    chatContainer.innerHTML = "";

    document.getElementById("currentPdf").innerText =
        "AI PDF Assistant";

});


// ===============================
// Search PDF
// ===============================

document
.getElementById("searchPdf")
.addEventListener("keyup", function () {

    const search = this.value.toLowerCase();

    const items =
        document.querySelectorAll(".history-item");

    items.forEach(item => {

        if (
            item.innerText.toLowerCase().includes(search)
        ) {

            item.style.display = "flex";

        }

        else {

            item.style.display = "none";

        }

    });

});

// =====================================
// Load User Information
// =====================================

window.addEventListener("load", () => {

    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");

    if (name) {
        document.getElementById("profileName").innerText = name;
    }

    if (email) {
        document.getElementById("profileEmail").innerText = email;
    }

});

// =====================================
// Logout
// =====================================

function logout() {

    if (!confirm("Are you sure you want to logout?")) {
        return;
    }

    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("email");

    window.location.href = "/login";

}

// Logout menu

document.querySelectorAll(".profile-menu a")[3]
.addEventListener("click", function (event) {

    event.preventDefault();

    logout();

});

// =====================================
// Mobile Improvements
// =====================================

// Close sidebar after selecting PDF

document.querySelectorAll(".history-item").forEach(item => {

    item.addEventListener("click", () => {

        if (window.innerWidth <= 768) {

            closeMobileSidebar();

        }

    });

});

// Close sidebar when New Chat clicked

document
.getElementById("newChatBtn")
.addEventListener("click", () => {

    if (window.innerWidth <= 768) {

        closeMobileSidebar();

    }

});

// =====================================
// Escape Key
// =====================================

document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {

        closeMobileSidebar();

        profileMenu.classList.remove("show");

    }

});

// =====================================
// Welcome Message
// =====================================

window.addEventListener("load", () => {

    if (chatContainer.innerHTML.trim() === "") {

        addAIMessage(
            "👋 Welcome! Upload a PDF and ask questions about its contents."
        );

    }

});

// =====================================
// Drag & Drop Upload
// =====================================

const uploadCard = document.querySelector(".upload-card");

["dragenter", "dragover"].forEach(eventName => {

    uploadCard.addEventListener(eventName, (event) => {

        event.preventDefault();

        uploadCard.style.borderColor = "#7c3aed";

        uploadCard.style.background = "#faf5ff";

    });

});

["dragleave", "drop"].forEach(eventName => {

    uploadCard.addEventListener(eventName, (event) => {

        event.preventDefault();

        uploadCard.style.borderColor = "#b794f4";

        uploadCard.style.background = "white";

    });

});

uploadCard.addEventListener("drop", function (event) {

    const files = event.dataTransfer.files;

    if (files.length === 0) return;

    pdfInput.files = files;

    pdfInput.dispatchEvent(new Event("change"));

});

// =====================================
// Future Backend
// =====================================

// uploadPDF()
// askQuestion()
// loadHistory()
// deletePDF()
// renamePDF()

console.log("Dashboard Loaded Successfully");