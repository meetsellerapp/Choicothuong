function openDialog() {


    jQuery(document).ready(function () {
        console.log("open dialog");
        WEPAPP.Modal.fullViewDialog('#diaLogModal');
    });
}
function updateTimeScore(time , score) {
    console.log("updateTime:" + time);
    console.log("updateScore:" + score);
}
function updateFinalTimeScore(time , score) {
    console.log("updateFinalTime:" + time);
    console.log("updateFinalScore:" + score);
}
function startGame() {
    console.log("startGame:----------------------------");
}