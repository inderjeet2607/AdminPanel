export class AppSettings {
    public static API_ENDPOINT = "https://api.dev.revords.com";
    public static Root_ENDPOINT = "https://s3-us-west-1.amazonaws.com/revords.live.files/";

    public static userData: any = JSON.parse(localStorage.getItem('UserData'));
    public static RefreshLocalStorage() {
        this.userData = JSON.parse(localStorage.getItem('UserData'));
    }

    public static GetCreatedBy() {
        this.RefreshLocalStorage();
        return this.userData != null && this.userData.userId != null && this.userData.userId != undefined ? this.userData.userId : 1;
    }

    public static GetLastModifiedBy() {
        this.RefreshLocalStorage();
        return this.userData != null && this.userData.userId != null && this.userData.userId != undefined ? this.userData.userId : 1;
    }
    
    public static GetDate() {
        return new Date();
    }
}