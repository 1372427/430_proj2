"use strict";

var handleAccountChange = function handleAccountChange(e, formId) {
    e.preventDefault();
    if (formId === "emailForm") {

        var emailCheck1 = $("#email").val().split('@');

        if (emailCheck1.length !== 2 || emailCheck1[0].length < 1 || emailCheck1[1].length < 1) {
            handleError("Invalid email");
            return false;
        }
        var emailCheck2 = emailCheck1[1].split('.');
        if (emailCheck2.length < 2 || emailCheck2[0].length < 1 || emailCheck2[1].length < 1) {

            handleError("Invalid email");
            return false;
        }
    } else if (formId == "passForm" && $("#pass").val() === "") return handleError("Please put a new password!");
    sendAjax('POST', $("#" + formId).attr("action"), $("#" + formId).serialize(), function () {
        loadAccountFromServer();
    });
    return false;
};

var handleMakeMascotChange = function handleMakeMascotChange(e) {
    e.preventDefault();
    sendAjax('GET', '/mascots', null, function (data) {
        ReactDOM.render(React.createElement(MascotList, { mascots: data.mascots, csrf: csrf }), document.querySelector("#app"));
    });

    return false;
};

var AccountInfo = function AccountInfo(props) {

    $("#domoMessage").animate({ width: 'hide' }, 350);
    document.querySelector('#accountButton').classList.add('active');
    document.querySelector('#homeButton').classList.remove('active');
    document.querySelector('#contestButton').classList.remove('active');

    var accountInfo = props.account;
    var ad = void 0;
    if (accountInfo.type === "Basic") {
        ad = React.createElement(
            "div",
            { id: "upgrade" },
            React.createElement(
                "p",
                null,
                "You currently have a Basic account. Upgrade to a Premium account for $5 and be able to host your own competitions!"
            ),
            React.createElement(
                "form",
                { id: "upgradeForm",
                    onSubmit: function onSubmit(e) {
                        return handleAccountChange(e, 'upgradeForm');
                    },
                    name: "upgradeForm",
                    action: "/upgrade",
                    method: "POST"
                },
                React.createElement("input", { type: "hidden", name: "_csrf", value: csrf }),
                React.createElement("input", { className: "upgradeSubmit", type: "submit", value: "Upgrade Account" })
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
                "Mascot: ",
                accountInfo.mascot,
                React.createElement(
                    "form",
                    { id: "mascotForm",
                        onSubmit: function onSubmit(e) {
                            return handleMakeMascotChange(e);
                        },
                        name: "mascotForm"
                    },
                    React.createElement("input", { type: "hidden", name: "_csrf", value: csrf }),
                    React.createElement("input", { className: "makeDomoSubmit", type: "submit", value: "Change Mascot" })
                )
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
            ),
            React.createElement(
                "form",
                { id: "passForm",
                    onSubmit: function onSubmit(e) {
                        return handleAccountChange(e, 'passForm');
                    },
                    name: "passForm",
                    action: "/pass",
                    method: "POST",
                    className: "domoForm"
                },
                React.createElement(
                    "label",
                    { htmlFor: "pass" },
                    "Password: "
                ),
                React.createElement("input", { className: "formInput2", id: "pass", type: "password", name: "pass", placeholder: "new password" }),
                React.createElement("input", { type: "hidden", name: "_csrf", value: csrf }),
                React.createElement("input", { className: "makeDomoSubmit", type: "submit", value: "Change Password" })
            ),
            React.createElement(
                "form",
                { id: "emailForm",
                    onSubmit: function onSubmit(e) {
                        return handleAccountChange(e, 'emailForm');
                    },
                    name: "emailForm",
                    action: "/email",
                    method: "POST",
                    className: "domoForm"
                },
                React.createElement(
                    "label",
                    { htmlFor: "email" },
                    "Email: "
                ),
                React.createElement("input", { className: "formInput2", id: "email", type: "text", name: "email", placeholder: "new email" }),
                React.createElement("input", { type: "hidden", name: "_csrf", value: csrf }),
                React.createElement("input", { className: "makeDomoSubmit", type: "submit", value: "Change Email" })
            )
        ),
        ad
    );
};
var loadAccountFromServer = function loadAccountFromServer(csrf) {
    sendAjax('GET', '/accountInfo', null, function (data) {
        ReactDOM.render(React.createElement(AccountInfo, { account: data.account, csrf: csrf }), document.querySelector("#app"));
    });
};
"use strict";

