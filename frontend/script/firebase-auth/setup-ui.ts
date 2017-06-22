import * as config from "firebase-auth/configuration";

function setLoginWidget() {
    config.initialize();

    // FirebaseUI config.
    const uiConfig = {
        signInSuccessUrl: "#",
        signInOptions: [
            // Leave the lines as is for the providers you want to offer your users.
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.FacebookAuthProvider.PROVIDER_ID,
            // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
            // firebase.auth.GithubAuthProvider.PROVIDER_ID,
            firebase.auth.EmailAuthProvider.PROVIDER_ID
        ],
        // Terms of service url.
        tosUrl: "/bar"
    };

    config.authUI().start("#firebaseui-auth-container", uiConfig);
}

function setLogoutLink() {
    document.getElementById("user-signout").addEventListener("click", () => {
        console.log("signing out");
        firebase.auth().signOut();
        setLoginWidget();
    });
}

function userAuthListener() {
    config.initialize();

    firebase.auth().onAuthStateChanged((user: firebase.User) => {
        console.log("auth state change")
        if (user) {
            console.log("user");
            document.getElementById("user-signout").classList.remove("hidden");
            document.getElementById("user-signin").classList.add("hidden");
            // User is signed in.
            var displayName = user.displayName;
            var uid = user.uid;
            window.user = {
                displayName: displayName,
                uid: uid
            }; // TODO store the entire user object to be able to get a fresh token
            user.getIdToken().then((accessToken) => {
                window.user = {
                    displayName: displayName,
                    uid: uid,
                    accessToken: accessToken,
                };
            }, null); //TODO what on error? probably just log out
        } else {
            document.getElementById("user-signout").classList.add("hidden");
            document.getElementById("user-signin").classList.remove("hidden");
            console.log("no user");
            window.user = null;
            // What else to do when the user is not logged in?
        }
    }, function (error) {
        console.log(error);
    });
}

export function setupListeners() {
    setLoginWidget();
    setLogoutLink();
    userAuthListener();
}