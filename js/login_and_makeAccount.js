var state = "none";
var dst = window.location.href.split("?");
if(dst.length == 1) dst = "index";
else dst = dst[1];

firebase.auth().onAuthStateChanged((user) => {
    if(user){
        if(state == "makeAccount"){
            window.alert("恭喜你完成帳號創建，獲得第一顆冰磚~\n所有個人資訊、登出、或是更改帳密，都可以在第一顆冰磚找到喔！");
        }
        window.location = dst + ".html";
    }
    else{
        if(state == "none") state = "login";
        document.getElementById("loading").style.display = "none";
    }
});

function changeType_student(){
    document.getElementById("type").textContent = "交大學生";
    document.getElementById("account").placeholder = "學號";
}

function changeType_teacher(){
    document.getElementById("type").textContent = "交大教職員";
    document.getElementById("account").placeholder = "員工代碼";
}

function changeType_others(){
    document.getElementById("type").textContent = "校外人士";
    document.getElementById("account").placeholder = "帳號(英數字)";
}

function change_state(){
    if(state == "login"){
        state = "makeAccount";
        document.title = "創建帳號";
        document.getElementById("title").textContent = "創建帳號";
        document.getElementById("logo").style.display = "none";
        document.getElementById("discription").style.display = "block";
        document.getElementById("identity").style.display = "block";
        document.getElementById("account").style.display = "block";
        document.getElementById("change_state").textContent = "已經創建過帳號了";
        document.getElementsByClassName("head")[0].style.height = "0%";
        document.getElementById("error_report").innerHTML = "創帳發生問題";
    }
    else if(state == "makeAccount"){
        state = "login";
        document.title = "登入";
        document.getElementById("title").textContent = "登入"
        document.getElementById("logo").style.display = "block";
        document.getElementById("discription").style.display = "none";
        document.getElementById("identity").style.display = "none";
        document.getElementById("account").style.display = "none";
        document.getElementById("change_state").textContent = "第一次玩請點這邊";
        document.getElementsByClassName("head")[0].style.height = "15%";
        document.getElementById("error_report").innerHTML = "登入發生問題";
    }
    document.getElementById("type").textContent = "交大學生";
    document.getElementById("account").placeholder = "學號";
    document.getElementById("password").type = "password";
    document.getElementById("account").value = "";
    document.getElementById("password").value = "";
    document.getElementById("email").value = "";
    document.getElementsByClassName("eye")[0].style.backgroundImage = "url('img/hide.png')";
}

function confirm(){
    var identity = document.getElementById("type").textContent;
    document.getElementById("confirm").disabled = true;
    if(state == "makeAccount"){
        if(identity == "交大學生"){
            identity = "student";
        }
        else if(identity == "交大教職員"){
            identity = "teacher";
        }
        else{
            identity = "others";
        }

        var password = document.getElementById("password").value;
        var email = document.getElementById("email").value;
        var user = {
            account: document.getElementById("account").value,
            type: identity
        }

        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(() => {
            var loginUser = null;
            while(loginUser == null) loginUser = firebase.auth().currentUser;
            db.ref("/users/" + loginUser.uid).set(user);
        })
        .catch((err) => {
            if(err.code == "auth/email-already-in-use") window.alert("email已經被使用過了，請改用其他email");
            else if(err.code == "auth/invalid-email") window.alert("email格式錯誤");
            else if(err.code == "auth/weak-password") window.alert("密碼強度太弱了，建議換其他密碼喔！");
            window.alert("創建帳號時資料發生錯誤，請聯絡工作人員，或是使用" + ' "創帳發生問題"');
            console.log(err.code + ": " + err.message);
        });
    }
    else if(state == "login"){
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        firebase.auth().signInWithEmailAndPassword(email, password)
        .catch((err) => {
            if(err.code == "auth/invalid-email") window.alert("email格式錯誤");
            else if(err.code == "auth/user-not-found") window.alert("你還沒創建帳號喔！");
            else if(err.code == "auth/wrong-password") window.alert("密碼錯誤");
            else window.alert("登入或是創建帳號時資料發生錯誤，請聯絡工作人員，或是使用" + ' "登入發生問題"');
            console.log(err.code + ": " + err.message);
        });
    }
    document.getElementById("confirm").disabled = false;
}

function ch_pwd_type(){
    var state = document.getElementById("password").type;
    if(state == "password"){
        document.getElementById("password").type = "text";
        document.getElementsByClassName("eye")[0].style.backgroundImage = "url('img/show.png')";
    }
    else if(state == "text"){
        document.getElementById("password").type = "password";
        document.getElementsByClassName("eye")[0].style.backgroundImage = "url('img/hide.png')";
    }
}

function forgot_pwd(){
    var email = document.getElementById("email").value;
    if(email == ""){
        window.alert("請先在email填入遊戲使用的信箱，再按忘記密碼，密碼重置連結會送至此信箱");
    }
    else{
        firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
            window.alert("密碼重置連結已送至你的信箱，請至信箱更改新密碼");
        })
        .catch((err) => {
            if(err.code == "auth/invalid-email"){
                window.alert("email格式錯誤");
            }
            else if(err.code == "auth/user-not-found"){
                window.alert("無此信箱紀錄");
            }
            else{
                console.log(err.code + ": " + err.message);
                window.alert("登入或是創建帳號時資料發生錯誤，請聯絡工作人員，或是使用" + ' "登入發生問題"');
            }
        });
    }
}