var handleCompetition = function handleCompetition(e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    if ($("#name").val() == '' || $("#descrip").val() == '') {
        handleError("Meow! Fill all fields please!");
        return false;
    }
    var deadline = $("#deadline").val();
    deadline = deadline.split('/');
    deadline = new Date(deadline[2], deadline[0], deadline[1]);
    if (isNaN(deadline)) {

        handleError("Use date format YYYY/MM/DD!");
        return false;
    }

    sendAjax('POST', $("#competitionForm").attr("action"), $("#competitionForm").serialize(), redirect);

    return false;
};

var handlePickWinner = function handlePickWinner(id) {
    sendAjax('GET', "/entries?contest=" + id, null, function (data) {
        ReactDOM.render(React.createElement(EntryList, { entries: data.entries, contest: id }), document.querySelector("#app"));
    });
};

var handleWinnerClick = function handleWinnerClick(entryId, contestId) {
    sendAjax('POST', '/setWinner', "entry=" + entryId + "&contest=" + contestId + "&_csrf=" + csrf, function (data) {
        var username = data.winner.username;
        var email = data.winner.email;
        ReactDOM.render(React.createElement(
            "div",
            { className: "domoList" },
            React.createElement(
                "h3",
                { className: "emptyDomo" },
                "Thank you for picking a winner."
            ),
            React.createElement(
                "h3",
                { className: "emptyDomo" },
                "You selected ",
                username,
                " as your winner."
            ),
            React.createElement(
                "h3",
                { className: "emptyDomo" },
                "An email has been sent to ",
                username,
                "."
            ),
            React.createElement(
                "h3",
                { className: "emptyDomo" },
                "Contact them further at ",
                email
            )
        ), document.querySelector("#app"));
    });
};

var CompetitionWindow = function CompetitionWindow(props) {

    $("#domoMessage").animate({ width: 'hide' }, 350);

    document.querySelector('#accountButton').classList.remove('active');
    document.querySelector('#homeButton').classList.remove('active');
    document.querySelector('#contestButton').classList.add('active');

    if (props.type === "Basic") {
        return React.createElement(
            "div",
            { className: "domoList" },
            React.createElement(
                "h3",
                { className: "emptyDomo" },
                "You currently have a Basic account."
            ),
            React.createElement(
                "h3",
                { className: "emptyDomo" },
                " Please upgrade to Premium to create contests."
            )
        );
    }

    var contestNodes = props.contests.map(function (contest) {
        return React.createElement(
            "div",
            { id: contest._id, key: contest._id, className: "domo", onClick: function onClick(e) {
                    return contest.winner ? handleError("Already Won!") : handlePickWinner(contest._id);
                } },
            React.createElement("img", { src: "/assets/img/mascots/" + contest.mascot, alt: "cat", className: "domoFace" }),
            React.createElement(
                "div",
                { className: "domoContent" },
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
                ),
                React.createElement(
                    "h3",
                    null,
                    "Entries: ",
                    contest.entries
                ),
                React.createElement(
                    "h3",
                    null,
                    "Winner: ",
                    contest.winner ? "A Winner has already been selected!" : "No Winner selected!"
                )
            )
        );
    });

    return React.createElement(
        "div",
        { className: "domoList" },
        contestNodes,
        React.createElement(
            "button",
            { className: "formSubmit", onClick: function onClick() {
                    return ReactDOM.render(React.createElement(MakeCompetitionWindow, { csrf: csrf }), document.querySelector('#app'));
                } },
            "New Contest"
        )
    );
};

