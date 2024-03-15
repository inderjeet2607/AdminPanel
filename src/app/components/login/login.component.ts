import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../services/auth/login.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  button = 'Login';
  isLoading = false;
  UserName: any;
  Password: any;
  loading = false;
  show = false;
  bussinessData: any;
  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  });
  submitted = false;
  sentResetMail: boolean = false;
  sentResetMailDisable: boolean = false;


  constructor(private _route: Router, private fb: FormBuilder, private _users: LoginService) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  // showSnackbarAction(message: string, action: string) {

  //   if (action == "1") {
  //     this.toastService.showSuccess(message);
  //   } else if (action == "2") {
  //     this.toastService.showDanger(message);
  //   } else if (action == "3") {
  //     this.toastService.show(message);
  //   }
  // }
  onclicktoggle() {
    this.show = !this.show;
  }
  // async SetBusinessGroup(userId) {
  //   this._profileService.GetBusinessGroupesByUserID(userId)
  //     .subscribe({
  //       next: async (data) => {
  //         this.bussinessData = data;
  //         localStorage.setItem('BusinessGroup', JSON.stringify(this.bussinessData[0]));
  //         this._Route.navigate(['dashboard']);
  //       },
  //       error: error => {

  //       }
  //     });
  // }

  // forgotPassword() {
  //   if (!this.sentResetMailDisable) {
  //     this.isLoading = true;
  //     this.button = 'Processing';
  //     this.sentResetMailDisable = true;
  //     if (this.form.controls['username'].value != '' && this.form.controls['username'].value != null && this.form.controls['username'].value != undefined) {
  //       this._userservice.PutUserForgotPasswordSendMail(this.form.controls['username'].value).pipe()
  //         .subscribe({
  //           next: async (data) => {
  //             this.sentResetMail = true;
  //             this.button = 'Login';
  //             this.isLoading = false;
  //             // this.showSnackbarAction("Reset link will be sent to your Email!", "1");
  //           },
  //           error: error => {
  //             if (error.status == 404) {
  //               this.sentResetMail = false;
  //               this.sentResetMailDisable = false;
  //               this.button = 'Login';
  //               this.isLoading = false;
  //               this.showSnackbarAction("User doesn't exist!", "3");
  //             }
  //           }
  //         });
  //     } else {
  //       this.isLoading = false;
  //       this.button = 'Login';
  //       this.showSnackbarAction("Enter Valid Username", "3");
  //     }
  //   }
  // }

  async DoLogin() {
    try {
      this.submitted = true;

      if (this.form.invalid) {
        return;
      }
      this.isLoading = true;
      this.button = 'Processing';
      this.UserName = this.form.controls['username'].value;
      this.Password = this.form.controls['password'].value;

      this._users.Login(this.UserName, this.Password).pipe()
        .subscribe({
          next: async (data) => {
            // localStorage.setItem('PackageDetails', JSON.stringify(data.package));
            localStorage.setItem('UserData', JSON.stringify(data));
            // this.showSnackbarAction("Login successfully", "1");
            this.loading = false;
            this.isLoading = false;
            // localStorage.setItem('UserID', JSON.stringify(data.userId));
            this.button = 'Login';
            // await this.SetBusinessGroup(data.userId);
            this._route.navigate(['group-list']);

          },
          error: error => {
            // this.showSnackbarAction("Invalid UserName Password", "3");
            this.isLoading = false;
            this.button = 'Login';
          }
        });
    } catch (error) {
      console.error("This is error message", error);
    }
  }
}
