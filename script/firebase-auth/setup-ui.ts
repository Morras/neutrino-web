import * as config from "./configuration";
import User from "./user";

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
        firebase.auth().signOut();
        setLoginWidget();
    });
}

function toggleUserSigninSignoutLink(userSignedIn: boolean) {
    if (userSignedIn) {
        document.getElementById("user-signout").classList.remove("hidden");
        document.getElementById("user-signin").classList.add("hidden");
    } else {
        document.getElementById("user-signout").classList.add("hidden");
        document.getElementById("user-signin").classList.remove("hidden");
    }
}

function userAuthListener() {
    config.initialize();

    firebase.auth().onAuthStateChanged((user: firebase.User) => {
        if (user) {
            toggleUserSigninSignoutLink(true);
            User.setCurrentUser(user);
        } else {
            toggleUserSigninSignoutLink(false);
            User.setCurrentUser(null);
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