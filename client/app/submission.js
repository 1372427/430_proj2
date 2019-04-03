const handleCompetition = (e) => {
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


const handleEntry = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'}, 350);

    if($("#user").val() === '' || $("#pass").val() === '' || $("#pass2").val() === ''){
        handleError("RAWR! All fields are required");
        return false;
    }

    if( $("#pass").val() !==  $("#pass2").val()){
        handleError("RAWR! Passwords do not match");
        return false;
    }
    
    sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

    return false;
};

const CompetitionWindow = (props) => {
    return (
        <form id="competitionForm" name="competitionForm"
            onSubmit={handleCompetition}
            action="/competition"
            method="POST"
            className="mainForm"
        >
        <label htmlFor="name">Contest Name: </label>
        <input id="name" type="text" name="name" placeholder="name"/>
        <label htmlFor="descrip">Description: </label>
        <input id="descrip" type="text" name="descrip" placeholder="description"/>
        <label htmlFor="reward">Reward: $</label>
        <input id="reward" type="text" name="reward" placeholder="0"/>
        <label htmlFor="deadline">Deadline: </label>
        <input id="deadline" type="text" name="deadline" placeholder={Date.now}/>
        <input type="hidden" name="_csrf" value={props.csrf}/>
        <input className="formSubmit" type="submit" value="Submit" />
        </form>
    );
};

const EntryWindow = (props) => {
    return (
        <form id="entryForm"
            name="entryForm"
            onSubmit={handleEntry}
            action="/entry"
            method="POST"
            className="mainForm"
        >
            <label htmlFor="content">Content: </label>
            <input id="content" type="text" name="content" placeholder="entry"/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input type="hidden" name="contest" value={props.contest}/>
            <input className="formSubmit" type="submit" value="Submit"/>
        </form>
    );
};

const createCompetitionWindow = (csrf) => {
    ReactDOM.render(
        <CompetitionWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

const createEntryWindow = (csrf, contest) => {
    ReactDOM.render(
        <EntryWindow csrf={csrf} contest={contest}/>,
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