var loginUser;
var doc;
var FF = window.location.href.split(/[/\\]/);
FF = FF[FF.length-1];
FF = FF.split("\.")[0];

firebase.auth().onAuthStateChanged((user) => {
    if(user) {
        loginUser = user;
        db.ref("/users/" + loginUser.uid + "/q9/ans").once('value')
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
    db.ref("/users/" + loginUser.uid + "/q9").set({
        ans: number.toString(),
        ref: FF
    }).then(() => {
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
        "紓壓方式有幾百種，記得要找適合自己的舒壓方法喔～<br>\
        企鵝的紓壓懶人包：<a href='https://is.gd/NZGshq' target='new_window'>https://is.gd/NZGshq</a><br>\
        <br>\
        也可以適時尋求相關資源的幫助～<br>\
        諮商中心服務介紹：<a href='http://counsel.sa.nctu.edu.tw/?page_id=1257' target='new_window'>http://counsel.sa.nctu.edu.tw/?page_id=1257</a><br>\
        新竹市心理衛生資源網：<a href='http://map.mhc.org.tw/index.asp' target='new_window'>http://map.mhc.org.tw/index.asp</a>";
    selections = document.getElementsByClassName("content")[0].getElementsByClassName("selection");
    for(var i = 0; i < selections.length; i++){
        selections[i].style.display = "none";
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
        document.getElementById("alert_text").innerHTML = "問問關主，將可知道如何闖關喔！";
    }
    document.getElementById("alert_shadow").style.display = "block";
}

function turnoff_alert(){
    document.getElementById("alert_shadow").style.display = "none";
}