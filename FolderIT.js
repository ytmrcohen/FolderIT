const Confirmsignup = document.getElementById("savebutton");
const signup = document.getElementById("passwordinput");

const Confirmlogin = document.getElementById("savebuttonlog");
const signin = document.getElementById("passwordinputlog");

const result = document.getElementById("result");
const Show = document.getElementById("showbox");
const Showlog = document.getElementById("showboxlog");




Show.addEventListener("click", () => {
    signupbox.style.display = "flex";
});
Showlog.addEventListener("click", () => {
    signinbox.style.display = "flex";
});




let userPassword = "";

Confirmsignup.addEventListener("click", function() {
    userPassword = signup.value.trim();
    result.textContent = "Signup completed succesfully";
});
 
Confirmlogin.addEventListener("click", function() {
    const signinValue = signin.value.trim();

    if(signinValue == userPassword){
        result.textContent = "WELCOM IN!"
        window.location.href = "userpage.html";
    }else{
        result.textContent = "Wrong Username or Password";
    }
});