jQuery(document).ready(function ()
{
    console.log("aaaaa");
    var currentGame = new Object();
    var currentUser = new Object();
    function loadObjectGame(snapshot) {
        currentGame.name = snapshot.val().name;
        currentGame.prize_number = snapshot.val().prize_number;
        currentGame.prize_str = snapshot.val().prize_str;
        currentGame.source_url = snapshot.val().source_url;
        currentGame.top_score = snapshot.val().top_score;
        currentGame.top_score_id = snapshot.val().top_score_id;
        currentGame.top_score_time = snapshot.val().top_score_time;
    }
    function loadObjectUser(snapshot){
        currentUser.name = snapshot.val().name;
        currentUser.coin = snapshot.val().coin;
        currentUser.avatar_url = snapshot.val().avatar_url;
        currentUser.user_id = snapshot.val().user_id;
        currentUser.top_score = snapshot.val().top_score;
        currentUser.top_score_time = snapshot.val().top_score_time;
    }
    
    function toUSD(number) {
        var number = number.toString(), 
        dollars = number.split('.')[0], 
        cents = (number.split('.')[1] || '') +'00';
        dollars = dollars.split('').reverse().join('')
            .replace(/(\d{3}(?!$))/g, '$1.')
            .split('').reverse().join('');
        return dollars ;
    }
    function setCookieGame() {
        $.cookie("top_score", currentGame.top_score);
        $.cookie("top_score_id", currentGame.top_score_id);
        $.cookie("top_score_time", currentGame.top_score_time);
        var topPrice = parseFloat(currentGame.prize_number);
        $.cookie("prize_number", toUSD(topPrice));
        $.cookie("prize_str", currentGame.prize_str);
    }
    function setCookieUser() {
        $.cookie("Username", currentUser.name);
        $.cookie("coin", toUSD(parseFloat(currentUser.coin)));
        $.cookie("avatar_url", currentUser.avatar_url);
        $.cookie("user_id", currentUser.user_id);
        $.cookie("user_top_score", currentUser.top_score);
        $.cookie("user_top_score_time", currentUser.top_score_time);
    }
    function getLoginUser() {
        var ref = new Firebase("https://choicothuong.firebaseio.com/user");
        ref.orderByChild("user_id").equalTo("10200921212271543").on("child_added", function (snapshot) {
            console.log("avatar:" + snapshot.val().avatar_url);
            loadObjectUser(snapshot);
            setCookieUser();
        });
    }
    function getGameData() {
        var ref = new Firebase("https://choicothuong.firebaseio.com/game");
        ref.orderByChild("source_url").equalTo("/egg").on("child_added", function (snapshot) {
            loadObjectGame(snapshot);
            setCookieGame();
            
        });
    }
    getGameData();
    getLoginUser();
});
