
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
    
    $("#domoMessage").animate({width:'hide'}, 350);
    
    document.querySelector('#accountButton').classList.remove('active');
    document.querySelector('#homeButton').classList.add('active');
    document.querySelector('#contestButton').classList.remove('active');

    let csrf = props.csrf;
    let contest = props.contest;
    return (
        <form id="entryForm"
            name="entryForm"
            onSubmit={handleEntry}
            action="/makeEntry"
            method="POST"
            className="mainForm"
        >
            <label htmlFor="name">Name: </label>
            <input  className="formInput" id="name" type="text" name="name" placeholder="name"/>
            <label htmlFor="content">Content: </label>
            <input  className="formInput" id="content" type="text" name="content" placeholder="entry"/>
            <input type="hidden" name="_csrf" value={csrf}/>
            <input type="hidden" name="contest" value={contest}/>
            <input className="formSubmit" type="submit" value="Submit"/>
        </form>
    );
};

const EntryList = (props) => {
    
    $("#domoMessage").animate({width:'hide'}, 350);
    
    document.querySelector('#accountButton').classList.remove('active');
    document.querySelector('#homeButton').classList.add('active');
    document.querySelector('#contestButton').classList.remove('active');

console.log(props)
    if(props.entries.length === 0){
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Entries yet</h3>
            </div>
        );
    }
    
    let contestId = props.contest
    const contestNodes = props.entries.map(function(entry){
        return(
            <div id={entry._id} key={entry._id} className="domo" onClick={ (e) => handleWinnerClick(entry._id, contestId)}>
                <img src={`/assets/img/mascots/${entry.mascot}`} alt="cat" className="domoFace"/>
                <div className="domoContent">
                <h3 >Name: {entry.name}</h3> 
                <h3 >Content: {entry.content}</h3>
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

const createEntryWindow = (csrf, contest) => {
    ReactDOM.render(
        <EntryWindow csrf={csrf} contest={contest}/>,
        document.querySelector("#app")
    );
}; 