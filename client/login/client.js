const handleLogin = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'}, 350);

    if($("#user").val() == '' || $("#pass").val() == ''){
        handleError("RAWR! Username or password is empty");
        return false;
    }

    console.log($("input[name=_csrf]").val());
    
    sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

    return false;
};


const handleSignup = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'}, 350);

    if($("#user").val() === '' || $("#pass").val() === '' || $("#pass2").val() === '' || $("#email").val() === ''){
        handleError("Meow! All fields are required");
        return false;
    }

    if( $("#pass").val() !==  $("#pass2").val()){
        handleError("Meow! Passwords do not match");
        return false;
    }

    const emailCheck1 = $("#email").val().split('@');

    if( emailCheck1.length !== 2 || emailCheck1[0].length<1 || emailCheck1[1].length<1){
        handleError("Meow! Invalid email");
        return false;
    }
    const emailCheck2 = emailCheck1[1].split('.');
    if(emailCheck2.length< 2 || emailCheck2[0].length<1 || emailCheck2[1].length<1 ){
        
        handleError("Meow! Invalid email");
        return false;
    }
    
    sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

    return false;
};

const LoginWindow = (props) => {
    
    $("#domoMessage").animate({width:'hide'}, 350);
    document.querySelector('#loginButton').classList.add('active');
    document.querySelector('#signupButton').classList.remove('active');

    return (
        <form id="loginForm" name="loginForm"
            onSubmit={handleLogin}
            action="/login"
            method="POST"
            className="mainForm"
        >
        <label htmlFor="username">Username: </label>
        <input id="user" type="text" name="username" placeholder="username"/>
        <label htmlFor="pass">Password: </label>
        <input id="pass" type="password" name="pass" placeholder="password"/>
        <input type="hidden" name="_csrf" value={props.csrf}/>
        <input className="formSubmit" type="submit" value="Sign in" />
        </form>
    );
};

const SignupWindow = (props) => {

    $("#domoMessage").animate({width:'hide'}, 350);
    document.querySelector('#loginButton').classList.remove('active');
    document.querySelector('#signupButton').classList.add('active');

    return (
        <form id="signupForm"
            name="signupForm"
            onSubmit={handleSignup}
            action="/signup"
            method="POST"
            className="mainForm"
        >
            <label htmlFor="username">Username: </label>
            <input id="user" type="text" name="username" placeholder="username"/>
            <label htmlFor="email">Email: </label>
            <input id="email" type="text" name="email" placeholder="email"/>
            <label htmlFor="pass">Password: </label>
            <input id="pass" type="password" name="pass" placeholder="password"/>
            <label htmlFor="pass2">Password: </label>
            <input id="pass2" type="password" name="pass2" placeholder="retype password"/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="formSubmit" type="submit" value="Sign Up"/>
        </form>
    );
};

const createLoginWindow = (csrf) => {
    ReactDOM.render(
        <LoginWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

const createSignupWindow = (csrf) => {
    ReactDOM.render(
        <SignupWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

const setup = (csrf) => {
    const loginButton = document.querySelector("#loginButton");
    const signupButton = document.querySelector("#signupButton");

    signupButton.addEventListener("click", (e) => {
        e.preventDefault();
        createSignupWindow(csrf);
        return false;
    });

    loginButton.addEventListener("click", (e) => {
        e.preventDefault();
        createLoginWindow(csrf);
        return false;
    });

    createLoginWindow(csrf);//default view
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        console.log('test');
        setup(result.csrfToken);
    });
};

$(document).ready(function(){
    getToken();
});