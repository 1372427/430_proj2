
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