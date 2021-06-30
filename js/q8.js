var loginUser;
var doc;
var FF = window.location.href.split(/[/\\]/);
FF = FF[FF.length-1];
FF = FF.split("\.")[0];

firebase.auth().onAuthStateChanged((user) => {
    if(user) {
        loginUser = user;
        db.ref("/users/" + loginUser.uid + "/q8/ans").once('value')
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
    var answer = document.getElementById("answer").value;
    db.ref("/users/" + loginUser.uid + "/q8").set({
        ans: answer,
        ref: FF
    }).then(() => {
        turnon_alert("finish");
        true_ans();
    }).catch((err) => {
        turnon_alert("notFinish");
        document.getElementById("tips").style.display = "block";
    });
}

function true_ans(){
    document.getElementById("tips").style.display = "none";
    document.getElementById("question_text").innerHTML = 
        "走到戶外享受美景，和朋友們一起出遊談天，\
        短暫的遠離怎麼想也寫出不出來的論文、研究、報告.......\
        找到適合自己的舒壓方式，給自己一些放鬆的時光吧！";
    document.getElementById("answer").style.display = "none";
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
        document.getElementById("alert_text").innerHTML = "問問關主，將可知道如何闖關喔！";
    }
    document.getElementById("alert_shadow").style.display = "block";
}

function turnoff_alert(){
    document.getElementById("alert_shadow").style.display = "none";
}