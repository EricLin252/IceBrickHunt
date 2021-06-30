var loginUser;
var doc;
var FF = window.location.href.split(/[/\\]/);
FF = FF[FF.length-1];
FF = FF.split("\.")[0];

firebase.auth().onAuthStateChanged((user) => {
    if(user) {
        loginUser = user;
        db.ref("/users/" + loginUser.uid + "/q2/ans").once('value')
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

function check_answer(){
    var str = document.getElementById("answer").value;
    var answer = str.toUpperCase();
    answer = answer.replace(/\s+/g,"");
    db.ref("/users/" + loginUser.uid + "/q2").set({
        ans: answer,
        ref: FF
    }).then(() => {
        doc = answer;
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
        "人生走的每一步，有笑、有淚、有孤獨、有辛勞，<br>\
        但，你知道嗎？<br>\
        你存在的每一天，都是「世界的一道光」，默默的照亮某個他或她，<br>\
        當你困頓無助時，<br>\
        覺得光芒閃爍不定時，<br>\
        記得還有諮商中心讓你停靠。";
    document.getElementById("answer").value = doc;
    document.getElementById("answer").disabled = true;
    document.getElementById("confirm").style.display = "none";
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
        document.getElementById("alert_text").innerHTML = "不只在外牆上、湖畔旁、北大門口、校內的松樹林內都有這句話喔！";
    }
    document.getElementById("alert_shadow").style.display = "block";
}

function turnoff_alert(){
    document.getElementById("alert_shadow").style.display = "none";
}