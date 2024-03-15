export class AppSettings {
    public static API_ENDPOINT = "http://ho.hitechprojects.co.in:8101";
    public static Root_ENDPOINT = "/wwwroot";
    
    public static userData: any = JSON.parse(localStorage.getItem('UserData'));
    public static RefreshLocalStorage(){
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