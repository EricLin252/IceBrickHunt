var loginUser;
var doc;
var FF = window.location.href.split(/[/\\]/);
FF = FF[FF.length-1];
FF = FF.split("\.")[0];

firebase.auth().onAuthStateChanged((user) => {
    if(user) {
        loginUser = user;
        db.ref("/users/" + loginUser.uid + "/q5/ans").once('value')
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
    var answer = str.replace(/\r\n|\n/g, " ");
    answer = str.replace(/\s+/g, " ");
    db.ref("/users/" + loginUser.uid + "/q5").set({
        ans: answer,
        ref: FF
    }).then(() => {
        doc = answer;
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
        "幸福是一種能力，這種能力可以通過訓練獲得，\
        訓練方法就是，每天多多留意身邊的小確幸。<br>\
        即使它只是微不足道的小事，\
        如路邊綻放的小花、樹梢清唱的鳥兒，\
        一點一滴的累積，就能形成最踏實的幸福的感受!";
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
        document.getElementById("alert_text").innerHTML = "請在闖關頁面寫下讓你感覺到小確幸的任何人事物，不管多麼微小都沒關係喔！";
    }
    document.getElementById("alert_shadow").style.display = "block";
}

function turnoff_alert(){
    document.getElementById("alert_shadow").style.display = "none";
}