let csrf;



const handleEnterContest = (id) => {
    console.log(id)
    createEntryWindow(csrf, id);
}

const ContestList = function(props){
    
    $("#domoMessage").animate({width:'hide'}, 350);

    
    document.querySelector('#accountButton').classList.remove('active');
    document.querySelector('#homeButton').classList.add('active');
    document.querySelector('#contestButton').classList.remove('active');
    
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
                <img src={`/assets/img/mascots/${contest.mascot}`} alt="cat" className="domoFace"/>
                
                <div className="domoContent">
                <h3 >Name: {contest.name}</h3>
                <h3 >Description: {contest.description}</h3>
                <h3 >Reward: ${contest.reward}</h3>
                <h3 >Deadline: {contest.deadline.substring(0,10)}</h3>
                </div>
            </div>
        );
    });

    return (
        <div className="domoList">
            {contestNodes}
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

const setup = function(csrf){
    console.log('maker')

    ReactDOM.render(
        <ContestList contests={[]} />, document.querySelector("#app")
    );
    
    const accountButton = document.querySelector("#accountButton");
    const homeButton = document.querySelector("#homeButton");
    const contestButton = document.querySelector("#contestButton");

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

    contestButton.addEventListener("click", (e) => {
        e.preventDefault();
        createCompetitionWindow(csrf);
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