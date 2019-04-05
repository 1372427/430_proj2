const handleCompetition = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'}, 350);

    if($("#name").val() == '' || $("#descrip").val() == ''){
        handleError("Meow! Fill all fields please!");
        return false;
    }
    let deadline = $("#deadline").val();
    deadline = deadline.split('/');
    deadline = new Date(deadline[2], deadline[0], deadline[1]);
    //querySelector("#deadline").value =  deadline;
    sendAjax('POST', $("#competitionForm").attr("action"), $("#competitionForm").serialize(), redirect);

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
    if(props.type==="Basic"){
        return (
            <div>
                You currently have a Basic account. Please upgrade to Premium to create contests.
            </div>
        )
    }
    let dateObj = new Date(Date.now());
    let date = dateObj.getDate();
    let month = dateObj.getMonth();
    let year = dateObj.getFullYear();
    let csrf = props.csrf;
    return (
        <form id="competitionForm" name="competitionForm"
            onSubmit={handleCompetition}
            action="/makeContest"
            method="POST"
            className="mainForm"
        >
        <label htmlFor="name">Contest Name: </label>
        <input id="name" type="text" name="name" placeholder="name"/>
        <label htmlFor="descrip">Description: </label>
        <input id="descrip" type="text" name="descrip" placeholder="description"/>
        <label htmlFor="reward">Reward: $</label>
        <input id="reward" type="text" name="reward" placeholder="10.00"/>
        <label htmlFor="deadline">Deadline: </label>
        <input id="deadline" type="text" name="deadline" placeholder={`${year}/${month}/${date}`}/>
        <input type="hidden" name="_csrf" value={csrf}/>
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
    sendAjax('GET', '/accountInfo', null, (data) => {
        console.log(data)
        let type = data.account.type;
        ReactDOM.render(
            <CompetitionWindow csrf={csrf} type={type}/>,
            document.querySelector("#app")
        );
    });
};

const createEntryWindow = (csrf, contest) => {
    ReactDOM.render(
        <EntryWindow csrf={csrf} contest={contest}/>,
        document.querySelector("#app")
    );
};


const handleUpgrade = (e) => {
    e.preventDefault();

    sendAjax('POST', $("#upgradeForm").attr("action"), $("#upgradeForm").serialize(), function() {
        loadAccountFromServer();
    });
    return false;
};

const AccountInfo = function(props){
    console.log(props)
    let accountInfo = props.account;
    let csrf = props.csrf;
    let ad;
    if(accountInfo.type==="Basic"){
        ad = (<div>
            <p>You currently have a Basic account. Upgrade to a Premium account for $5 and be able to host your own competitions!</p>
            
        <form id="upgradeForm"
            onSubmit = {handleUpgrade}
            name="upgradeForm"
            action="/upgrade"
            method="POST"
            className="domoForm"
        >
        <input type="hidden" name="_csrf" value={csrf}/>
        <input className="upgrade" type="submit" value="Upgrade Account" />
        </form>
        </div>);
    }
    return (
        <div className="domoList">
            <div className="domo">
                <h3 >Username: {accountInfo.username}</h3>
                <h3 >Email: {accountInfo.email}</h3>
                <h3>Account Type: {accountInfo.type}</h3>
             </div>
             {ad}
        </div>
    );
};
const loadAccountFromServer = (csrf) => {
    sendAjax('GET', '/accountInfo', null, (data) => {
        ReactDOM.render(
            <AccountInfo account={data.account} csrf={csrf}/>, document.querySelector("#app")
        );
    });
};

const setup = (csrf) => {
    console.log('submission')
    const accountButton = document.querySelector("#accountButton");

    accountButton.addEventListener("click", (e) => {
        e.preventDefault();
        loadAccountFromServer(csrf);
        return false;
    });

    createCompetitionWindow(csrf);
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