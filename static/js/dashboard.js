// ===========================================
// ELEMENTS
// ===========================================

const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

const menuButton = document.getElementById("menuButton");

const profileButton = document.getElementById("profileButton");
const profileModal = document.getElementById("profileModal");
const closeProfile = document.getElementById("closeProfile");

const browseBtn = document.getElementById("browseBtn");
const pdfInput = document.getElementById("pdfInput");

const uploadSection = document.getElementById("uploadSection");

const question = document.getElementById("question");
const sendBtn = document.getElementById("sendBtn");

const typingIndicator = document.getElementById("typingIndicator");

const chatContainer = document.getElementById("chatContainer");

const searchInput = document.getElementById("searchInput");

const historyContainer = document.getElementById("historyContainer");

const chatTitle = document.getElementById("chatTitle");
let selectedDocumentId = null;

// ===========================================
// MOBILE SIDEBAR
// ===========================================

menuButton.addEventListener("click", () => {

    sidebar.classList.add("show");

    overlay.classList.add("show");

});

overlay.addEventListener("click", closeSidebar);

function closeSidebar(){

    sidebar.classList.remove("show");

    overlay.classList.remove("show");

}

window.addEventListener("resize",()=>{

    if(window.innerWidth>768){

        closeSidebar();

    }

});


// ===========================================
// PROFILE MODAL
// ===========================================

profileButton.addEventListener("click",()=>{

    profileModal.classList.add("show");

});

closeProfile.addEventListener("click",()=>{

    profileModal.classList.remove("show");

});

profileModal.addEventListener("click",(e)=>{

    if(e.target===profileModal){

        profileModal.classList.remove("show");

    }

});


// ===========================================
// ESC KEY
// ===========================================

document.addEventListener("keydown",(e)=>{

    if(e.key==="Escape"){

        profileModal.classList.remove("show");

        closeSidebar();

    }

});


// ===========================================
// THEME
// ===========================================

const radios =
document.querySelectorAll(
'input[name="theme"]'
);

window.addEventListener("load",()=>{

    const savedTheme =
    localStorage.getItem("theme") || "system";

    document.querySelector(
`input[value="${savedTheme}"]`
).checked=true;

    applyTheme(savedTheme);

});

radios.forEach(r=>{

    r.addEventListener("change",()=>{

        localStorage.setItem("theme",r.value);

        applyTheme(r.value);

    });

});

function applyTheme(theme){

    document.body.classList.remove("dark");

    if(theme==="dark"){

        document.body.classList.add("dark");

    }

    if(theme==="system"){

        if(window.matchMedia("(prefers-color-scheme:dark)").matches){

            document.body.classList.add("dark");

        }

    }

}
// ===========================================
// PDF UPLOAD
// ===========================================
async function uploadPDF(file){

    const token = localStorage.getItem("token");

    const formData = new FormData();

    formData.append(
        "file",
        file
    );

    try{

        const response = await fetch(
            "/pdf/upload",
            {
                method:"POST",

                headers:{
                    "Authorization":`Bearer ${token}`
                },

                body:formData
            }
        );

        const result = await response.json();

        if(!response.ok){

            alert(result.message);

            return;

        }

        uploadSection.style.display="none";

        question.disabled=false;

        sendBtn.disabled=false;

        document.getElementById(
            "chatTitle"
        ).innerText=file.name;

        loadPDFHistory();

        alert("PDF uploaded successfully");

    }

    catch(error){

        console.log(error);

        alert("Upload failed");

    }

}
browseBtn.addEventListener("click",()=>{

    pdfInput.click();

});

pdfInput.addEventListener("change",()=>{

    if(pdfInput.files.length===0){

        return;

    }

    uploadPDF(pdfInput.files[0]);

    if(window.innerWidth<=768){

        closeSidebar();

    }

});

// ===========================================
// DRAG & DROP
// ===========================================

const uploadCard=document.querySelector(".upload-card");

["dragenter","dragover"].forEach(eventName=>{

    uploadCard.addEventListener(eventName,(e)=>{

        e.preventDefault();

        uploadCard.style.borderColor="#7c3aed";

        uploadCard.style.background="#faf5ff";

    });

});

["dragleave","drop"].forEach(eventName=>{

    uploadCard.addEventListener(eventName,(e)=>{

        e.preventDefault();

        uploadCard.style.borderColor="";

        uploadCard.style.background="";

    });

});

