
export default class User{

    private static currentUser: firebase.User;

    public static setCurrentUser(user: firebase.User): void {
        this.currentUser = user;
    }

    public static getCurrentUser(): firebase.User {
        return this.currentUser;
    }
}