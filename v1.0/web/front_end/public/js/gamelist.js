jQuery(document).ready(function ()
{

    var FB;
    var myFirebaseRef;
    var cursessionRef;
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
    function renderListGame(data) {
        var listGame = [];
        var i = 1;
        for (var key in data) {
            
            if (data.hasOwnProperty(key)) {
                
                listGame.push({
                    index: i,
                    bg_color : i % 3 === 0 ? "bg-color-green" : i % 3 === 1 ? "bg-color-orange" : "bg-color-red" , 
                    name: data[key].name,
                    image_url: data[key].image_url,
                    prize_number: data[key].prize_number,
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

    //fetch all games
    function getallGames() {
        var games = myFirebaseRef.child('game');
        // sync down from server
        var listGame = [];
        games.on('value', function (snap) {
            var data = snap.val();
            listGame = renderListGame(data)
            var data = {};
            data.listGame = listGame;
            var template = $('#listGameTpl').html();
            var html = Mustache.to_html(template, data);
            $('#listGame').html(html);
        });

//        list.splice(1, 1);
    }

//    $scope.openGame = function(game){
//        var mydiv = document.getElementById("gamecontent");
//        var source_url = game.source_url;
//        mydiv.innerHTML = "<iframe width='100%' height='100%' frameborder ='0' src =" + source_url +"></iframe>";
//    }

//    $scope.doLogin = function() {
//        myFirebaseRef.authWithOAuthPopup("facebook", function(error, authData) {
//            if (error) {
//                console.log("Login Failed!", error);
//            } else {
//                // the access token will allow us to make Open Graph API calls
//
//            }
//        }, {
//            remember: "sessionOnly",
//            scope: "public_profile" // the permissions requested
//        });
//    }
//
//    $scope.checkGame = function(game,i) {
//        if(game == null) {
//            var slickitem = document.getElementById(i);
//            slickitem.parentNode.removeChild(slickitem);
//            return false;
//        }
//        return false;
//    }
//
//    $scope.doLogout = function() {
//        myFirebaseRef.unauth();
//    }
    initDBconnection();
    getallGames();
});

