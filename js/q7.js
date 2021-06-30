var loginUser;
var doc;
var FF = window.location.href.split(/[/\\]/);
FF = FF[FF.length-1];
FF = FF.split("\.")[0];

firebase.auth().onAuthStateChanged((user) => {
    if(user) {
        loginUser = user;
        db.ref("/users/" + loginUser.uid + "/q7/ans").once('value')
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

function finish(){
    if(document.getElementById("answer").value != ""){
        db.ref("/users/" + loginUser.uid + "/q7").set({
            ans: 'v',
            ref: FF
        }).then(() => {
            turnon_alert("finish");
            true_ans();
        }).catch((err) => {
            console.log(err.code + ": " + err.message);
        });
    }
    else{
        turnon_alert("notFinish");
        document.getElementById("tips").style.display = "block";
    }
}

function true_ans(){
    document.getElementById("answer").style.display = "none";
    document.getElementById("confirm").style.display = "none";
    document.getElementById("tips").style.display = "none";
    document.getElementById("question_text").innerHTML = 
        "當拍照不是為了在網路上獲得大量關注與讚數，\
        而是暫時停下繁忙的生活步調，\
        試著觀察周遭或大或小的美好事物，\
        讓你的感官及頭腦都聚集在相機的對焦畫面上，\
        就能在一次次的快門中感受內心平靜與生活喜悅。";
}

function turnon_alert(content){
    if(content == "finish"){
        document.getElementById("alert_bg").style.backgroundImage = "url(img/alert_correct.png)";
        document.getElementById("alert_text").innerHTML = "完成回答了~繼續收集其他冰磚吧！";
    }
    else if(content == "notFinish"){
        document.getElementById("alert_text").innerHTML = "你尚未完成回答喔！";
    }
    else if(content == "tips"){
        document.getElementById("alert_text").innerHTML = "上傳一張你拍的美好時刻，即可完成闖關喔！";
    }
    document.getElementById("alert_shadow").style.display = "block";
}

function turnoff_alert(){
    document.getElementById("alert_shadow").style.display = "none";
}