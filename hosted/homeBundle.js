"use strict";

var csrf = void 0;
var handleDomo = function handleDomo(e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    if ($("#domoName").val() == '' || $("#domoAge").val() == '') {
        handleError("RAWR! All fields are required");
        return false;
    }

    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function () {
        loadDomosFromServer();
    });
    return false;
};

var DomoForm = function DomoForm(props) {
    return React.createElement(
        "form",
        { id: "domoForm",
            onSubmit: handleDomo,
            name: "domoForm",
            action: "/maker",
            method: "POST",
            className: "domoForm"
        },
        React.createElement(
            "label",
            { htmlFor: "name" },
            "Name: "
        ),
        React.createElement("input", { id: "domoName", type: "text", name: "name", placeholder: "Domo Name" }),
        React.createElement(
            "label",
            { htmlFor: "age" },
            "Age: "
        ),
        React.createElement("input", { id: "domoAge", type: "text", name: "age", placeholder: "Domo Age" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "makeDomoSubmit", type: "submit", value: "Make Domo" })
    );
};

var handleEnterContest = function handleEnterContest(id) {
    sendAjax('GET', '/makeEntry', "id=" + id, function () {});
};

var ContestList = function ContestList(props) {

    if (props.contests.length === 0) {
        return React.createElement(
            "div",
            { className: "domoList" },
            React.createElement(
                "h3",
                { className: "emptyDomo" },
                "No Contests yet"
            )
        );
    }

    var contestNodes = props.contests.map(function (contest) {
        return React.createElement(
            "div",
            { id: contest._id, key: contest._id, className: "domo", onClick: function onClick(e) {
                    return handleEnterContest(contest._id);
                } },
            React.createElement("img", { src: "/assets/img/face2.png", alt: "cat", className: "domoFace" }),
            React.createElement(
                "h3",
                null,
                "Name: ",
                contest.name
            ),
            React.createElement(
                "h3",
                null,
                "Description: ",
                contest.description
            ),
            React.createElement(
                "h3",
                null,
                "Reward: $",
                contest.reward
            ),
            React.createElement(
                "h3",
                null,
                "Deadline: ",
                contest.deadline.substring(0, 10)
            )
        );
    });

    return React.createElement(
        "div",
        { className: "domoList" },
        contestNodes
    );
};

var handleUpgrade = function handleUpgrade(e) {
    e.preventDefault();

    sendAjax('POST', $("#upgradeForm").attr("action"), $("#upgradeForm").serialize(), function () {
        loadAccountFromServer();
    });
    return false;
};

var AccountInfo = function AccountInfo(props) {
    console.log(props);
    var accountInfo = props.account;
    var ad = void 0;
    if (accountInfo.type === "Basic") {
        ad = React.createElement(
            "div",
            null,
            React.createElement(
                "p",
                null,
                "You currently have a Basic account. Upgrade to a Premium account for $5 and be able to host your own competitions!"
            ),
            React.createElement(
                "form",
                { id: "upgradeForm",
                    onSubmit: handleUpgrade,
                    name: "upgradeForm",
                    action: "/upgrade",
                    method: "POST",
                    className: "domoForm"
                },
                React.createElement("input", { type: "hidden", name: "_csrf", value: csrf }),
                React.createElement("input", { className: "upgrade", type: "submit", value: "Upgrade Account" })
            )
        );
    }
    return React.createElement(
        "div",
        { className: "domoList" },
        React.createElement(
            "div",
            { className: "domo" },
            React.createElement(
                "h3",
                null,
                "Username: ",
                accountInfo.username
            ),
            React.createElement(
                "h3",
                null,
                "Email: ",
                accountInfo.email
            ),
            React.createElement(
                "h3",
                null,
                "Account Type: ",
                accountInfo.type
            )
        ),
        ad
    );
};

var loadCompetitionsFromServer = function loadCompetitionsFromServer() {
    sendAjax('GET', '/accountInfo', null, function (data) {
        var type = data.account.type;
        sendAjax('GET', '/getContests', null, function (data) {
            ReactDOM.render(React.createElement(ContestList, { contests: data.contests, type: type }), document.querySelector("#app"));
        });
    });
};

var loadAccountFromServer = function loadAccountFromServer() {
    sendAjax('GET', '/accountInfo', null, function (data) {
        ReactDOM.render(React.createElement(AccountInfo, { account: data.account }), document.querySelector("#app"));
    });
};

var setup = function setup(csrf) {
    console.log('maker');

    ReactDOM.render(React.createElement(ContestList, { contests: [] }), document.querySelector("#app"));

    var accountButton = document.querySelector("#accountButton");
    var homeButton = document.querySelector("#homeButton");

    accountButton.addEventListener("click", function (e) {
        e.preventDefault();
        loadAccountFromServer(csrf);
        return false;
    });

    homeButton.addEventListener("click", function (e) {
        e.preventDefault();
        loadCompetitionsFromServer(csrf);
        return false;
    });

    loadCompetitionsFromServer();
};

var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        csrf = result.csrfToken;
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});
"use strict";

var handleError = function handleError(message) {
    $("#errorMessage").text(message);
    $("#domoMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
    $("#domoMessage").animate({ width: 'hide' }, 350);
    window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success, dataType) {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: dataType ? dataType : "json",
        success: success,
        error: function error(xhr, status, _error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};