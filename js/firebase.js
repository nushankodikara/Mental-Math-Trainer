/* Initialization */
var provider = new firebase.auth.GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

$('.alogin').fadeOut();
$('.blogin').fadeIn();
var userObj;
var catt;

/* Licence Check */
function authCheck() {
    firebase.database().ref(`smat/${userObj.uid}/`).update({
        authCheck: 1
    });
    setTimeout(function () {
        firebase.database().ref(`smat/${userObj.uid}/authCheck`).once('value').then(function (snapshot) {
            auth = snapshot.val() || 0;
            if (!auth) {
                loggedOut()
                alert('Please Contact +94724874919 on whatsapp for Permission. If you already paid for this month, Please report to prasadskodikara@gmail.com')
                signOut()
            } else {
                firebase.database().ref(`smat/${userObj.uid}/`).update({
                    authCheck: 0
                });
                loggedIn()
                firebase.database().ref(`smat/${userObj.uid}/currentAttempt`).on('value', function (snapshot) {
                    attempts = snapshot.val() || 1;
                    catt = attempts;
                    $('.attempt').text(catt);
                });
            }
        })
    }, 3000);
}

/* authentication check */
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        userObj = user;
        authCheck()
    } else {
        loggedOut()
    }
});

/* login function */
function login() {

    firebase.auth().signInWithPopup(provider).then(function (result) {
        var user = result.user;
    }).catch(function (error) {
        var errorMessage = error.message;
        alert(errorMessage)
    });

}

/* Sign out function */
function signOut() {
    firebase.auth().signOut().then(function () {
        alert('Signed Out Successfully!')
    }).catch(function (error) {
        alert(error.message)
    });
}

/* After logging in */
function loggedIn() {
    drawProgression();
    $('.alogin').fadeIn();
    $('.blogin').fadeOut();
    $('.name').text(userObj.displayName);
}

/* After Logging Out */
function loggedOut() {
    $('.alogin').fadeOut();
    $('.blogin').fadeIn();
}

/* Writing the current attempt to the database */
function writeCurrentAttempt() {
    var nat = catt + 1;
    firebase.database().ref(`smat/${userObj.uid}/`).update({
        currentAttempt: nat
    });
}

/* Add time intervals */
var TimeInt = new Date();
TimeInt = new Date(TimeInt.getTime() - 60000);
/* Writing scores to the database */
function writeScore(cps) {
    CT = new Date();
    if ((TimeInt.getTime() + 60000) < (CT.getTime())) {
        firebase.database().ref(`smat/${userObj.uid}/Attempts/${catt}`).update({
            cps: cps
        });
        writeCurrentAttempt();
        TimeInt = new Date();
    }

}

function drawProgression() {
    /* Average Mark */
    firebase.database().ref(`smat/${userObj.uid}/Attempts/`).limitToLast(100).on('value', function (snapshot) {
        var lab = [];
        var avg = [];
        var lar = [];
        var dar = [];
        var cnt = 0;
        /* retrieving values from database */
        snapshot.forEach(function (childSnapshot) {
            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();
            lab.push(childKey)
            avg.push(parseFloat(childData.cps));
        });
        $('.avg').text(math.mean(avg).toFixed(3));
        /* Preparing for the chart */
        for (var i = avg.length - 1; i >= 0; i--) {
            if (cnt == 20) {
                break
            } else {
                lar.push(lab[i]);
                dar.push(avg[i]);
                cnt += 1;
            }
        }
        lar.reverse();
        dar.reverse();
        /* Write Progression Report */
        if (math.std(dar).toFixed(3) < 0.012) {
            $('.prep').text("isn't changing that-much.");
            $('.quote').text("You are maintaining a steady rate, Try harder to increase it.");
        } else if ((math.mean(dar) - parseFloat(dar[dar.length - 1])) < 0) {
            $('.prep').text("is Increasing");
            $('.quote').text("Good Work! Keep it up.");
        } else if ((math.mean(dar) == parseFloat(dar[dar.length - 1]))) {
            $('.prep').text("is Average.");
            $('.quote').text("You are sticking with your peek performance, Try Harder! You can do better!");
        } else {
            $('.prep').text("is Decreasing!");
            $('.quote').text("You must seriously consider the situation, Maybe take some rest?");
        }
        /* Add a basic data series with six labels and values */
        var data = {
            labels: lar,
            series: [{
                data: dar
            }]
        };

        /* Set some base options (settings will override the default settings in Chartist.js *see default settings*). We are adding a basic label interpolation function for the xAxis labels. */
        var options = {
            axisX: {
                labelInterpolationFnc: function (value) {
                    return 'A' + value;
                }
            }
        };

        /* Now we can specify multiple responsive settings that will override the base settings based on order and if the media queries match. In this example we are changing the visibility of dots and lines as well as use different label interpolations for space reasons. */
        var responsiveOptions = [
            ['screen and (min-width: 641px) and (max-width: 1024px)', {
                showPoint: false,
                axisX: {
                    labelInterpolationFnc: function (value) {
                        return 'A' + value;
                    }
                }
            }],
            ['screen and (max-width: 640px)', {
                showPoint: false,
                axisX: {
                    labelInterpolationFnc: function (value) {
                        return 'A' + value;
                    }
                }
            }]
        ];
        new Chartist.Line('#progressionChart', data, options, responsiveOptions);
    });
}