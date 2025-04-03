const chatsContainer = document.querySelector(".chats-container");
const promptForm = document.querySelector(".prompt-form");
const promptInput = promptForm.querySelector(".prompt-input");

//API setup
const API_KEY="AIzaSyDROdSwOzRx-YGvvFzXmQNLeJJf8tHbCEk";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

let userMessage = "";
const chatHistory = [];

// Function to create message elements
const createMsgElemet = (content, ...classes) => {
    const div = document.createElement("div");
    div.classList.add("message",...classes);
    div.innerHTML= content;
    return div;
}

//Make the API call and generate the bot's response
const generateResponse = async (botMsgHTML) => {
    const textElement = botMsgHTML.querySelector(".message-text")

    //Add user message to the chat history
    chatHistory.push({
        role:"user",
        parts: [{text:userMessage}]
    });


    try{
        //Send the chat history to the API to get a response
        const response = await fetch(API_URL,{
            method: "POST",
            headers:{"Content-Type": "application/json"},
            body: JSON.stringify({contents: chatHistory})
        });

        const data = await response.json();
        if(!response.ok) throw new Error(data.error.message);

        //Process the response text and display it
        const responseText = data.candidate[0].content.parts[0].text.replace(/\*\*([^*]+)\*\*/g, "$1").trim();
        textElement.textContent = responseText;
    } catch (error) {
        console.log(error);
    }
}

//Handle the form submission
const handleFormSubmit = (e) => {
    e.preventDefault();
    userMessage = promptInput.value.trim();
    if (!userMessage) return;

    promptInput.value =  "";

    //Generate user message HTML and add in the chats container
    const userMsgHTML = '<p class="message-text"></p>';
    const userMsgDiv = createMsgElemet(userMsgHTML, "user-message");

    userMsgDiv.querySelector(".message-text").textContent = userMessage;
    chatsContainer.appendChild(userMsgDiv);

    setTimeout(() => {
    //Generate bot message HTML and add in the chats container after 600ms
        const botMsgHTML = '<img src="gemini-chatbot-logo.svg" class="avatar"><p class="message-text">Just a sec...</p>';
        const botMsgDiv = createMsgElemet(botMsgHTML, "bot-message", "loading");
        chatsContainer.appendChild(botMsgDiv);
        generateResponse(botMsgHTML);
        }, 600);
}

promptForm.addEventListener("submit",handleFormSubmit)