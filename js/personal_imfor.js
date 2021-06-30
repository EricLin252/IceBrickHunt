var loginUser;
var doc;

firebase.auth().onAuthStateChanged((user) => {
    if(user) {
        loginUser = user;
        db.ref("/users/" + loginUser.uid).once('value')
        .then((d) => {
            doc = d.val();
            if(doc["type"] == null) doc["type"] = "";
            if(doc["account"] == null) doc["account"] = "";
            console.log(doc);

            if(doc["type"] == ""){
                document.getElementById("type_text").style.display = "none";
                document.getElementById("identity").style.display = "block";
                document.getElementById("type").getElementsByClassName("text_content")[0].style.overflow = "visible";
                document.getElementById("account").getElementsByClassName("text_subject")[0].innerHTML = "學號:";
                document.getElementById("account_change").placeholder = "輸入學號";
            }
            else if(doc["type"] == "student"){
                document.getElementById("type_text").innerHTML = "交大學生";
                document.getElementById("account").getElementsByClassName("text_subject")[0].innerHTML = "學號:";
                document.getElementById("account_change").placeholder = "輸入學號";
            }
            else if(doc["type"] == "teacher"){
                document.getElementById("type_text").innerHTML = "交大教職員";
                document.getElementById("account").getElementsByClassName("text_subject")[0].innerHTML = "員工代碼:";
                document.getElementById("account_change").placeholder = "輸入員工代碼";
            }
            else if(doc["type"] == "others"){
                document.getElementById("type_text").innerHTML = "校外人士";
                document.getElementById("account").getElementsByClassName("text_subject")[0].innerHTML = "帳號:";
                document.getElementById("account_change").placeholder = "輸入帳號(英數字)";
            }
            if(doc["account"] == ""){
                document.getElementById("account_text").style.display = "none";
                document.getElementById("account_change").style.display = "block";
            }
            else{
                document.getElementById("account_text").innerHTML = doc["account"];
            }
            document.getElementById("email").getElementsByClassName("text_content")[0].innerHTML = loginUser.email;
            document.getElementById("change_email").value = "";
            document.getElementById("change_password").value = "";
            document.getElementById("loading").style.display = "none";
        }).catch((err) => {
            console.log(err.code + ": " + err.message);
        });
    } else {
        window.location = "login_and_makeAccount.html";
    }
});

function change_imformation(){
    var email = document.getElementById("change_email").value;
    var password = document.getElementById("change_password").value;

    if(!(email == "" && password == "")){
        if(email != ""){
            loginUser.updateEmail(email)
            .then(() => {
                document.getElementById("email").getElementsByClassName("text_content")[0].innerHTML = email;
            }).catch((err) => {
                if(err.code == "auth/email-already-in-use") window.alert("email已經被使用過了，請改用其他email");
                else if(err.code == "auth/invalid-email") window.alert("email格式錯誤");
                else window.alert("出現問題，請聯絡遊戲工作人員，或是使用" + ' "關於遊戲" ' + "頁面的" + ' "登入或創帳發生問題嗎？" ');
                console.log(err.code + ": " + err.message);
            });
            document.getElementById("change_email").value = "";
        }

        if(password != ""){
            loginUser.updatePassword(password)
            .then(() => {
                window.alert("密碼更改成功！");
            }).catch((err) => {
                if(err.code == "auth/weak-password") window.alert("密碼強度太弱了，建議換其他密碼喔！");
                else window.alert("出現問題，請聯絡遊戲工作人員，或是使用" + ' "關於遊戲" ' + "頁面的" + ' "登入或創帳發生問題嗎？" ');
                console.log(err.code + ": " + err.message);
            });
            document.getElementById("change_password").value = "";
        }
    }

    document.getElementById("change_password").type = "password";
    document.getElementsByClassName("eye")[0].style.backgroundImage = "url('img/hide.png')";
}

function logout(){
    if(window.confirm("確定要登出嗎？")){
        firebase.auth().signOut()
        .catch((err) => {
            window.alert("出現問題，請聯絡遊戲工作人員，或是使用" + ' "關於遊戲" ' + "頁面的" + ' "登入或創帳發生問題嗎？" ');
            console.log(err.code + ": " + err.message);
        });
    }
}

function ch_pwd_type(){
    var state = document.getElementById("change_password").type;
    if(state == "password"){
        document.getElementById("change_password").type = "text";
        document.getElementsByClassName("eye")[0].style.backgroundImage = "url('img/show.png')";
    }
    else if(state == "text"){
        document.getElementById("change_password").type = "password";
        document.getElementsByClassName("eye")[0].style.backgroundImage = "url('img/hide.png')";
    }
}

function changeType_student(){
    document.getElementById("type_change").textContent = "交大學生";
    document.getElementById("account").getElementsByClassName("text_subject")[0].textContent = "學號:";
    document.getElementById("account_change").placeholder = "輸入學號";
}

function changeType_teacher(){
    document.getElementById("type_change").textContent = "交大教職員";
    document.getElementById("account").getElementsByClassName("text_subject")[0].textContent = "員工代碼:";
    document.getElementById("account_change").placeholder = "輸入員工代碼";
}

function changeType_others(){
    document.getElementById("type_change").textContent = "校外人士";
    document.getElementById("account").getElementsByClassName("text_subject")[0].textContent = "帳號:";
    document.getElementById("account_change").placeholder = "輸入帳號(英數字)";
}

function add_imformation(){
    if(doc["type"] == "" || doc["account"] == ""){
        if(window.confirm("確定資料正確嗎，確定後即無法修改")){
            if(doc["type"] == ""){
                var identity = document.getElementById("type_change").textContent;
                if(identity == "交大學生"){
                    identity = "student";
                }
                else if(identity == "交大教職員"){
                    identity = "teacher";
                }
                else{
                    identity = "others";
                }
                doc["type"] = identity;
                db.ref("/users/" + loginUser.uid).update({type: doc["type"]});
            }

            if(doc["account"] == ""){
                doc["account"] = document.getElementById("account_change").value;
                db.ref("/users/" + loginUser.uid).update({account: doc["account"]});
            }
            window.location = "index.html";
        }
    }
    else{
        window.location = "index.html";
    }
}