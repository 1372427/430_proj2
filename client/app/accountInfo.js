const handleAccountChange = (e, formId) => {
    e.preventDefault();
    if(formId==="emailForm"){
        
    const emailCheck1 = $("#email").val().split('@');

    if( emailCheck1.length !== 2 || emailCheck1[0].length<1 || emailCheck1[1].length<1){
        handleError("Invalid email");
        return false;
    }
    const emailCheck2 = emailCheck1[1].split('.');
    if(emailCheck2.length< 2 || emailCheck2[0].length<1 || emailCheck2[1].length<1 ){
        
        handleError("Invalid email");
        return false;
    }
    
    }
    else if(formId=="passForm" && $("#pass").val()==="")return handleError("Please put a new password!")
    sendAjax('POST', $(`#${formId}`).attr("action"), $(`#${formId}`).serialize(), function() {
        loadAccountFromServer();
    });
    return false;
}

const handleMakeMascotChange = (e) => {
    e.preventDefault();
    sendAjax('GET', '/mascots', null, (data) => {
        ReactDOM.render(
            <MascotList mascots={data.mascots} csrf={csrf}/>, document.querySelector("#app")
        );
    });

    return false;
}

const AccountInfo = function(props){
    
    $("#domoMessage").animate({width:'hide'}, 350);
    document.querySelector('#accountButton').classList.add('active');
    document.querySelector('#homeButton').classList.remove('active');
    document.querySelector('#contestButton').classList.remove('active');

    let accountInfo = props.account;
    let ad;
    if(accountInfo.type==="Basic"){
        ad = (<div id="upgrade">  
            <p>You currently have a Basic account. Upgrade to a Premium account for $5 and be able to host your own competitions!</p>
            
        <form id="upgradeForm"
            onSubmit = {(e) => handleAccountChange(e, 'upgradeForm')}
            name="upgradeForm"
            action="/upgrade"
            method="POST"
        >
        <input type="hidden" name="_csrf" value={csrf}/>
        <input className="upgradeSubmit" type="submit" value="Upgrade Account" />
        </form>
        </div>);
    }
    return (
        <div className="domoList">
            <div className="domo">
                <h3 >Username: {accountInfo.username}</h3>
                <h3 >Mascot: {accountInfo.mascot}
                <form id="mascotForm"
                    onSubmit = {(e) => handleMakeMascotChange(e)}
                    name="mascotForm"
                >
                <input type="hidden" name="_csrf" value={csrf}/>
                <input className="makeDomoSubmit" type="submit" value="Change Mascot" />
                </form>
                </h3>
                <h3 >Email: {accountInfo.email}</h3>
                <h3>Account Type: {accountInfo.type}</h3>
                <form id="passForm"
                    onSubmit = {(e) => handleAccountChange(e, 'passForm')}
                    name="passForm"
                    action="/pass"
                    method="POST"
                    className="domoForm"
                >
                <label htmlFor="pass">Password: </label>
                <input  className="formInput2" id="pass" type="password" name="pass" placeholder="new password"/>
                <input type="hidden" name="_csrf" value={csrf}/>
                <input className="makeDomoSubmit" type="submit" value="Change Password" />
                </form>
                <form id="emailForm"
                    onSubmit = {(e) => handleAccountChange(e, 'emailForm')}
                    name="emailForm"
                    action="/email"
                    method="POST"
                    className="domoForm"
                >
                <label htmlFor="email">Email: </label>
                <input  className="formInput2" id="email" type="text" name="email" placeholder="new email"/>
                <input type="hidden" name="_csrf" value={csrf}/>
                <input className="makeDomoSubmit" type="submit" value="Change Email" />
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