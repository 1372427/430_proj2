"use strict";

var handleLogin = function handleLogin(e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    if ($("#user").val() == '' || $("#pass").val() == '') {
        handleError("RAWR! Username or password is empty");
        return false;
    }

    console.log($("input[name=_csrf]").val());

    sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

    return false;
};

var handleSignup = function handleSignup(e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    if ($("#user").val() === '' || $("#pass").val() === '' || $("#pass2").val() === '' || $("#email").val() === '') {
        handleError("Meow! All fields are required");
        return false;
    }

    if ($("#pass").val() !== $("#pass2").val()) {
        handleError("Meow! Passwords do not match");
        return false;
    }

    var emailCheck1 = $("#email").val().split('@');

    if (emailCheck1.length !== 2 || emailCheck1[0].length < 1 || emailCheck1[1].length < 1) {
        handleError("Meow! Invalid email");
        return false;
    }
    var emailCheck2 = emailCheck1[1].split('.');
    if (emailCheck2.length < 2 || emailCheck2[0].length < 1 || emailCheck2[1].length < 1) {

        handleError("Meow! Invalid email");
        return false;
    }

    sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

    return false;
};

var LoginWindow = function LoginWindow(props) {

    $("#domoMessage").animate({ width: 'hide' }, 350);
    document.querySelector('#loginButton').classList.add('active');
    document.querySelector('#signupButton').classList.remove('active');

    return React.createElement(
        "form",
        { id: "loginForm", name: "loginForm",
            onSubmit: handleLogin,
            action: "/login",
            method: "POST",
            className: "mainForm"
        },
        React.createElement(
            "label",
            { htmlFor: "username" },
            "Username: "
        ),
        React.createElement("input", { id: "user", type: "text", name: "username", placeholder: "username" }),
        React.createElement(
            "label",
            { htmlFor: "pass" },
            "Password: "
        ),
        React.createElement("input", { id: "pass", type: "password", name: "pass", placeholder: "password" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "formSubmit", type: "submit", value: "Sign in" })
    );
};

var SignupWindow = function SignupWindow(props) {

    $("#domoMessage").animate({ width: 'hide' }, 350);
    document.querySelector('#loginButton').classList.remove('active');
    document.querySelector('#signupButton').classList.add('active');

    return React.createElement(
        "form",
        { id: "signupForm",
            name: "signupForm",
            onSubmit: handleSignup,
            action: "/signup",
            method: "POST",
            className: "mainForm"
        },
        React.createElement(
            "label",
            { htmlFor: "username" },
            "Username: "
        ),
        React.createElement("input", { id: "user", type: "text", name: "username", placeholder: "username" }),
        React.createElement(
            "label",
            { htmlFor: "email" },
            "Email: "
        ),
        React.createElement("input", { id: "email", type: "text", name: "email", placeholder: "email" }),
        React.createElement(
            "label",
            { htmlFor: "pass" },
            "Password: "
        ),
        React.createElement("input", { id: "pass", type: "password", name: "pass", placeholder: "password" }),
        React.createElement(
            "label",
            { htmlFor: "pass2" },
            "Password: "
        ),
        React.createElement("input", { id: "pass2", type: "password", name: "pass2", placeholder: "retype password" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "formSubmit", type: "submit", value: "Sign Up" })
    );
};

var createLoginWindow = function createLoginWindow(csrf) {
    ReactDOM.render(React.createElement(LoginWindow, { csrf: csrf }), document.querySelector("#content"));
};

var createSignupWindow = function createSignupWindow(csrf) {
    ReactDOM.render(React.createElement(SignupWindow, { csrf: csrf }), document.querySelector("#content"));
};

var setup = function setup(csrf) {
    var loginButton = document.querySelector("#loginButton");
    var signupButton = document.querySelector("#signupButton");

    signupButton.addEventListener("click", function (e) {
        e.preventDefault();
        createSignupWindow(csrf);
        return false;
    });

    loginButton.addEventListener("click", function (e) {
        e.preventDefault();
        createLoginWindow(csrf);
        return false;
    });

    createLoginWindow(csrf); //default view
};

var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        console.log('test');
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});
"use strict";

var handleError = function handleError(message) {
    $("#errorMessage").text(message);
    $("#domoMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
    $("#domoMessage").animate({ width: 'hide' }, 350);
    window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success, dataType) {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: dataType ? dataType : "json",
        success: success,
        error: function error(xhr, status, _error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};