uploadCard.addEventListener("drop",(e)=>{

    const files=e.dataTransfer.files;

    if(files.length===0) return;

    pdfInput.files=files;

    uploadPDF(files[0]);

});

// ===========================================
// PDF HISTORY
// ===========================================

function addPdfHistory(id,name){

    let todayGroup=document.querySelector(".history-group");

    if(!todayGroup){

        todayGroup=document.createElement("div");

        todayGroup.className="history-group";

        todayGroup.innerHTML=`
        <div class="group-title">
            Today
        </div>
        `;

        historyContainer.prepend(todayGroup);

    }

    const item=document.createElement("div");

    item.className="history-item";

    item.innerHTML = `

    <span class="material-symbols-outlined">

        picture_as_pdf

    </span>

    <span class="pdf-name">

        ${name}

    </span>

    <button
        class="delete-pdf"
        onclick="deletePDF('${id}',event)">

        <span class="material-symbols-outlined">

            delete

        </span>

    </button>

`;

    item.addEventListener("click",()=>{

        document.querySelectorAll(".history-item")
        .forEach(i=>i.classList.remove("active"));

        item.classList.add("active");
        selectedDocumentId = id;

        chatTitle.innerText=name;

        if(window.innerWidth<=768){

            closeSidebar();

        }

    });

    todayGroup.appendChild(item);

}
async function loadPDFHistory(){

    const token = localStorage.getItem("token");

    try{

        const response = await fetch("/pdf/list",{

            headers:{
                Authorization:`Bearer ${token}`
            }

        });

        const result = await response.json();

        if(!response.ok){

            return;

        }

        historyContainer.innerHTML="";

        result.documents.forEach(pdf=>{

            addPdfHistory(pdf.id, pdf.name);

        });

    }

    catch(error){

        console.error(error);

    }

}
async function deletePDF(id,event){

    event.stopPropagation();

    if(!confirm("Delete this PDF?")){

        return;

    }

    const token = localStorage.getItem("token");

    const response = await fetch(

        `/pdf/delete/${id}`,

        {

            method:"DELETE",

            headers:{
                Authorization:`Bearer ${token}`
            }

        }

    );

    const result = await response.json();

    alert(result.message);

    loadPDFHistory();

}

// ===========================================
// SEARCH HISTORY
// ===========================================

searchInput.addEventListener("input",()=>{

    const keyword=searchInput.value.toLowerCase();

    document.querySelectorAll(".history-item")
    .forEach(item=>{

        item.style.display=
        item.innerText.toLowerCase().includes(keyword)
        ? "flex"
        : "none";

    });

});

// ===========================================
// NEW CHAT
// ===========================================

document
.getElementById("newChatBtn")
.addEventListener("click",()=>{

    uploadSection.style.display="flex";

    question.disabled=true;

    sendBtn.disabled=true;

    question.value="";

    chatTitle.innerText="AI PDF Assistant";

    chatContainer.innerHTML=`
        <div class="welcome">

            <span class="material-symbols-outlined">
                auto_awesome
            </span>

            <h2>
                Welcome to AI PDF Assistant
            </h2>

            <p>
                Upload a PDF and start asking questions.
            </p>

        </div>
    `;

    if(window.innerWidth<=768){

        closeSidebar();

    }

});

// ===========================================
// LOAD USER
// ===========================================

window.addEventListener("load", () => {

    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");

    if (name) {

        document.getElementById("userName").textContent = name;
        document.getElementById("modalUserName").textContent = name;

        const initials = name
            .trim()
            .split(" ")
            .map(word => word[0])
            .join("")
            .toUpperCase();

        document.querySelector(".avatar").textContent = initials;
        document.querySelector(".profile-avatar").textContent = initials;

    }

    if (email) {

        document.getElementById("userEmail").textContent = email;
        document.getElementById("modalUserEmail").textContent = email;

    }
    loadPDFHistory();
    loadChatHistory();

});

// ===========================================
// AUTO RESIZE TEXTAREA
// ===========================================

question.addEventListener("input", () => {

    question.style.height = "56px";
    question.style.height = question.scrollHeight + "px";

});

// ===========================================
// SEND MESSAGE
// ===========================================

sendBtn.addEventListener("click", sendMessage);

