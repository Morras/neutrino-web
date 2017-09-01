export function initialize() {
    // Make sure we only initialize the app once
    if ( firebase.apps.length > 0 ) {
        return;
    }
    const config = {
        apiKey: "AIzaSyBhhvcakeAacEgCkxGIMC5MGpdUX1N4hms",
        authDomain: "neutrino-1151.firebaseapp.com",
        databaseURL: "https://neutrino-1151.firebaseio.com",
        projectId: "neutrino-1151",
        storageBucket: "neutrino-1151.appspot.com",
        messagingSenderId: "511247001959"
    };
    firebase.initializeApp(config);
}

let ui: firebaseui.auth.AuthUI;

export function authUI() {
    if ( ui == null ) {
        ui = new firebaseui.auth.AuthUI(firebase.auth());
    }
    return ui;
}
