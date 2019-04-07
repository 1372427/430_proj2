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