var MakeCompetitionWindow = function MakeCompetitionWindow(props) {

    $("#domoMessage").animate({ width: 'hide' }, 350);

    document.querySelector('#accountButton').classList.remove('active');
    document.querySelector('#homeButton').classList.remove('active');
    document.querySelector('#contestButton').classList.add('active');

    var dateObj = new Date(Date.now());
    var date = dateObj.getDate();
    var month = dateObj.getMonth();
    var year = dateObj.getFullYear();
    var csrf = props.csrf;

    return React.createElement(
        "form",
        { id: "competitionForm", name: "competitionForm",
            onSubmit: handleCompetition,
            action: "/makeContest",
            method: "POST",
            className: "mainForm"
        },
        React.createElement(
            "label",
            { htmlFor: "name" },
            "Contest Name: "
        ),
        React.createElement("input", { className: "formInput", id: "name", type: "text", name: "name", placeholder: "name" }),
        React.createElement(
            "label",
            { htmlFor: "descrip" },
            "Description: "
        ),
        React.createElement("input", { className: "formInput", id: "descrip", type: "text", name: "descrip", placeholder: "description" }),
        React.createElement(
            "label",
            { htmlFor: "reward" },
            "Reward: $"
        ),
        React.createElement("input", { className: "formInput", id: "reward", type: "text", name: "reward", placeholder: "10.00" }),
        React.createElement(
            "label",
            { htmlFor: "deadline" },
            "Deadline: "
        ),
        React.createElement("input", { className: "formInput", id: "deadline", type: "text", name: "deadline", placeholder: year + "/" + month + "/" + date }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: csrf }),
        React.createElement("input", { className: "formSubmit", type: "submit", value: "Submit" })
    );
};

var createCompetitionWindow = function createCompetitionWindow(csrf) {
    sendAjax('GET', '/accountInfo', null, function (data) {
        console.log(data);
        var type = data.account.type;
        if (type === "Premium") {
            sendAjax('GET', "/getContests?owner=" + data.account.id, null, function (data) {
                var contests = data.contests;
                ReactDOM.render(React.createElement(CompetitionWindow, { csrf: csrf, type: type, contests: contests }), document.querySelector("#app"));
            });
        }
        ReactDOM.render(React.createElement(CompetitionWindow, { csrf: csrf, type: type, contests: [] }), document.querySelector("#app"));
    });
};
"use strict";

var handleEntry = function handleEntry(e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    if ($("#content").val() === '') {
        handleError("RAWR! All fields are required");
        return false;
    }

    sendAjax('POST', $("#entryForm").attr("action"), $("#entryForm").serialize(), redirect);

    return false;
};
var EntryWindow = function EntryWindow(props) {

    $("#domoMessage").animate({ width: 'hide' }, 350);

    document.querySelector('#accountButton').classList.remove('active');
    document.querySelector('#homeButton').classList.add('active');
    document.querySelector('#contestButton').classList.remove('active');

    var csrf = props.csrf;
    var contest = props.contest;
    return React.createElement(
        "form",
        { id: "entryForm",
            name: "entryForm",
            onSubmit: handleEntry,
            action: "/makeEntry",
            method: "POST",
            className: "mainForm"
        },
        React.createElement(
            "label",
            { htmlFor: "name" },
            "Name: "
        ),
        React.createElement("input", { className: "formInput", id: "name", type: "text", name: "name", placeholder: "name" }),
        React.createElement(
            "label",
            { htmlFor: "content" },
            "Content: "
        ),
        React.createElement("input", { className: "formInput", id: "content", type: "text", name: "content", placeholder: "entry" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: csrf }),
        React.createElement("input", { type: "hidden", name: "contest", value: contest }),
        React.createElement("input", { className: "formSubmit", type: "submit", value: "Submit" })
    );
};

