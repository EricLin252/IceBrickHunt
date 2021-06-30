var loginUser;
var doc;
var FF = window.location.href.split(/[/\\]/);
FF = FF[FF.length-1];
FF = FF.split("\.")[0];

firebase.auth().onAuthStateChanged((user) => {
    if(user) {
        loginUser = user;
        db.ref("/users/" + loginUser.uid + "/q4/ans").once('value')
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
    db.ref("/users/" + loginUser.uid + "/q4").set({
        ans: 'v',
        ref: FF
    }).then(() => {
        turnon_alert("finish");
        true_ans();
    }).catch((err) => {
        console.log(err.code + ": " + err.message);
    });
}

function true_ans(){
    document.getElementById("tips").style.display = "none";
    document.getElementById("question_text").innerHTML = 
        "把事放在心上是很沉重而辛苦的，\
        適時找人傾訴是很重要的紓壓技巧喔！\
        當身邊找不到適合的傾訴對象時，\
        也可藉由書寫，達到宣洩效果。";
    document.getElementById("confirm").style.display = "none";
}

function turnon_alert(content){
    if(content == "finish"){
        document.getElementById("alert_bg").style.backgroundImage = "url(img/alert_correct.png)";
        document.getElementById("alert_text").innerHTML = "完成回答了~繼續收集其他冰磚吧！";
    }
    else if(content == "tips"){
        document.getElementById("alert_text").innerHTML = 
            "現在就拿起紙筆，將所有掛心的事都寫下，投入信箱吧！\
            完成後請點選闖關頁面的「完成」選項。";
    }
    document.getElementById("alert_shadow").style.display = "block";
}

function turnoff_alert(){
    document.getElementById("alert_shadow").style.display = "none";
}