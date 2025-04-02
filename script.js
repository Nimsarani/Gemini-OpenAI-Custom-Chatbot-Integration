const promptForm=document.querySelector(".promt-form");
const promptInput=promptForm.querySelector(".prompt-input");

let userMessage = "";

const handleForSubmit = (e) => {
    e.preventDefault();
    userMessage= promptInput.value.trim();

    if(!userMessage) return;

    console.log();
}



promptForm.addEventListener("submit",handleForSubmit);