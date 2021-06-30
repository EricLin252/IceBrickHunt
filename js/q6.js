var loginUser;
var doc;
var FF = window.location.href.split(/[/\\]/);
FF = FF[FF.length-1];
FF = FF.split("\.")[0];

firebase.auth().onAuthStateChanged((user) => {
    if(user) {
        loginUser = user;
        db.ref("/users/" + loginUser.uid + "/q6/ans").once('value')
        .then((d) => {
            if(doc = d.val()) true_ans();
            document.getElementById("loading").style.display = "none";
        }).catch((err) => {
            console.log(err.code + ": " + err.message);
        });
    } else {
        window.location = "login_and_makeAccount.html?" + FF;
    }
});

function select(number){
    db.ref("/users/" + loginUser.uid + "/q6").set({
        ans: number.toString(),
        ref: FF
    }).then(() => {
        doc = number.toString();
        turnon_alert("correct_ans");
        true_ans();
    }).catch((err) => {
        turnon_alert("wrong_ans");
        document.getElementById("tips").style.display = "block";
    });
}

function true_ans(){
    document.getElementById("tips").style.display = "none";
    document.getElementById("question_text").innerHTML = 
        "有的時候，我們的心跟煩愁賽跑，徹夜難眠。與其啃蝕問題，不如放了它。<br>\
        <br>\
        舒服的坐在椅子上，想像煩惱如球般上下竄動，\
        看著它們流動，並聚焦在呼吸上，\
        吸氣的時候「上升」、吐氣的時候「落下」，\
        覺察身體的任何不適，將它呼氣吐出。<br>\
        <br>\
        覺察自己坐在椅子上，你的背有所依靠，<br>\
        凡事都好，無論怎樣都好。<br>\
        <br>\
        --《認識不夠好的自己》正念練習";
    selections = document.getElementsByClassName("content")[0].getElementsByClassName("selection");
    for(var i = 0; i < selections.length; i++){
        if(i == parseInt(doc, 10) - 1){
            selections[i].style.pointerEvents = "none";
            selections[i].disabled = true;
        }
        else selections[i].style.display = "none";
    }
}

function turnon_alert(content){
    if(content == "wrong_ans"){
        document.getElementById("alert_text").innerHTML = "答錯囉~可以看看右上角的小提示喔！";
    }
    else if(content == "correct_ans"){
        document.getElementById("alert_bg").style.backgroundImage = "url(img/alert_correct.png)";
        document.getElementById("alert_text").innerHTML = "恭喜答對了~繼續收集其他冰磚吧！";
    }
    else if(content == "tips"){
        document.getElementById("alert_text").innerHTML = "聆聽線上音檔，跟著指導語完成正念呼吸練習，並留意最後一句話。";
    }
    document.getElementById("alert_shadow").style.display = "block";
}

function turnoff_alert(){
    document.getElementById("alert_shadow").style.display = "none";
}