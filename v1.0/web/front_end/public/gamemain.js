jQuery(document).ready(function ()
{
    console.log("aaaaa");
    var currentGame = new Object();
    function loadObjectGame(snapshot) {
        currentGame.name = snapshot.val().name;
        currentGame.prize_number = snapshot.val().prize_number;
        currentGame.prize_str = snapshot.val().prize_str;
        currentGame.source_url = snapshot.val().source_url;
        currentGame.top_score = snapshot.val().top_score;
        currentGame.top_score_id = snapshot.val().top_score_id;
        currentGame.top_score_time = snapshot.val().top_score_time;
    }
    function setCookieGame() {
        $.cookie("top_score", currentGame.top_score);
        $.cookie("top_score_id", currentGame.top_score_id);
        $.cookie("top_score_time", currentGame.top_score_time);
        $.cookie("prize_number", currentGame.prize_number);
        $.cookie("prize_str", currentGame.prize_str);
    }
    function getGameData() {
        var ref = new Firebase("https://choicothuong.firebaseio.com/game");
        ref.orderByChild("source_url").equalTo("/egg").on("child_added", function (snapshot) {
            loadObjectGame(snapshot);
            setCookieGame();
            console.log($.cookie("top_score"));
        });
    }
    getGameData();
});
