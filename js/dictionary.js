var loginUser;
var doc;

firebase.auth().onAuthStateChanged((user) => {
    if(user) {
        loginUser = user;
        db.ref("/users/" + loginUser.uid).once('value')
        .then((d) => {
            if(d.exists()){
                doc = d.val();
            }
            else{
                doc = {type: "", account: ""};
                db.ref("/users/" + loginUser.uid).set(doc);
            }

            if(doc["type"] == null){
                doc["type"] = "";
                db.ref("/users/" + loginUser.uid).update({type: doc["type"]});
            }

            if(doc["account"] == null){
                doc["account"] = "";
                db.ref("/users/" + loginUser.uid).update({account: doc["account"]});
            }

            console.log("data: ", doc);
            var blocks = document.getElementsByClassName("block");
            blocks[0].href="personal_imfor.html";
            blocks[0].getElementsByClassName("discription")[0].innerHTML = "第一顆冰磚";
            blocks[0].getElementsByClassName("brick")[0].style.backgroundImage = "url('img/brick1.png')";
            blocks[0].getElementsByClassName("brick")[0].innerHTML = "";
            var brick_amount = 0;
            for(var i = 2; i <= 9; i++){
                var key = "q" + i;
                if(doc[key]){
                    brick_amount ++;
                    blocks[i-1].href = doc[key]["ref"] + ".html";
                    blocks[i-1].getElementsByClassName("brick")[0].style.backgroundImage = "url('img/brick" + i + ".png')";
                    blocks[i-1].getElementsByClassName("brick")[0].innerHTML = "";
                    switch(i){
                        case 2:
                            blocks[i-1].getElementsByClassName("discription")[0].innerHTML = "啟程x到站";
                            break;
                        case 3:
                            blocks[i-1].getElementsByClassName("discription")[0].innerHTML = "潮汐之間";
                            break;
                        case 4:
                            blocks[i-1].getElementsByClassName("discription")[0].innerHTML = "解憂信箱";
                            break;
                        case 5:
                            blocks[i-1].getElementsByClassName("discription")[0].innerHTML = "小確幸の店";
                            break;
                        case 6:
                            blocks[i-1].getElementsByClassName("discription")[0].innerHTML = "心靈充電站";
                            break;
                        case 7:
                            blocks[i-1].getElementsByClassName("discription")[0].innerHTML = "拍拍好時光";
                            break;
                        case 8:
                            blocks[i-1].getElementsByClassName("discription")[0].innerHTML = "壓力給幾分";
                            break;
                        case 9:
                            blocks[i-1].getElementsByClassName("discription")[0].innerHTML = "雪球大作戰";
                            break;
                    }
                }
            }
            if(brick_amount >= 6){
                document.getElementById("question_sheet").style.display = "block";
            }
            document.getElementById("loading").style.display = "none";

            if(doc["type"] == "" || doc["account"] == ""){
                window.alert("您在創建帳號時資料可能有誤，請立即至" + ' "第一顆冰磚" ' + "補填個人資料，造成您的不便，敬請見諒><");
            }
        }).catch((err) => {
            window.alert("登入或是創建帳號時資料發生錯誤，請聯絡工作人員，或是使用" + ' "登入發生問題"');
            firebase.auth().signOut();
            console.log(err.code + ": " + err.message);
        });
    } else {
        window.location = "login_and_makeAccount.html?index";
    }
});

function move(dir = ""){
    document.getElementById("big_box").className = "box" + dir;
}
