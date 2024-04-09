import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Subscription } from 'rxjs';
import { GroupListService } from '../../services/groupList/group-list.service';
import { BusinessProfilesService } from '../../services/businessProfile/business-profiles.service';
import { UploadServiceService } from '../../services/upload/upload-service.service';
import { ClientInvoiceService } from '../../services/clientInvoice/clientInvoice.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { HttpEventType } from '@angular/common/http';
import { AppSettings } from '../../services/Constants';
import { ClientPaymentsService } from '../../services/clientPayment/clientPayment.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css',
})
export class PaymentsComponent {
  dropdownSettingsSingleGroup: IDropdownSettings = {};
  dropdownSettingsSingleLocation: IDropdownSettings = {};
  dropdownSettingsSingleMethod: IDropdownSettings = {};
  firstFormGroup: FormGroup;
  businessGroupData: any = [];
  businessLocationData: any = [];
  methodData: any = [];
  submitted = false;
  isLoading = false;
  dropDownSelect = false;
  filepaymentpdf: File;
  uploadProgressfilepaymentpdf: any;
  loadingGroupLogo: boolean = false;
  uploadfilepaymentpdf: Subscription;
  isfileUploadedpaymentpdf = false;
  annpaymentpdf: any;
  fileNamepaymentpdf: any = null;
  filePathpaymentpdf: any = null;
  userData: any = JSON.parse(localStorage.getItem('UserData'));

  constructor(
    private fb: FormBuilder,
    private _groupService: GroupListService,
    private _businessProfileService: BusinessProfilesService,
    private _uploadService: UploadServiceService,
    private _clientPayment: ClientPaymentsService,
    private toast: ToastrService,
    private route: Router
  ) {
    this.firstFormGroup = this.fb.group({
      businessGroupID: ['', Validators.required],
      businessLocationID: ['', Validators.required],
      paymentDate: ['', Validators.required],
      method: ['', Validators.required],
      amount: ['', Validators.required],
      paymentpdf: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.methodData = [
      { id: 1, methodName: 'Cash' },
      { id: 2, methodName: 'Cheque' },
      { id: 3, methodName: 'Online' },
    ];
    this.getBusinessGroups();
    // this.getBusinessLocationsByGroupID()
    this.dropdownSettingsSingleGroup = {
      idField: 'id',
      textField: 'businessGroupName',
      singleSelection: true,
    };

    this.dropdownSettingsSingleLocation = {
      idField: 'id',
      textField: 'businessName',
      singleSelection: true,
    };

    this.dropdownSettingsSingleMethod = {
      idField: 'id',
      textField: 'methodName',
      singleSelection: true,
    };
  }

  getBusinessGroups() {
    this.submitted = false;
    this._groupService.GetBusinessGroups().subscribe({
      next: (data) => {
        this.businessGroupData = data;
      },
      error: (error) => {
        console.log('This is error message', error);
      },
    });
  }

  getBusinessLocationsByGroupID(event) {
    if (this.dropDownSelect) {
      this.firstFormGroup.controls['businessLocationID'].setValue('');
      if (this.firstFormGroup.controls['businessGroupID'].value.length != 0) {
        let groupID =
          this.firstFormGroup.controls['businessGroupID'].value[0].id;
        this._businessProfileService
          .GetBusinessLocationByGroupId(groupID)
          .subscribe({
            next: (data: any) => {
              this.businessLocationData = data;
            },
            error: (error: any) => {
              console.log('This is error message', error);
            },
          });
      } else {
        this.businessLocationData = [];
      }
    }
  }

  onChange(event: any) {
    this.filepaymentpdf = event.target.files[0];

    if (this.filepaymentpdf) {
      if (this.filepaymentpdf.type === 'application/pdf') {
      this.uploadfilepaymentpdf = this._uploadService
        .uploadBusinessImage(this.filepaymentpdf)
        .subscribe((event: any) => {
          if (event.type == HttpEventType.UploadProgress) {
            this.uploadProgressfilepaymentpdf =
              Math.round(100 * (event.loaded / event.total)).toString() + '%';
          }
          if (
            event.partialText != undefined &&
            event.partialText.split('|')[0] == 'file uploaded'
          ) {
            this.isfileUploadedpaymentpdf = true;
            this.annpaymentpdf =
              AppSettings.API_ENDPOINT +
              AppSettings.Root_ENDPOINT +
              '/' +
              this.filepaymentpdf.name;
            let array = event.partialText.split('|')[1].split('\\');
            this.fileNamepaymentpdf = array[array.length - 1];
            this.filePathpaymentpdf =
              AppSettings.API_ENDPOINT +
              AppSettings.Root_ENDPOINT +
              '/' +
              this.fileNamepaymentpdf;

            this.firstFormGroup.controls['paymentpdf'].setValue(
              this.fileNamepaymentpdf
            );
          } else {
            this.isfileUploadedpaymentpdf = false;
          }
        });
      }
      else{
        this.toast.warning('Select PDF File!', '', {
          positionClass: 'toast-bottom-right',
        });
      }
    }
    event.target.value = '';
  }

  cancelUpload() {
    if (this.uploadfilepaymentpdf != null) {
      this.uploadfilepaymentpdf.unsubscribe();
    }
    this.uploadProgressfilepaymentpdf = '0%';
    this.isfileUploadedpaymentpdf = false;
    this.reset();
  }

  reset() {
    this.filepaymentpdf = null;
    this.fileNamepaymentpdf = null;
    this.filePathpaymentpdf = null;
    this.uploadProgressfilepaymentpdf = null;
    this.uploadfilepaymentpdf = null;
    this.firstFormGroup.controls['paymentpdf'].setValue('');
  }

  SavePayment() {
    this.submitted = true;
    if (this.firstFormGroup.invalid) {
      return;
    }
    this.isLoading = true;
    let payment = {
      uniqueId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      id: 0,
      userId: this.userData.userId,
      paymentDate: this.firstFormGroup.controls['paymentDate'].value,
      paymentMethodId: this.firstFormGroup.controls['method'].value[0].id,
      paidAmount: this.firstFormGroup.controls['amount'].value,
      statusId: 3,
      billIds: null,
      isActive: true,
      createdBy: AppSettings.GetCreatedBy(),
      createdDate: AppSettings.GetDate(),
      lastModifiedBy: AppSettings.GetLastModifiedBy(),
      lastModifiedDate: AppSettings.GetDate(),
      paymentFilePath: this.fileNamepaymentpdf,
      businessLocationId:
        this.firstFormGroup.controls['businessLocationID'].value[0].id,
      businessGroupId:
        this.firstFormGroup.controls['businessGroupID'].value[0].id,
    };

    this._clientPayment.PostClientPayment(payment).subscribe({
      next: (data) => {
        this.submitted = false;
        this.filepaymentpdf = null;
        this.fileNamepaymentpdf = null;
        this.filePathpaymentpdf = null;
        this.uploadProgressfilepaymentpdf = null;
        this.uploadfilepaymentpdf = null;
        this.dropDownSelect = false;
        this.firstFormGroup.reset();
        this.toast.success('Payment Created Successfully!', '', {
          positionClass: 'toast-bottom-right',
        });
        this.isLoading = false;
        this.route.navigate(['payment-list']);
      },
      error: (error) => {
        this.isLoading = false;
        this.submitted = false;
      },
    });
  }

  Cancel() {
    this.route.navigate(['payment-list']);
  }
}
