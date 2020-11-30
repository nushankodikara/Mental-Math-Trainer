/* Log-In to the Program */
function login() {
    $('#loginButton').html('<div class="spinner-border spinner-border-sm" role="status"><span class="sr-only"></span></div> Processing')
    var email = $('#sign-in-email').val()
    var password = $('#sign-in-pass').val()
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((user) => {
            userObj = user;
            authCheck();
        })
        .catch((error) => {
            if (error.code == "auth/user-not-found") {
                $('#signupModal').modal('show')
            } else if (error.code == "auth/wrong-password") {
                alert("Wrong Password. Please Check your Password again.")
            }
            $('#loginButton').html('Log In')
        });
}

/* Reset Password */
function resetPassword() {
    firebase.auth().sendPasswordResetEmail($('#reset-email').val()).then(function () {
        alert("Please Check your email inbox and reset your password from the like we sent you.")
    }).catch(function (error) {
        alert(error.message)
    });
}

/* Signup Function */
function signUp() {
    if ($('#sign-up-pass').val() == $('#sign-up-cpass').val()) {
        firebase.auth().createUserWithEmailAndPassword($('#sign-up-email').val(), $('#sign-up-pass').val())
            .then((user) => {
                userObj = user;
                firebase.auth().currentUser.updateProfile({
                    displayName: $('#full-name').val()
                });
                alert("Successfully Signed Up. Please make the payment in order to access the program.")
                authCheck();
            })
            .catch((error) => {
                var errorMessage = error.message;
                alert(errorMessage)
                $('#signupButton').html('Sign Up')
            });
        $('#signupButton').html('<div class="spinner-border spinner-border-sm" role="status"><span class="sr-only"></span></div> Processing')
        $('#signupModal').modal('toggle');
    } else {
        alert("Please Check Your Passwords")
    }
}

/* Global Variables */
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
                window.location.href = "/index.html#Payment";
                $('#loginButton').html('Log In')
                $('#signupButton').html('Sign Up')
                signOut()
            } else {
                firebase.database().ref(`smat/${userObj.uid}/`).update({
                    authCheck: 0,
                    email: userObj.email,
                    name: userObj.displayName || "No Username",
                });
                if (window.location.pathname != "/lin.html") {
                    window.location.href = "/lin.html";
                }
                firebase.database().ref(`smat/${userObj.uid}/currentAttempt`).on('value', function (snapshot) {
                    attempts = snapshot.val() || 1;
                    catt = attempts;
                    $('.attempt').text(catt);
                });

                if (window.location.pathname == "/lin.html") {
                    drawProgression();
                    $('#uid-text').val(userObj.uid)
                }
            }
        })
    }, 5000);
}

/* authentication check */
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        userObj = user;
        authCheck()
    } else {
        if (window.location.pathname != "/index.html") {
            window.location.href = "/index.html";
        }
    }
});

/* Sign out function */
function signOut() {
    firebase.auth().signOut().then(function () {}).catch(function (error) {
        alert(error.message)
    });
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
        if ($('#practicemode').is(":checked")) {

        } else {
            firebase.database().ref(`smat/${userObj.uid}/Attempts/${catt}`).update({
                cps: cps
            });
            writeCurrentAttempt();
            TimeInt = new Date();
        }
    }

}

/* Draw Chart */
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

/* You seems to be interested about this application, hit me up on FB for more information https://www.facebook.com/nushan.kodikara.7/ We can discuss a lot more! */

/* Feedback System */
function mail() {
    window.location.href = (`mailto:speedmathslk@gmail.com?subject=Feedback%20From%20${encodeURIComponent($('#uid-text').val())}&body=${encodeURIComponent($('#feedback-text').val())}`)
}

/* Account Settings Section start */

function changeName() {
    firebase.auth().currentUser.updateProfile({
        displayName: $('#newname').val()
    });
    alert("Process Queued")
    resetAccountSettingsWindow();
}

function changePassword() {
    firebase.auth().currentUser.updatePassword($('#newpass').val()).then(function () {
        alert("Successfully Changed The Password")
        resetAccountSettingsWindow()
    }).catch(function (error) {
        alert(error.message)
        resetAccountSettingsWindow()
    });
}

function resetAccountSettingsWindow() {
    $('#newname').val("")
    $('#newpass').val("")
    document.location.reload();
}

/* Account Settings section Ends */