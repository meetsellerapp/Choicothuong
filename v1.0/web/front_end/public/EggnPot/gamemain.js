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
    function getGameData() {
        var ref = new Firebase("https://choicothuong.firebaseio.com/game");
        ref.orderByChild("source_url").equalTo("/egg").on("child_added", function (snapshot) {
            loadObjectGame(snapshot);
            $.cookie("top_score", currentGame.top_score);
            console.log($.cookie("top_score"));
        });
    }
    getGameData();
});
