import { HttpEventType } from '@angular/common/http';
import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UploadServiceService } from '../../services/upload/upload-service.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { IndustryService } from '../../services/industry/industry.service';
import { PackageTypeService } from '../../services/packageType/package-type.service';
import { AppSettings } from '../../services/Constants';
import { GroupListService } from '../../services/groupList/group-list.service';
import { StateService } from '../../services/state/state.service';
import { BusinessProfilesService } from '../../services/businessProfile/business-profiles.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {
  isLinear = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;
  businessGroupID: any;
  submitted = false;
  finalSubmit = false;
  //#region Group Logo variables
  fileGroupLogo: File;
  uploadProgressGroupLogo: any;
  loadingGroupLogo: boolean = false;
  uploadSubGroupLogo: Subscription;
  isfileUploadedGroupLogo = false;
  annImageGroupLogo: any;
  fileNameGroupLogo: any = null;
  filePathGroupLogo: any = null;
  //#endregion
  industryTypeData: any = [];
  packageTypeData: any = [];
  statesData: any = [];
  businessLocationName: any = [];
  dropdownSettingsSingle: IDropdownSettings = {};
  dropdownSettingsSinglePackage: IDropdownSettings = {};
  dropdownSettingsSingleState: IDropdownSettings = {};
  dropdownSettingsBusinessLocationName: IDropdownSettings = {};
  //#region Business Logo variables
  fileBusinessLogo: File;
  uploadProgressBusinessLogo: any;
  loadingBusinessLogo: boolean = false;
  uploadSubBusinessLogo: Subscription;
  isfileUploadedBusinessLogo = false;
  annImageBusinessLogo: any;
  fileNameBusinessLogo: any = null;
  filePathBusinessLogo: any = null;
  //#endregion
  @ViewChild('stepper') public stepper: any;
  //#region Business Display Image
  fileBusinessDisplayImage: File;
  uploadProgressBusinessDisplayImage: any;
  loadingBusinessDisplayImage: boolean = false;
  uploadSubBusinessDisplayImage: Subscription;
  isfileUploadedBusinessDisplayImage = false;
  annImageBusinessDisplayImage: any;
  fileNameBusinessDisplayImage: any = null;
  filePathBusinessDisplayImage: any = null;
  //#endregion
  isLoading = false;
  isEmailVerified: boolean = false;
  verificationText = 'Unverified';
  //#region Business Image 1
  fileBusinessImage1: File;
  uploadProgressBusinessImage1: any;
  loadingBusinessImage1: boolean = false;
  uploadSubBusinessImage1: Subscription;
  isfileUploadedBusinessImage1 = false;
  annImageBusinessImage1: any;
  fileNameBusinessImage1: any = null;
  filePathBusinessImage1: any = null;
  //#endregion
  //#region Business Image 2
  fileBusinessImage2: File;
  uploadProgressBusinessImage2: any;
  loadingBusinessImage2: boolean = false;
  uploadSubBusinessImage2: Subscription;
  isfileUploadedBusinessImage2 = false;
  annImageBusinessImage2: any;
  fileNameBusinessImage2: any = null;
  filePathBusinessImage2: any = null;
  //#endregion
  //#region Business Image 3
  fileBusinessImage3: File;
  uploadProgressBusinessImage3: any;
  loadingBusinessImage3: boolean = false;
  uploadSubBusinessImage3: Subscription;
  isfileUploadedBusinessImage3 = false;
  annImageBusinessImage3: any;
  fileNameBusinessImage3: any = null;
  filePathBusinessImage3: any = null;
  //#endregion
  //#region Business Image 4
  fileBusinessImage4: File;
  uploadProgressBusinessImage4: any;
  loadingBusinessImage4: boolean = false;
  uploadSubBusinessImage4: Subscription;
  isfileUploadedBusinessImage4 = false;
  annImageBusinessImage4: any;
  fileNameBusinessImage4: any = null;
  filePathBusinessImage4: any = null;
  //#endregion

  constructor(private aroute: ActivatedRoute, private route: Router, private fb: FormBuilder, private _uploadService: UploadServiceService,
    private _industryService: IndustryService, private _packageService: PackageTypeService, private _groupService: GroupListService,
    private _stateService: StateService, private _businessProfileService: BusinessProfilesService) {

    this.firstFormGroup = this.fb.group({
      BusinessgroupName: ['', Validators.required],
      IndustryTypeID: ['', Validators.required],
      PackageTypeID: ['', Validators.required],
      SMSProfileID: ['', Validators.required],
      SMSPhoneNumber: ['', Validators.required],
      SignoutRequired: [false],
      SignoutHours: [''],
      SpinWheelRequired: [false],
      BusinessClosureTime: ['', Validators.required],
      EmailID: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")]],
      PhoneNumber: ['', Validators.required],
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required]
    });
    this.secondFormGroup = this.fb.group({
      BusinessLocationName: ['', Validators.required],
      BusinessShortName: ['', Validators.required],
      PhoneNo: ['', Validators.required],
      Address: ['', Validators.required],
      StateID: ['', Validators.required],
      Pincode: ['', Validators.required],
      BusinessLabelID: ['', Validators.required],
      Description: ['', Validators.required],
      WebsiteUrl: [''],
      FacebookUrl: [''],
      TwitterUrl: [''],
      GoogleUrl: [''],
      InstagramUrl: [''],
      YelpUrl: [''],
      MonFromTime: [''],
      MonToTime: [''],
      TueFromTime: [''],
      TueToTime: [''],
      WedFromTime: [''],
      WedToTime: [''],
      ThuFromTime: [''],
      ThuToTime: [''],
      FriFromTime: [''],
      FriToTime: [''],
      SatFromTime: [''],
      SatToTime: [''],
      SunFromTime: [''],
      SunToTime: ['']
    });
    this.thirdFormGroup = this.fb.group({
      CardNo: [''],
      BusinessLocationName: ['', Validators.required],
      PackageTypeID: ['', Validators.required],
      ExpiryDate: [''],
      Cvv: [''],
      ZipCode: ['', Validators.required],
      ChkMakeDefault: [''],
      CardHolderName: [''],
      AccNo: [''],
      RoutingNo: [''],
      AccHolderName: [''],
      selectedOption: ['1'],
      GoLiveDate: ['']
    });
    this.fourthFormGroup = this.fb.group({
      SrcBusinessLocationName: ['', Validators.required],
      CustTabletBrand: ['', Validators.required],
      CustTabletModel: ['', Validators.required],
      StoreTabletBrand: ['', Validators.required],
      StoreTabletModel: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.aroute.params.subscribe((params: Params) => this.businessGroupID = params['id']);
    this.getIndustries();
    this.getPackageTypes();
    this.getStates();
    this.getBusinessLocationName();

    if (this.businessGroupID != null && this.businessGroupID != '' && this.businessGroupID != undefined && this.businessGroupID != 'New') {
      this.getBusinessGroupByID(this.businessGroupID);
    }

    this.dropdownSettingsSingle = {
      idField: 'id',
      textField: 'name',
      singleSelection: true
    }

    this.dropdownSettingsSinglePackage = {
      idField: 'id',
      textField: 'packageName',
      singleSelection: true
    }

    this.dropdownSettingsSingleState = {
      idField: 'id',
      textField: 'name',
      singleSelection: true
    }

    this.dropdownSettingsBusinessLocationName = {
      idField: 'id',
      textField: 'businessName',
      singleSelection: true
    }
  }

  getIndustries() {
    this._industryService.GetIndustries().subscribe({
      next: (data: any) => {
        this.industryTypeData = data;
      },
      error: (error: any) => {

      }
    })
  }

  getStates() {
    this._stateService.GetStates().subscribe({
      next: (data: any) => {
        this.statesData = data;
      },
      error: (error: any) => {

      }
    })
  }

  getPackageTypes() {
    this._packageService.GetPackageTypes().subscribe({
      next: (data: any) => {
        this.packageTypeData = data;
      },
      error: (error: any) => {

      }
    })
  }

  getBusinessLocationName() {
    this._businessProfileService.GetBusinessLocationByGroupId(1).subscribe({
      next: (data: any) => {
        this.businessLocationName = data;
      },
      error: (error: any) => {
        console.log("This is error message", error)
      }
    })
  }

  //#region BusinessGroupLogo
  onChange(event: any) {
    this.fileGroupLogo = event.target.files[0];

    if (this.fileGroupLogo) {
      this.loadingGroupLogo = true;
      this.uploadSubGroupLogo = this._uploadService.uploadBusinessImage(this.fileGroupLogo).subscribe((event: any) => {
        if (event.type == HttpEventType.UploadProgress) {
          this.uploadProgressGroupLogo = Math.round(100 * (event.loaded / event.total)).toString() + "%";
        }
        if (event.partialText != undefined && event.partialText.split('|')[0] == "file uploaded") {
          this.loadingGroupLogo = false; // Flag variable
          this.isfileUploadedGroupLogo = true;
          this.annImageGroupLogo = AppSettings.API_ENDPOINT + AppSettings.Root_ENDPOINT + "/" + this.fileGroupLogo.name;
          let array = event.partialText.split('|')[1].split('\\');
          this.fileNameGroupLogo = array[array.length - 1];
          this.filePathGroupLogo = AppSettings.API_ENDPOINT + AppSettings.Root_ENDPOINT + "/" + this.fileNameGroupLogo;
        } else {
          this.loadingGroupLogo = false;
          this.isfileUploadedGroupLogo = false;
        }
      });
    }
    this.loadingGroupLogo = false;
  }

  cancelUpload() {
    if (this.uploadSubGroupLogo != null) {
      this.uploadSubGroupLogo.unsubscribe();
    }
    this.uploadProgressGroupLogo = "0%";
    this.isfileUploadedGroupLogo = false;
    this.reset();
  }

  reset() {
    this.fileGroupLogo = null;
    this.fileNameGroupLogo = null;
    this.filePathGroupLogo = null;
    this.uploadProgressGroupLogo = null;
    this.uploadSubGroupLogo = null;
  }
  //#endregion

  //#region BusinessLogo
  onChangeBusinessLogo(event: any) {
    this.fileBusinessLogo = event.target.files[0];

    if (this.fileBusinessLogo) {
      this.loadingBusinessLogo = true;
      this.uploadSubBusinessLogo = this._uploadService.uploadBusinessImage(this.fileBusinessLogo).subscribe((event: any) => {
        if (event.type == HttpEventType.UploadProgress) {
          this.uploadProgressBusinessLogo = Math.round(100 * (event.loaded / event.total)).toString() + "%";
        }
        if (event.partialText != undefined && event.partialText.split('|')[0] == "file uploaded") {
          this.loadingBusinessLogo = false; // Flag variable
          this.isfileUploadedBusinessLogo = true;
          this.annImageBusinessLogo = AppSettings.API_ENDPOINT + AppSettings.Root_ENDPOINT + "/" + this.fileBusinessLogo.name;
          let array = event.partialText.split('|')[1].split('\\');
          this.fileNameBusinessLogo = array[array.length - 1];
          this.filePathBusinessLogo = AppSettings.API_ENDPOINT + AppSettings.Root_ENDPOINT + "/" + this.fileNameBusinessLogo;
        } else {
          this.loadingBusinessLogo = false;
          this.isfileUploadedBusinessLogo = false;
        }
      });
    }
    this.loadingBusinessLogo = false;
  }

  cancelUploadBusinessLogo() {
    if (this.uploadSubBusinessLogo != null) {
      this.uploadSubBusinessLogo.unsubscribe();
    }
    this.uploadProgressBusinessLogo = "0%";
    this.isfileUploadedBusinessLogo = false;
    this.fileNameBusinessLogo = 'Upload Image (Upto 1 MB)';
    this.resetBusinessLogoDetails();
  }

  resetBusinessLogoDetails() {
    this.fileBusinessLogo = null;
    this.filePathBusinessLogo = null;
    this.uploadProgressBusinessLogo = null;
    this.uploadSubBusinessLogo = null;
  }
  //#endregion

  //#region BusinessDisplayImage
  onChangeBusinessDisplayImage(event: any) {
    this.fileBusinessDisplayImage = event.target.files[0];

    if (this.fileBusinessDisplayImage) {
      this.loadingBusinessDisplayImage = true;
      this.uploadSubBusinessDisplayImage = this._uploadService.uploadBusinessImage(this.fileBusinessDisplayImage).subscribe((event: any) => {
        if (event.type == HttpEventType.UploadProgress) {
          this.uploadProgressBusinessDisplayImage = Math.round(100 * (event.loaded / event.total)).toString() + "%";
        }
        if (event.partialText != undefined && event.partialText.split('|')[0] == "file uploaded") {
          this.loadingBusinessDisplayImage = false; // Flag variable
          this.isfileUploadedBusinessDisplayImage = true;
          this.annImageBusinessDisplayImage = AppSettings.API_ENDPOINT + AppSettings.Root_ENDPOINT + "/" + this.fileBusinessDisplayImage.name;
          let array = event.partialText.split('|')[1].split('\\');
          this.fileNameBusinessDisplayImage = array[array.length - 1];
          this.filePathBusinessDisplayImage = AppSettings.API_ENDPOINT + AppSettings.Root_ENDPOINT + "/" + this.fileNameBusinessDisplayImage;
        } else {
          this.loadingBusinessDisplayImage = false;
          this.isfileUploadedBusinessDisplayImage = false;
        }
      });
    }
    this.loadingBusinessDisplayImage = false;
  }

  cancelUploadBusinessDisplayImage() {
    if (this.uploadSubBusinessDisplayImage != null) {
      this.uploadSubBusinessDisplayImage.unsubscribe();
    }
    this.uploadProgressBusinessDisplayImage = "0%";
    this.isfileUploadedBusinessDisplayImage = false;
    this.fileNameBusinessDisplayImage = 'Upload Image (Upto 1 MB)';
    this.resetBusinessDisplayImageDetails();
  }

  resetBusinessDisplayImageDetails() {
    this.fileBusinessDisplayImage = null;
    this.filePathBusinessDisplayImage = null;
    this.uploadProgressBusinessDisplayImage = null;
    this.uploadSubBusinessDisplayImage = null;
  }
  //#endregion

  //#region BusinessImage1
  onChangeBusinessImage1(event: any) {
    this.fileBusinessImage1 = event.target.files[0];

    if (this.fileBusinessImage1) {
      this.loadingBusinessImage1 = true;
      this.uploadSubBusinessImage1 = this._uploadService.uploadBusinessImage(this.fileBusinessImage1).subscribe((event: any) => {
        if (event.type == HttpEventType.UploadProgress) {
          this.uploadProgressBusinessImage1 = Math.round(100 * (event.loaded / event.total)).toString() + "%";
        }
        if (event.partialText != undefined && event.partialText.split('|')[0] == "file uploaded") {
          this.loadingBusinessImage1 = false; // Flag variable
          this.isfileUploadedBusinessImage1 = true;
          this.annImageBusinessImage1 = AppSettings.API_ENDPOINT + AppSettings.Root_ENDPOINT + "/" + this.fileBusinessImage1.name;
          let array = event.partialText.split('|')[1].split('\\');
          this.fileNameBusinessImage1 = array[array.length - 1];
          this.filePathBusinessImage1 = AppSettings.API_ENDPOINT + AppSettings.Root_ENDPOINT + "/" + this.fileNameBusinessImage1;
        } else {
          this.loadingBusinessImage1 = false;
          this.isfileUploadedBusinessImage1 = false;
        }
      });
    }
    this.loadingBusinessImage1 = false;
  }

  cancelUploadBusinessImage1() {
    if (this.uploadSubBusinessImage1 != null) {
      this.uploadSubBusinessImage1.unsubscribe();
    }
    this.uploadProgressBusinessImage1 = "0%";
    this.isfileUploadedBusinessImage1 = false;
    this.fileNameBusinessImage1 = 'Upload Image (Upto 1 MB)';
    this.resetBusinessImage1Details();
  }

  resetBusinessImage1Details() {
    this.fileBusinessImage1 = null;
    this.filePathBusinessImage1 = null;
    this.uploadProgressBusinessImage1 = null;
    this.uploadSubBusinessImage1 = null;
  }
  //#endregion

  //#region BusinessImage2
  onChangeBusinessImage2(event: any) {
    this.fileBusinessImage2 = event.target.files[0];

    if (this.fileBusinessImage2) {
      this.loadingBusinessImage2 = true;
      this.uploadSubBusinessImage2 = this._uploadService.uploadBusinessImage(this.fileBusinessImage2).subscribe((event: any) => {
        if (event.type == HttpEventType.UploadProgress) {
          this.uploadProgressBusinessImage2 = Math.round(100 * (event.loaded / event.total)).toString() + "%";
        }
        if (event.partialText != undefined && event.partialText.split('|')[0] == "file uploaded") {
          this.loadingBusinessImage2 = false; // Flag variable
          this.isfileUploadedBusinessImage2 = true;
          this.annImageBusinessImage2 = AppSettings.API_ENDPOINT + AppSettings.Root_ENDPOINT + "/" + this.fileBusinessImage2.name;
          let array = event.partialText.split('|')[1].split('\\');
          this.fileNameBusinessImage2 = array[array.length - 1];
          this.filePathBusinessImage2 = AppSettings.API_ENDPOINT + AppSettings.Root_ENDPOINT + "/" + this.fileNameBusinessImage2;
        } else {
          this.loadingBusinessImage2 = false;
          this.isfileUploadedBusinessImage2 = false;
        }
      });
    }
    this.loadingBusinessImage2 = false;
  }

  cancelUploadBusinessImage2() {
    if (this.uploadSubBusinessImage2 != null) {
      this.uploadSubBusinessImage2.unsubscribe();
    }
    this.uploadProgressBusinessImage2 = "0%";
    this.isfileUploadedBusinessImage2 = false;
    this.fileNameBusinessImage2 = 'Upload Image (Upto 1 MB)';
    this.resetBusinessImage2Details();
  }

  resetBusinessImage2Details() {
    this.fileBusinessImage2 = null;
    this.filePathBusinessImage2 = null;
    this.uploadProgressBusinessImage2 = null;
    this.uploadSubBusinessImage2 = null;
  }
  //#endregion

  //#region BusinessImage3
  onChangeBusinessImage3(event: any) {
    this.fileBusinessImage3 = event.target.files[0];

    if (this.fileBusinessImage3) {
      this.loadingBusinessImage3 = true;
      this.uploadSubBusinessImage3 = this._uploadService.uploadBusinessImage(this.fileBusinessImage3).subscribe((event: any) => {
        if (event.type == HttpEventType.UploadProgress) {
          this.uploadProgressBusinessImage3 = Math.round(100 * (event.loaded / event.total)).toString() + "%";
        }
        if (event.partialText != undefined && event.partialText.split('|')[0] == "file uploaded") {
          this.loadingBusinessImage3 = false; // Flag variable
          this.isfileUploadedBusinessImage3 = true;
          this.annImageBusinessImage3 = AppSettings.API_ENDPOINT + AppSettings.Root_ENDPOINT + "/" + this.fileBusinessImage3.name;
          let array = event.partialText.split('|')[1].split('\\');
          this.fileNameBusinessImage3 = array[array.length - 1];
          this.filePathBusinessImage3 = AppSettings.API_ENDPOINT + AppSettings.Root_ENDPOINT + "/" + this.fileNameBusinessImage3;
        } else {
          this.loadingBusinessImage3 = false;
          this.isfileUploadedBusinessImage3 = false;
        }
      });
    }
    this.loadingBusinessImage3 = false;
  }

  cancelUploadBusinessImage3() {
    if (this.uploadSubBusinessImage3 != null) {
      this.uploadSubBusinessImage3.unsubscribe();
    }
    this.uploadProgressBusinessImage3 = "0%";
    this.isfileUploadedBusinessImage3 = false;
    this.fileNameBusinessImage3 = 'Upload Image (Upto 1 MB)';
    this.resetBusinessImage3Details();
  }

  resetBusinessImage3Details() {
    this.fileBusinessImage3 = null;
    this.filePathBusinessImage3 = null;
    this.uploadProgressBusinessImage3 = null;
    this.uploadSubBusinessImage3 = null;
  }
  //#endregion

  //#region BusinessImage4
  onChangeBusinessImage4(event: any) {
    this.fileBusinessImage4 = event.target.files[0];

    if (this.fileBusinessImage4) {
      this.loadingBusinessImage4 = true;
      this.uploadSubBusinessImage4 = this._uploadService.uploadBusinessImage(this.fileBusinessImage4).subscribe((event: any) => {
        if (event.type == HttpEventType.UploadProgress) {
          this.uploadProgressBusinessImage4 = Math.round(100 * (event.loaded / event.total)).toString() + "%";
        }
        if (event.partialText != undefined && event.partialText.split('|')[0] == "file uploaded") {
          this.loadingBusinessImage4 = false; // Flag variable
          this.isfileUploadedBusinessImage4 = true;
          this.annImageBusinessImage4 = AppSettings.API_ENDPOINT + AppSettings.Root_ENDPOINT + "/" + this.fileBusinessImage4.name;
          let array = event.partialText.split('|')[1].split('\\');
          this.fileNameBusinessImage4 = array[array.length - 1];
          this.filePathBusinessImage4 = AppSettings.API_ENDPOINT + AppSettings.Root_ENDPOINT + "/" + this.fileNameBusinessImage4;
        } else {
          this.loadingBusinessImage4 = false;
          this.isfileUploadedBusinessImage4 = false;
        }
      });
    }
    this.loadingBusinessImage4 = false;
  }

  cancelUploadBusinessImage4() {
    if (this.uploadSubBusinessImage4 != null) {
      this.uploadSubBusinessImage4.unsubscribe();
    }
    this.uploadProgressBusinessImage4 = "0%";
    this.isfileUploadedBusinessImage4 = false;
    this.fileNameBusinessImage4 = 'Upload Image (Upto 1 MB)';
    this.resetBusinessImage4Details();
  }

  resetBusinessImage4Details() {
    this.fileBusinessImage4 = null;
    this.filePathBusinessImage4 = null;
    this.uploadProgressBusinessImage4 = null;
    this.uploadSubBusinessImage4 = null;
  }
  //#endregion

  Cancel() {
    this.route.navigate(['group-list']);
  }

  SaveGroupDetails() {
    this.submitted = true;
    if (this.firstFormGroup.invalid) {
      return;
    }
    this.isLoading = true;
    let model = this.createModel();
    this._groupService.PostBusinessGroupForAdminPanel(model)
      .subscribe({
        next: (data) => {
          console.log(data.id)
          this.getBusinessGroupByID(data.id);
          this.isLoading = false;
          this.submitted = false;
        },
        error: error => {
          console.log(error);
          this.isLoading = false;
          this.submitted = false;
        }
      });
  }

  getBusinessGroupByID(id) {
    this._groupService.GetBusinessGroupByID(id).subscribe({
      next: (data: any) => {
        console.log(data);
        this.isLinear = false;

        this.firstFormGroup.controls['BusinessgroupName'].setValue(data.businessGroupName);

        let selectedIndustry: { id: any, name: any }[] = [];
        selectedIndustry.push({
          id: data.indutryTypeID,
          name: data.industryType
        });
        this.firstFormGroup.controls['IndustryTypeID'].setValue(selectedIndustry);

        let selectedPackage: { id: any, packageName: any }[] = [];
        selectedPackage.push({
          id: data.packageTypeID,
          packageName: data.packageTypeName
        });
        this.firstFormGroup.controls['PackageTypeID'].setValue(selectedPackage);
        this.firstFormGroup.controls['SMSProfileID'].setValue(data.smsProfileID);
        this.firstFormGroup.controls['SMSPhoneNumber'].setValue(data.smsFromNumber);
        this.firstFormGroup.controls['SignoutRequired'].setValue(data.isSignOutRequired);
        this.firstFormGroup.controls['SignoutHours'].setValue(data.autoSignOutTime);
        this.firstFormGroup.controls['SpinWheelRequired'].setValue(data.isSpinRequired);

        let time = new Date(data.businessClosureTime).getHours() + ':' + new Date(data.businessClosureTime).getMinutes();
        this.firstFormGroup.controls['BusinessClosureTime'].setValue(time);

        this.firstFormGroup.controls['FirstName'].setValue(data.firstName);
        this.firstFormGroup.controls['LastName'].setValue(data.lastName);
        this.firstFormGroup.controls['PhoneNumber'].setValue(data.mobile);
        this.firstFormGroup.controls['EmailID'].setValue(data.email);
        this.isEmailVerified = data.isEmailVerified;

        this.filePathGroupLogo = AppSettings.API_ENDPOINT + AppSettings.Root_ENDPOINT + "/" + data.logoPath;
        this.uploadProgressGroupLogo = (100).toString() + "%";

        this.fileNameGroupLogo = data.logoPath;
      },
      error: (error: any) => {

      }
    })
  }

  createModel() {
    let details = {
      "uniqueID": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "id": 0,
      "businessGroupName": this.firstFormGroup.controls['BusinessgroupName'].value,
      "createdBy": AppSettings.GetCreatedBy(),
      "createdDate": AppSettings.GetDate(),
      "lastModifiedBy": AppSettings.GetLastModifiedBy(),
      "lastModifiedDate": AppSettings.GetDate(),
      "logoPath": this.fileNameGroupLogo,
      "packageTypeID": this.firstFormGroup.controls['PackageTypeID'].value[0].id,
      "indutryTypeID": this.firstFormGroup.controls['IndustryTypeID'].value[0].id,
      "smsProfileID": this.firstFormGroup.controls['SMSProfileID'].value,
      "smsFromNumber": this.firstFormGroup.controls['SMSPhoneNumber'].value,
      "isSignOutRequired": this.firstFormGroup.controls['SignoutRequired'].value,
      "autoSignOutTime": this.firstFormGroup.controls['SignoutHours'].value,
      "isSpinRequired": this.firstFormGroup.controls['SpinWheelRequired'].value,
      "businessClosureTime": this.firstFormGroup.controls['BusinessClosureTime'].value,
      "firstName": this.firstFormGroup.controls['FirstName'].value,
      "lastName": this.firstFormGroup.controls['LastName'].value,
      "mobile": this.firstFormGroup.controls['PhoneNumber'].value,
      "email": this.firstFormGroup.controls['EmailID'].value,
      "isEmailVerified": this.isEmailVerified
    }

    return details;
  }

  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  SavePaymentInfo() {
    this.submitted = true;
    if (this.thirdFormGroup.invalid) {
      console.log("Invalid")
      return;
    }
    this.isLoading = true;
  }

  ReviewAndSave() {
    this.submitted = true;
    if (this.fourthFormGroup.invalid) {
      return;
    }
    this.isLoading = true;
  }

}
