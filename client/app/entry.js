
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
            action="/makeEntry"
            method="POST"
            className="mainForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="name" type="text" name="name" placeholder="name"/>
            <label htmlFor="content">Content: </label>
            <input id="content" type="text" name="content" placeholder="entry"/>
            <input type="hidden" name="_csrf" value={csrf}/>
            <input type="hidden" name="contest" value={contest}/>
            <input className="formSubmit" type="submit" value="Submit"/>
        </form>
    );
};

const EntryList = (props) => {
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
                <img src="/assets/img/face2.png" alt="cat" className="domoFace"/>
                <h3 >Name: {entry.name}</h3> 
                <h3 >Content: {entry.content}</h3>
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