question.addEventListener("keydown", (e) => {

    if (e.key === "Enter" && !e.shiftKey) {

        e.preventDefault();

        sendMessage();

    }

});
async function sendMessage() {

    const text = question.value.trim();

    if (text === "") return;

    removeWelcome();

    addUserMessage(text);

    question.value = "";

    question.style.height = "56px";

    showTyping();

    const token = localStorage.getItem("token");

    try {

        const response = await fetch("/chat/ask", {

            method: "POST",

            headers: {

                "Content-Type": "application/json",

                "Authorization": `Bearer ${token}`

            },

            body: JSON.stringify({

                question: text,
                document_id: selectedDocumentId

            })

        });

        const result = await response.json();

        hideTyping();

        if (!response.ok) {

            addAIMessage(result.message);

            return;

        }

        addAIMessage(result.answer);

    }

    catch (error) {

        hideTyping();

        console.error(error);

        addAIMessage("Something went wrong.");

    }

}

// ===========================================
// USER MESSAGE
// ===========================================

function addUserMessage(message) {

    const div = document.createElement("div");

    div.className = "message user";

    div.innerHTML = `

        <div class="bubble">

            ${message}

        </div>

    `;

    chatContainer.appendChild(div);

    scrollBottom();

}

// ===========================================
// AI MESSAGE
// ===========================================

function addAIMessage(message) {

    const div = document.createElement("div");

    div.className = "message ai";

    div.innerHTML = `

        <div class="bubble">

            ${message}

        </div>

    `;

    chatContainer.appendChild(div);

    scrollBottom();

}
async function loadChatHistory(){

    const token = localStorage.getItem("token");

    try{

        const response = await fetch("/chat/history",{

            headers:{
                Authorization:`Bearer ${token}`
            }

        });

        const result = await response.json();

        if(!response.ok){

            return;

        }

        result.history.forEach(chat=>{

            addUserMessage(chat.question);

            addAIMessage(chat.answer);

        });

    }

    catch(error){

        console.error(error);

    }

}

// ===========================================
// REMOVE WELCOME
// ===========================================

function removeWelcome() {

    const welcome = document.querySelector(".welcome");

    if (welcome) {

        welcome.remove();

    }

}

// ===========================================
// TYPING
// ===========================================

function showTyping() {

    typingIndicator.style.display = "block";

    scrollBottom();

}

function hideTyping() {

    typingIndicator.style.display = "none";

}

// ===========================================
// SCROLL
// ===========================================

function scrollBottom() {

    chatContainer.scrollTop = chatContainer.scrollHeight;

}
// ===========================================
// LOGOUT
// ===========================================

document
.getElementById("logoutBtn")
.addEventListener("click", logout);

function logout() {

    const confirmLogout = confirm(
        "Are you sure you want to logout?"
    );

    if (!confirmLogout) return;

    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("theme");

    window.location.href = "/login";

}

// ===========================================
// PREVENT DROP OUTSIDE UPLOAD CARD
// ===========================================

window.addEventListener("dragover", (e) => {

    e.preventDefault();

});

window.addEventListener("drop", (e) => {

    e.preventDefault();

});

// ===========================================
// HISTORY ACTIVE ITEM
// ===========================================

document
.querySelectorAll(".history-item")
.forEach(item => {

    item.addEventListener("click", () => {

        document
        .querySelectorAll(".history-item")
        .forEach(i => i.classList.remove("active"));

        item.classList.add("active");

        chatTitle.innerText = item.innerText.trim();

        if (window.innerWidth <= 768) {

            closeSidebar();

        }

    });

});

// ===========================================
// SYSTEM THEME CHANGE LISTENER
// ===========================================

window.matchMedia("(prefers-color-scheme: dark)")
.addEventListener("change", () => {

    const theme = localStorage.getItem("theme");

    if (theme === "system") {

        applyTheme("system");

    }

});

// ===========================================
// FUTURE BACKEND HOOKS
// ===========================================

// uploadPDF(file)
// askQuestion(question)
// getChatHistory()
// loadUserPDFs()
// deletePDF(pdfId)
// renamePDF(pdfId)
// downloadPDF(pdfId)
// updateProfile()
// changePassword()

// ===========================================
// READY
// ===========================================

console.clear();

console.log("====================================");

console.log("AI PDF Assistant Dashboard V2 Ready");

console.log("====================================");