function validateForm() {
    var x = document.forms["myForm"]["fname"].value;
    if (x === "") {
        alert("Name must be filled out");
        return false;
    }
}

function login() {
    loginForm = document.getElementById("loginForm");
    registerForm = document.getElementById("registerForm");
    log = document.getElementById("login");
    reg = document.getElementById("register");
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    log.style.color = '#fff';
    reg.style.color = '#ccc';
}

function register() {
    loginForm = document.getElementById("loginForm");
    registerForm = document.getElementById("registerForm");
    log = document.getElementById("login");
    reg = document.getElementById("register");
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    log.style.color = '#ccc';
    reg.style.color = '#fff';
}

function loginSubmit() {}

function registerSubmit() {}