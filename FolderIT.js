#variables_of_login_and_sign_up_boxes    
const Confirmsignup = document.getElementById("savebutton");
const signup = document.getElementById("passwordinput");

const Confirmlogin = document.getElementById("savebuttonlog");
const signin = document.getElementById("passwordinputlog");

const result = document.getElementById("result");
const Show = document.getElementById("showbox");
const Showlog = document.getElementById("showboxlog");

#reveals_the_login_and_signup_boxes_on_button_press   
Show.addEventListener("click", () => {
    signupbox.style.display = "flex";
});
Showlog.addEventListener("click", () => {
    signinbox.style.display = "flex";
});

#gets_user_password_in_signup
let userPassword = "";

Confirmsignup.addEventListener("click", function() {
    userPassword = signup.value.trim();
    result.textContent = "Signup completed succesfully";
});

#checks_in_login_if_it_matches_the_signup
Confirmlogin.addEventListener("click", function() {
    const signinValue = signin.value.trim();

    if(signinValue == userPassword){
        result.textContent = "WELCOM IN!"
        window.location.href = "userpage.html";
    }else{
        result.textContent = "Wrong Username or Password";
    }

});