var EntryList = function EntryList(props) {

    $("#domoMessage").animate({ width: 'hide' }, 350);

    document.querySelector('#accountButton').classList.remove('active');
    document.querySelector('#homeButton').classList.add('active');
    document.querySelector('#contestButton').classList.remove('active');

    console.log(props);
    if (props.entries.length === 0) {
        return React.createElement(
            "div",
            { className: "domoList" },
            React.createElement(
                "h3",
                { className: "emptyDomo" },
                "No Entries yet"
            )
        );
    }

    var contestId = props.contest;
    var contestNodes = props.entries.map(function (entry) {
        return React.createElement(
            "div",
            { id: entry._id, key: entry._id, className: "domo", onClick: function onClick(e) {
                    return handleWinnerClick(entry._id, contestId);
                } },
            React.createElement("img", { src: "/assets/img/mascots/" + entry.mascot, alt: "cat", className: "domoFace" }),
            React.createElement(
                "div",
                { className: "domoContent" },
                React.createElement(
                    "h3",
                    null,
                    "Name: ",
                    entry.name
                ),
                React.createElement(
                    "h3",
                    null,
                    "Content: ",
                    entry.content
                )
            )
        );
    });

    return React.createElement(
        "div",
        { className: "domoList" },
        contestNodes
    );
};

var createEntryWindow = function createEntryWindow(csrf, contest) {
    ReactDOM.render(React.createElement(EntryWindow, { csrf: csrf, contest: contest }), document.querySelector("#app"));
};
'use strict';

var csrf = void 0;

var handleEnterContest = function handleEnterContest(id) {
    console.log(id);
    createEntryWindow(csrf, id);
};

var ContestList = function ContestList(props) {

    $("#domoMessage").animate({ width: 'hide' }, 350);

    document.querySelector('#accountButton').classList.remove('active');
    document.querySelector('#homeButton').classList.add('active');
    document.querySelector('#contestButton').classList.remove('active');

    if (props.contests.length === 0) {
        return React.createElement(
            'div',
            { className: 'domoList' },
            React.createElement(
                'h3',
                { className: 'emptyDomo' },
                'No Contests yet'
            )
        );
    }

    var contestNodes = props.contests.map(function (contest) {
        return React.createElement(
            'div',
            { id: contest._id, key: contest._id, className: 'domo', onClick: function onClick(e) {
                    return handleEnterContest(contest._id);
                } },
            React.createElement('img', { src: '/assets/img/mascots/' + contest.mascot, alt: 'cat', className: 'domoFace' }),
            React.createElement(
                'div',
                { className: 'domoContent' },
                React.createElement(
                    'h3',
                    null,
                    'Name: ',
                    contest.name
                ),
                React.createElement(
                    'h3',
                    null,
                    'Description: ',
                    contest.description
                ),
                React.createElement(
                    'h3',
                    null,
                    'Reward: $',
                    contest.reward
                ),
                React.createElement(
                    'h3',
                    null,
                    'Deadline: ',
                    contest.deadline.substring(0, 10)
                )
            )
        );
    });

    return React.createElement(
        'div',
        { className: 'domoList' },
        contestNodes
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

var setup = function setup(csrf) {
    console.log('maker');

    ReactDOM.render(React.createElement(ContestList, { contests: [] }), document.querySelector("#app"));

    var accountButton = document.querySelector("#accountButton");
    var homeButton = document.querySelector("#homeButton");
    var contestButton = document.querySelector("#contestButton");

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

    contestButton.addEventListener("click", function (e) {
        e.preventDefault();
        createCompetitionWindow(csrf);
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

var MascotList = function MascotList(props) {
    $("#domoMessage").animate({ width: 'hide' }, 350);

    var mascotNodes = Object.keys(props.mascots).map(function (mascot) {
        console.log(mascot);
        return React.createElement(
            "div",
            { id: mascot, className: "domo", onClick: function onClick(e) {
                    return handleMascotClick(e, mascot);
                } },
            React.createElement("img", { src: "/assets/img/mascots/" + props.mascots[mascot], alt: "mascot", className: "domoFace" }),
            React.createElement(
                "div",
                { className: "domoContent" },
                React.createElement(
                    "h3",
                    null,
                    "Name: ",
                    mascot
                )
            )
        );
    });

    return React.createElement(
        "div",
        { className: "domoList" },
        mascotNodes
    );
};

var handleMascotClick = function handleMascotClick(e, mascot) {
    sendAjax('POST', '/mascots', "mascot=" + mascot + "&_csrf=" + csrf, function () {
        location.reload();
    });
};
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