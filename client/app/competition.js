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
    if(isNaN(deadline)){
        
        handleError("Use date format YYYY/MM/DD!");
        return false;
    }
    
    sendAjax('POST', $("#competitionForm").attr("action"), $("#competitionForm").serialize(), redirect);

    return false;
};

const handlePickWinner = (id) => {
    sendAjax('GET', `/entries?contest=${id}`, null, (data) => {
        ReactDOM.render(
            <EntryList entries={data.entries} contest={id}/>, document.querySelector("#app")
        );
    });
}

const handleWinnerClick = (entryId, contestId) => {
    sendAjax('POST', '/setWinner', `entry=${entryId}&contest=${contestId}&_csrf=${csrf}`, (data) => {
        ReactDOM.render(
            <div>Thank you for picking a winner. An email has been sent to your winner.</div>, document.querySelector("#app")
        );
    });
}

const CompetitionWindow = (props) => {
    
    $("#domoMessage").animate({width:'hide'}, 350);
    
    document.querySelector('#accountButton').classList.remove('active');
    document.querySelector('#homeButton').classList.remove('active');
    document.querySelector('#contestButton').classList.add('active');

    if(props.type==="Basic"){
        return (
            <div>
                You currently have a Basic account. Please upgrade to Premium to create contests.
            </div>
        )
    }

    const contestNodes = props.contests.map(function(contest){
        return(
            <div id={contest._id} key={contest._id} className="domo" onClick={(e) =>contest.winner?null:handlePickWinner(contest._id)}>
                <img src="/assets/img/face.png" alt="cat" className="domoFace"/>
                
                <div className="domoContent">
                <h3 >Name: {contest.name}</h3>
                <h3 >Description: {contest.description}</h3>
                <h3 >Reward: ${contest.reward}</h3>
                <h3 >Deadline: {contest.deadline.substring(0,10)}</h3>
                <h3 >Entries: {contest.entries}</h3>
                <h3>Winner: {contest.winner? "A Winner has already been selected!": "No Winner selected!"}</h3>
                </div>
            </div>
        );
    });

    return (
        <div className="domoList">
        
        <button className="formSubmit" onClick={() => ReactDOM.render(<MakeCompetitionWindow csrf={csrf}/>, document.querySelector('#app'))}>New Contest</button>
            {contestNodes}
        </div>
    );
};

const MakeCompetitionWindow = (props) => {
    
    $("#domoMessage").animate({width:'hide'}, 350);

    document.querySelector('#accountButton').classList.remove('active');
    document.querySelector('#homeButton').classList.remove('active');
    document.querySelector('#contestButton').classList.add('active');

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
}

const createCompetitionWindow = (csrf) => {
    sendAjax('GET', '/accountInfo', null, (data) => {
        console.log(data)
        let type = data.account.type;
        if(type==="Premium"){
            sendAjax('GET', `/getContests?owner=${data.account.id}`, null, (data) => {
                let contests = data.contests;
                ReactDOM.render(
                    <CompetitionWindow csrf={csrf} type={type} contests={contests}/>,
                    document.querySelector("#app")
                );})
        }
        ReactDOM.render(
            <CompetitionWindow csrf={csrf} type={type} contests={[]}/>,
            document.querySelector("#app")
        );
    });
};