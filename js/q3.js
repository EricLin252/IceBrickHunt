var loginUser;
var doc;
var FF = window.location.href.split(/[/\\]/);
FF = FF[FF.length-1];
FF = FF.split("\.")[0];

firebase.auth().onAuthStateChanged((user) => {
    if(user) {
        loginUser = user;
        db.ref("/users/" + loginUser.uid + "/q3/ans").once('value')
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
    var str = document.getElementById("answer").value;
    var answer = str.replace(/\s+/g,"");
    db.ref("/users/" + loginUser.uid + "/q3").set({
        ans: answer,
        ref: FF
    }).then(() => {
        doc = answer;
        turnon_alert("finish");
        true_ans();
    }).catch((err) => {
        console.log(err.code + ": " + err.message);
        turnon_alert("notFinish");
        document.getElementById("tips").style.display = "block";
    });
}

function true_ans(){
    document.getElementById("tips").style.display = "none";
    document.getElementById("question_text").innerHTML = 
        "情緒與壓力如同潮汐般來來去去。<br>\
        如果停留在原地太久，<br>\
        很容易就會讓自己的心無所適從。<br>\
        偶爾抬起頭，動一動，<br>\
        洗刷身上的浮沙，卸下硬殼。<br>\
        找回生命的自在與主動。";
    document.getElementById("answer").disabled = true;
    document.getElementById("answer").value = doc;
    document.getElementById("confirm").style.display = "none";
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
        document.getElementById("alert_text").innerHTML = "請思考一下，然後寫下你最常做的運動（或是你願意做的運動），以及你如何能維持它！";
    }
    document.getElementById("alert_shadow").style.display = "block";
}

function turnoff_alert(){
    document.getElementById("alert_shadow").style.display = "none";
}