const signUp = document.getElementById("passwordInputSign");
const showBoxSign = document.getElementById("showBoxSign");
const signUpBox = document.getElementById("signUpBox");
const saveButtonSign = document.getElementById("saveButtonSign");

const logIn = document.getElementById("passwordInputLog");
const showBoxLog = document.getElementById("showBoxLog");
const logInBox = document.getElementById("logInBox");
const saveButtonLog = document.getElementById("saveButtonLog");

const signLogSave = document.getElementById("signLogSave");
const overlay = document.getElementById("overlay");
const loader = document.getElementById("loader");
// signUp box //
showBoxSign.addEventListener("click", () => {
    signLogSave.style.display = "none";
    overlay.style.display = "block";
    signUpBox.style.display = "flex";
});
// LogIn box //
showBoxLog.addEventListener("click", () => {
    signLogSave.style.display = "none";
    overlay.style.display = "block";
    logInBox.style.display = "flex";
});

let userPassword = "";
// save button of logIn //
saveButtonSign.addEventListener("click", () => {
    const passwordValue = signUp.value.trim();

    if (passwordValue !== "") {
        userPassword = passwordValue;
        signLogSave.textContent = "Congratulations you signed up";
        signLogSave.style.display = "block";
        overlay.style.display = "none";
        signUpBox.style.display = "none";
    } else {
        signLogSave.textContent = "No valid password";
        signLogSave.style.display = "block";
    }
});
// save button of signUp
saveButtonLog.addEventListener("click", () => {
    const logInValue = logIn.value.trim();

    if (logInValue === userPassword && userPassword !== "") {
        signLogSave.style.display = "block";
        overlay.style.display = "none";
        logInBox.style.display = "none";
        signLogSave.textContent = "You are loged in";
        window.location.href = "https://ytmrcohen.github.io/FolderIT/";

    } else if (logInValue === userPassword && userPassword === "") {
        signLogSave.style.display = "block";
        signLogSave.textContent = "No valid password";
    } else {
        signLogSave.style.display = "block";
        signLogSave.textContent = "Wrong Password";
    }
});

overlay.addEventListener("click", () => {
    overlay.style.display = "none";
    signUpBox.style.display = "none";
    logInBox.style.display = "none";
    signLogSave.textContent = "";
});
