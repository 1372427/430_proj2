const handleAccountChange = (e, formId) => {
    e.preventDefault();

    sendAjax('POST', $(`#${formId}`).attr("action"), $(`#${formId}`).serialize(), function() {
        loadAccountFromServer();
    });
    return false;
}

const AccountInfo = function(props){
    console.log(props)
    let accountInfo = props.account;
    let ad;
    if(accountInfo.type==="Basic"){
        ad = (<div>
            <p>You currently have a Basic account. Upgrade to a Premium account for $5 and be able to host your own competitions!</p>
            
        <form id="upgradeForm"
            onSubmit = {(e) => handleAccountChange(e, 'upgradeForm')}
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
                <form id="usernameForm"
                    onSubmit = {(e) => handleAccountChange(e, 'usernameForm')}
                    name="usernameForm"
                    action="/username"
                    method="POST"
                    className="domoForm"
                >
                <label htmlFor="username">Username: </label>
                <input id="username" type="text" name="username" placeholder="new username"/>
                <input type="hidden" name="_csrf" value={csrf}/>
                <input className="upgrade" type="submit" value="Change Username" />
                </form>
                <form id="emailForm"
                    onSubmit = {(e) => handleAccountChange(e, 'emailForm')}
                    name="emailForm"
                    action="/email"
                    method="POST"
                    className="domoForm"
                >
                <label htmlFor="email">Email: </label>
                <input id="email" type="text" name="email" placeholder="new email"/>
                <input type="hidden" name="_csrf" value={csrf}/>
                <input className="upgrade" type="submit" value="ChangeEmail" />
                </form>
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