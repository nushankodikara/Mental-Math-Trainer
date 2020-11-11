var provider = new firebase.auth.GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

$('.alogin').fadeOut();
$('.blogin').fadeIn();
var userObj;
var catt;

function authCheck(){
    firebase.database().ref(`smat/${userObj.uid}/`).update({
        authCheck: 1
    });
    setTimeout(function(){
        firebase.database().ref(`smat/${userObj.uid}/authCheck`).once('value').then(function(snapshot) {
            auth = snapshot.val() || 0;
            console.log(snapshot.val())
            if(!auth){
                loggedOut()
                alert('Please Contact +94724874919 on whatsapp for Permission. If you already paid for this month, Please report to prasadskodikara@gmail.com')
                signOut()
            } else {
                firebase.database().ref(`smat/${userObj.uid}/`).update({
                    authCheck: 0
                });
                loggedIn()
                firebase.database().ref(`smat/${userObj.uid}/currentAttempt`).on('value', function(snapshot) {
                    attempts = snapshot.val() || 1;
                    catt = attempts;
                    $('.attempt').text(catt);
                });
            }
        })}
    , 3000);
}

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        userObj = user;
        authCheck()
    } else {
        loggedOut()
    }
  });

function login(){

    firebase.auth().signInWithPopup(provider).then(function(result) {
        var user = result.user;
    }).catch(function(error) {
        var errorMessage = error.message;
        alert(errorMessage)
    });

}

function signOut(){
    firebase.auth().signOut().then(function() {
        alert('Signed Out Successfully!')
      }).catch(function(error) {
        alert(error.message)
      });
}

function loggedIn(){
    $('.alogin').fadeIn();
    $('.blogin').fadeOut();
    $('.name').text(userObj.displayName)
}

function loggedOut(){
    $('.alogin').fadeOut();
    $('.blogin').fadeIn();  
}

function writeCurrentAttempt() {
    var nat = catt + 1;
    firebase.database().ref(`smat/${userObj.uid}/`).update({
      currentAttempt: nat
    });
  }

function writeScore(cps){
    firebase.database().ref(`smat/${userObj.uid}/Attempts/${catt}`).update({
        cps: cps
    });
    writeCurrentAttempt();
}