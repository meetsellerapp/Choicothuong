jQuery(document).ready(function ()
{

    var FB;
    var myFirebaseRef;
    var cursessionRef;
    var currentUser = new Object();
    var DB_PATH = "https://choicothuong.firebaseio.com";
    function doLogin() {
        myFirebaseRef.authWithOAuthPopup("facebook", function (error, authData) {
            if (error) {
                console.log("Login Failed!", error);
            } else {
                // the access token will allow us to make Open Graph API calls

            }
        }, {
            remember: "sessionOnly",
            scope: "public_profile" // the permissions requested
        });
    }
    function removeAllCookies() {
        var cookies = document.cookie.split(";");
        var sessionid = $.cookie("sessionid");
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var eqPos = cookie.indexOf("=");
            var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
        $.cookie("sessionid", sessionid);
        $.cookie("loggedin", "1");
    }
    function doLogout() {
        myFirebaseRef.unauth();
    }
    $("#btnLogin").click(function () {
        doLogin();
    });
    $("#btnLogout").click(function () {
        doLogout();
    });
    function showLogout() {
        $("#btnLogin").hide();
        $("#btnLogout").show();
    }
    function showLogin() {
        $("#btnLogin").show();
        $("#btnLogout").hide();
    }
    function initDBconnection() {
        myFirebaseRef = new Firebase(DB_PATH);
        myFirebaseRef.onAuth(function (authData) {
            onAuthCallback(authData);
        });
        myFirebaseRef.offAuth(function (authData) {
            onAuthCallback(authData);
        });
        var authData = myFirebaseRef.getAuth();
    }

    var onAuthCallback = function (authData) {
        if (cursessionRef !== null)
            cursessionRef = {};
        if (authData) {
            console.log("Authenticated with uid:", authData.uid);
            showLogout();
            initUserSession(authData);
            addNewUser(authData);
            $.cookie("currentUserId", $.cookie("sessionid"));
            getCurrentUser();
        } else {
            console.log("Client unauthenticated.");
            showLogin();
            initAnonymousSession();
        }
    };

    function removeSession() {
        $.cookie("sessionid", "");
        $.cookie("loggedin", "");
    }

    function initAnonymousSession() {
        var sessionid = $.cookie("sessionid");
        var userId = '';
        if (sessionid === '') { //init a session
            var sessionRef = myFirebaseRef.child('/session/notloggedin');
            var new_session = sessionRef.push();
            new_session.update({startAt: Firebase.ServerValue.TIMESTAMP});
            userId = new_session.key();
        } else {
            userId = sessionid;
        }
        cursessionRef = myFirebaseRef.child('/session/notloggedin/' + userId);
        $.cookie("sessionid", userId);
        $.cookie("loggedin", "1");
        cursessionRef.on('child_removed', function (oldChildSnapshot) {
            removeSession();
        });
    }
    function loadObjectUser(snapshot) {
        currentUser.name = snapshot.val().name;
        currentUser.coin = snapshot.val().coin;
        currentUser.userAvatar = snapshot.val().avatar;
//        currentUser.top_score = snapshot.val().top_score;
//        currentUser.top_score_time = snapshot.val().top_score_time;
    }
    function setCookieUser() {
        $.cookie("user_name", currentUser.name);
        $.cookie("user_coin", toUSD(parseFloat(currentUser.coin)));
        $.cookie("user_avatar", currentUser.userAvatar);
//        $.cookie("user_top_score", currentUser.top_score);
//        $.cookie("user_top_score_time", currentUser.top_score_time);
    }
    function getCurrentUser() {
        var currentUserId = $.cookie("sessionid");
        var ref = new Firebase("https://choicothuong.firebaseio.com/user/" + currentUserId);
        ref.on('value', function (snapshot) {
            loadObjectUser(snapshot);
            setCookieUser();

        });
        var userGameref = new Firebase("https://choicothuong.firebaseio.com/usertopscore/" + currentUserId + "/eggnpot");
        userGameref.on('value', function (snap) {
            $.cookie("top_score", snap.val().score); //user top score
            $.cookie("top_score_time", snap.val().time); // //user top score time
        });
    }


    function initUserSession(authData) {
        var userid = authData.facebook.id;
        cursessionRef = myFirebaseRef.child('/session/loggedin/' + userid);
        var sessionid = $.cookie("sessionid");
        if ((sessionid === '') || (sessionid !== userid)) {
            cursessionRef.set({
                startAt: Firebase.ServerValue.TIMESTAMP
            });
            $.cookie("sessionid", userid);
            $.cookie("loggedin", "1");

        }
        cursessionRef.on('child_removed', function (oldChildSnapshot) {
            myFirebaseRef.unauth();
            removeSession();
        });
    }

    function addNewUser(authData) {
        var userRef = myFirebaseRef.child('/user/' + authData.facebook.id);
        var user = userRef.once('value', function (userSnapshot) {
            if (userSnapshot.val() === null) {
                //record not found, add new user
                user = userRef.set({
                    id: authData.facebook.id,
                    name: authData.facebook.displayName,
//                    email:authData.facebook.email,
                    avatar: authData.facebook.profileImageURL,
                    joinAt: Firebase.ServerValue.TIMESTAMP
                });
            }
        });
    }
    function toUSD(number) {
        var number = number.toString(),
                dollars = number.split('.')[0],
                cents = (number.split('.')[1] || '') + '00';
        dollars = dollars.split('').reverse().join('')
                .replace(/(\d{3}(?!$))/g, '$1.')
                .split('').reverse().join('');
        return dollars;
    }
    function setCookieGame(game) {
//        $.cookie("top_score", game.top_score);
        $.cookie("top_score_id", game.top_score_id);
//        $.cookie("top_score_time", game.top_score_time);
        var topPrice = parseFloat(game.prize_number);
        $.cookie("prize_number", toUSD(topPrice));
        $.cookie("prize_str", game.prize_str);
    }
    function renderListGame(data) {
        var listGame = [];
        var i = 1;
        for (var key in data) {

            if (data.hasOwnProperty(key)) {

                listGame.push({
                    index: i,
                    bg_color: i % 3 === 0 ? "bg-color-green" : i % 3 === 1 ? "bg-color-orange" : "bg-color-red",
                    name: data[key].name,
                    image_url: data[key].image_url,
                    prize_number: toUSD(data[key].prize_number),
                    prize_str: data[key].prize_str,
                    source_url: data[key].source_url,
                    top_score: data[key].top_score,
                    top_score_id: data[key].top_score_id,
                    top_score_time: data[key].top_score_time
                });

            }
            i++;
        }
        return listGame;
    }
    function updateUserCoin(newCoin) {
        var currentUserId = $.cookie("sessionid");
        var ref = new Firebase('https://choicothuong.firebaseio.com/user/' + currentUserId);
        ref.update({coin: newCoin});
    }
    function removeUserScoreCookie() {
        $.cookie("userScore", "");
        $.cookie("userTimer", "");
    }
    function openWinDialog() {
        WEPAPP.Modal.alertWithoutRender({
            obj: '#diaWinAlertModal',
            content: ""
        });
        removeUserScoreCookie();
    }
    function openLooseDialog() {
        WEPAPP.Modal.alertWithoutRender({
            obj: '#diaLooseAlertModal',
            content: ""
        });
        removeUserScoreCookie();
    }
    function openChoosePlayType() {
        WEPAPP.Modal.alertWithoutRender({
            obj: '#diaChoosePlayTypeModal',
            content: ""
        });
    }
    function openLeaderBoard() {
        
        WEPAPP.Modal.alertWithoutRender({
            obj: '#dialogLeaderBoardModal',
            content: ""
        });
        $.cookie("clickleader" , "");
        WEPAPP.Modal.closeDialog("#diaLogAlertModal");
    }
    function openGame(listGame) {
        $(".btn-playGame").click(function () {
            var idGame = $(this).data("id");
            if (idGame === 1) {
                openChoosePlayType();
//                openLeaderBoard();
            }
            $.each(listGame, function (key, value) {
                if (idGame === value.index) {
                    setCookieGame(value);
                }
            });
        });
        $("#btnPlayFree").click(function () {
            var currentUserId = $.cookie("sessionid");
            WEPAPP.Modal.closeDialog(this);
            if (typeof currentUserId === "undefined" || currentUserId === "") {
                alert("đăng nhập trước khi chơi");
            } else {
                $.cookie("playType", "free");
                var content = "<iframe width='100%' height='100%' frameborder ='0' src ='/EggnPot'></iframe>";
                WEPAPP.Modal.openGameFullSize({
                    obj: '#diaLogAlertModal',
                    content: content
                });
            }


        });
        $("#btnPlayCoin").click(function () {
            WEPAPP.Modal.closeDialog(this);
            var currentUserId = $.cookie("sessionid");
            if (typeof currentUserId === "undefined" || currentUserId === "") {
                alert("đăng nhập trước khi chơi");
            } else {
                var content = "<iframe width='100%' height='100%' frameborder ='0' src ='/EggnPot'></iframe>";
                WEPAPP.Modal.openGameFullSize({
                    obj: '#diaLogAlertModal',
                    content: content
                });
                $.cookie("playType", "coin");
                var newcoin = parseInt(currentUser.coin) - 100;
                updateUserCoin(newcoin.toString());
            }


        });
    }
    //fetch all games
    function getallGames() {
        var games = myFirebaseRef.child('game');
        // sync down from server
        var listGame = [];
        games.on('value', function (snap) {
            var data = snap.val();
            listGame = renderListGame(data);
            var data = {};
            data.listGame = listGame;
            var template = $('#listGameTpl').html();
            var html = Mustache.to_html(template, data);
            $('#listGame').html(html);
            openGame(listGame);
        });

    }
    function updatePlaysessionforPaid(score, time) {
        var currentUserId = $.cookie("sessionid");
        if (typeof currentUserId !== "undefined" && currentUserId !== "") {
            var rootRef = new Firebase(DB_PATH);
            var urlRef = rootRef.child("playsession/paid");
            var dataUser = {
                endAt: Firebase.ServerValue.TIMESTAMP,
                game: "eggnpot",
                score: score,
                status: "0",
                time: time,
                user_id: currentUserId,
                win_loose: "win"
            };
            var newURLRef = urlRef.push();
            newURLRef.set(dataUser);
        } else {
            return false;
        }
    }
    function updateUserGame() {
        var userScore = $.cookie("userScore");
        var userTimer = $.cookie("userTimer");
        var currentUserId = $.cookie("sessionid");
        if (typeof currentUserId !== "undefined" && currentUserId !== "") {
            if (typeof userScore !== "undefined" && userScore !== "" && typeof userTimer !== "undefined" && userTimer !== "") {
                updatePlaysessionforPaid(userScore, userTimer);
                openWinDialog();
            }
        }

    }
    initDBconnection();
    getallGames();
    setInterval(function () {
        updateUserGame();
        if (parseInt($.cookie("clickleader")) === 1) {
            openLeaderBoard();
        }
    }, 1000); // every 5 sec
    removeAllCookies();
});

