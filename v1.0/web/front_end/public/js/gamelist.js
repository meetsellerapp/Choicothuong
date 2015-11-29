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

    //fetch all games
    function getallGames() {
        var games = $firebaseArray(myFirebaseRef.child('game'));
        games.$loaded().then(function(data) {
            
            var slickdiv = document.getElementById("gameslick");
            slickdiv.style.display="";
            WEPAPP.Slider.slick('.game-slick-slide .slick-slide-wrapper');
        });
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

