let csrf;
const handleDomo = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width: 'hide'}, 350);

    if($("#domoName").val() == '' || $("#domoAge").val() == ''){
        handleError("RAWR! All fields are required");
        return false;
    }

    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function() {
        loadDomosFromServer();
    });
    return false;
};

const DomoForm = (props) => {
    return(
        <form id="domoForm"
            onSubmit = {handleDomo}
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="domoName" type="text" name="name" placeholder="Domo Name"/>
            
            <label htmlFor="age">Age: </label>
            <input id="domoAge" type="text" name="age" placeholder="Domo Age"/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="makeDomoSubmit" type="submit" value="Make Domo"/>
        </form>
    );
};



const handleEntry = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'}, 350);

    if($("#content").val() === '' ){
        handleError("RAWR! All fields are required");
        return false;
    }

    sendAjax('POST', $("#entryForm").attr("action"), $("#entryForm").serialize(), redirect);

    return false;
};
const EntryWindow = (props) => {
    let csrf = props.csrf;
    let contest = props.contest;
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
            <input type="hidden" name="_csrf" value={csrf}/>
            <input type="hidden" name="contest" value={contest}/>
            <input className="formSubmit" type="submit" value="Submit"/>
        </form>
    );
};
const createEntryWindow = (csrf, contest) => {
    ReactDOM.render(
        <EntryWindow csrf={csrf} contest={contest}/>,
        document.querySelector("#app")
    );
}; 
const handleEnterContest = (id) => {
    console.log(id)
    createEntryWindow(csrf, id);
}

const ContestList = function(props){
    
    if(props.contests.length === 0){
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Contests yet</h3>
            </div>
        );
    }
    
    const contestNodes = props.contests.map(function(contest){
        return(
            <div id={contest._id} key={contest._id} className="domo" onClick={(e) =>handleEnterContest(contest._id)}>
                <img src="/assets/img/face2.png" alt="cat" className="domoFace"/>
                <h3 >Name: {contest.name}</h3>
                <h3 >Description: {contest.description}</h3>
                <h3 >Reward: ${contest.reward}</h3>
                <h3 >Deadline: {contest.deadline.substring(0,10)}</h3>
            </div>
        );
    });

    return (
        <div className="domoList">
            {contestNodes}
        </div>
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

const loadCompetitionsFromServer = () => {
    sendAjax('GET', '/accountInfo', null, (data) => {
        let type = data.account.type;
        sendAjax('GET', '/getContests', null, (data) => {
            ReactDOM.render(
                <ContestList contests={data.contests} type={type}/>, document.querySelector("#app")
            );
        });
    });
};

const loadAccountFromServer = () => {
    sendAjax('GET', '/accountInfo', null, (data) => {
        ReactDOM.render(
            <AccountInfo account={data.account} />, document.querySelector("#app")
        );
    });
};

const setup = function(csrf){
    console.log('maker')

    ReactDOM.render(
        <ContestList contests={[]} />, document.querySelector("#app")
    );
    
    const accountButton = document.querySelector("#accountButton");
    const homeButton = document.querySelector("#homeButton");

    accountButton.addEventListener("click", (e) => {
        e.preventDefault();
        loadAccountFromServer(csrf);
        return false;
    });

    homeButton.addEventListener("click", (e) => {
        e.preventDefault();
        loadCompetitionsFromServer(csrf);
        return false;
    });

    loadCompetitionsFromServer();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        csrf = result.csrfToken;
        setup(result.csrfToken);
    });
};

$(document).ready(function(){
    getToken();
});