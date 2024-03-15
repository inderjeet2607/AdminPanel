import { HttpEventType } from '@angular/common/http';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UploadServiceService } from '../../services/upload/upload-service.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { IndustryService } from '../../services/industry/industry.service';
import { PackageTypeService } from '../../services/packageType/package-type.service';
import { AppSettings } from '../../services/Constants';
import { GroupListService } from '../../services/groupList/group-list.service';


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
  fifthFormGroup: FormGroup;
  businessGroupID: any;
  submitted = false;
  file: File;
  uploadProgress: any;
  loadingLoading: boolean = false;
  uploadSub: Subscription;
  isfileUploaded = false;
  annImage: any;
  fileName: any;
  filePath: any;
  BusinessImageUrl1: any;
  logoPath: any;
  industryTypeData: any = [];
  packageTypeData: any = [];
  dropdownSettingsSingle: IDropdownSettings = {};
  dropdownSettingsSinglePackage: IDropdownSettings = {};
  @ViewChild('stepper') public stepper: any;
  isLoading = false;
  isEmailVerified: boolean = false;
  verificationText = 'Unverified';

  constructor(private aroute: ActivatedRoute, private route: Router, private fb: FormBuilder, private _uploadService: UploadServiceService,
    private _industryService: IndustryService, private _packageService: PackageTypeService,
    private _groupService: GroupListService) {

    this.firstFormGroup = this.fb.group({
      BusinessgroupName: ['', Validators.required],
      // LogoFileName: ['', Validators.required],
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
      LastName: ['', Validators.required],
    });
    this.secondFormGroup = this.fb.group({
      secondCtrl: ['', Validators.required],
    });
    this.thirdFormGroup = this.fb.group({
      secondCtrl: ['', Validators.required],
    });
    this.fourthFormGroup = this.fb.group({
      secondCtrl: ['', Validators.required],
    });
    this.fifthFormGroup = this.fb.group({
      secondCtrl: ['', Validators.required],
    });
    this.isLinear = true;
  }

  ngOnInit() {
    this.aroute.params.subscribe((params: Params) => this.businessGroupID = params['id']);
    this.getIndustries();
    this.getPackageTypes();

    // this.getBusinessGroupByID(6);

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

  getPackageTypes() {
    this._packageService.GetPackageTypes().subscribe({
      next: (data: any) => {
        this.packageTypeData = data;
      },
      error: (error: any) => {

      }
    })
  }

  onChange(event: any) {
    this.file = event.target.files[0];
  }

  onUpload() {
    if (this.file) {
      this.loadingLoading = true;
      this.uploadSub = this._uploadService.uploadBusinessImage(this.file).subscribe((event: any) => {
        if (event.type == HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round(100 * (event.loaded / event.total)).toString() + "%";
        }
        if (event.partialText != undefined && event.partialText.split('|')[0] == "file uploaded") {
          this.loadingLoading = false; // Flag variable
          this.isfileUploaded = true;
          this.annImage = AppSettings.API_ENDPOINT + AppSettings.Root_ENDPOINT + "/" + this.file.name;
          let array = event.partialText.split('|')[1].split('\\');
          this.fileName = array[array.length - 1];
          this.filePath = AppSettings.API_ENDPOINT + AppSettings.Root_ENDPOINT + "/" + this.fileName;
        } else {
          this.loadingLoading = false;
          this.isfileUploaded = false;
        }
      });
    }
    this.loadingLoading = false;
  }

  cancelUpload() {
    this.uploadSub.unsubscribe();
    this.uploadProgress = "0%";
    this.isfileUploaded = false;
    this.fileName = "";
    this.reset();
  }

  reset() {
    this.file = null;
    this.filePath = null;
    this.uploadProgress = null;
    this.uploadSub = null;
  }

  Cancel() {
    this.route.navigate(['group-list']);
  }

  SaveGroupDetails() {
    this.submitted = true;
    if (this.firstFormGroup.invalid) {
      console.log("invalid");
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
      "logoPath": this.fileName,
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

}
