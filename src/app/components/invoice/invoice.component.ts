import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { GroupListService } from '../../services/groupList/group-list.service';
import { BusinessProfilesService } from '../../services/businessProfile/business-profiles.service';
import { AppSettings } from '../../services/Constants';
import { HttpEventType } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { UploadServiceService } from '../../services/upload/upload-service.service';
import { ClientInvoiceService } from '../../services/clientInvoice/clientInvoice.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css',
})
export class InvoiceComponent {
  dropdownSettingsSingleGroup: IDropdownSettings = {};
  dropdownSettingsSingleLocation: IDropdownSettings = {};
  firstFormGroup: FormGroup;
  businessGroupData: any = [];
  businessLocationData: any = [];
  submitted = false;
  isLoading = false;
  dropDownSelect = false;
  fileinvoicepdf: File;
  uploadProgressfileinvoicepdf: any;
  loadingGroupLogo: boolean = false;
  uploadfileinvoicepdf: Subscription;
  isfileUploadedinvoicepdf = false;
  anninvoicepdf: any;
  fileNameinvoicepdf: any = null;
  filePathinvoicepdf: any = null;
  userData: any = JSON.parse(localStorage.getItem('UserData'));

  constructor(
    private fb: FormBuilder,
    private _groupService: GroupListService,
    private _businessProfileService: BusinessProfilesService,
    private _uploadService: UploadServiceService,
    private _clientInvoice: ClientInvoiceService,
    private toast: ToastrService,
    private route: Router
  ) {
    this.firstFormGroup = this.fb.group({
      invoiceNo: ['', Validators.required],
      businessGroupID: ['', Validators.required],
      businessLocationID: ['', Validators.required],
      invoiceDate: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      amount: ['', Validators.required],
      invoicepdf: ['', Validators.required],
    });
  }

  ngOnInit() {
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
    this.fileinvoicepdf = event.target.files[0];

    if (this.fileinvoicepdf) {
      if (this.fileinvoicepdf.type === 'application/pdf') {
        this.uploadfileinvoicepdf = this._uploadService
          .uploadBusinessImage(this.fileinvoicepdf)
          .subscribe((event: any) => {
            if (event.type == HttpEventType.UploadProgress) {
              this.uploadProgressfileinvoicepdf =
                Math.round(100 * (event.loaded / event.total)).toString() + '%';
            }
            if (
              event.partialText != undefined &&
              event.partialText.split('|')[0] == 'file uploaded'
            ) {
              this.isfileUploadedinvoicepdf = true;
              this.anninvoicepdf =
                AppSettings.API_ENDPOINT +
                AppSettings.Root_ENDPOINT +
                '/' +
                this.fileinvoicepdf.name;
              let array = event.partialText.split('|')[1].split('\\');
              this.fileNameinvoicepdf = array[array.length - 1];
              this.filePathinvoicepdf =
                AppSettings.API_ENDPOINT +
                AppSettings.Root_ENDPOINT +
                '/' +
                this.fileNameinvoicepdf;
              this.firstFormGroup.controls['invoicepdf'].setValue(
                this.fileNameinvoicepdf
              );
            } else {
              this.isfileUploadedinvoicepdf = false;
            }
          });
      } else {
        this.toast.warning('Select PDF File!', '', {
          positionClass: 'toast-bottom-right',
        });
      }
    }
    event.target.value = '';
  }

  cancelUpload() {
    if (this.uploadfileinvoicepdf != null) {
      this.uploadfileinvoicepdf.unsubscribe();
    }
    this.uploadProgressfileinvoicepdf = '0%';
    this.isfileUploadedinvoicepdf = false;
    this.reset();
  }

  reset() {
    this.fileinvoicepdf = null;
    this.fileNameinvoicepdf = null;
    this.filePathinvoicepdf = null;
    this.uploadProgressfileinvoicepdf = null;
    this.uploadfileinvoicepdf = null;
    this.firstFormGroup.controls['invoicepdf'].setValue('');
  }

  SaveInvoice() {
    this.submitted = true;
    if (this.firstFormGroup.invalid) {
      return;
    }
    this.isLoading = true;
    let invoice = {
      uniqueId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      id: 0,
      userId: this.userData.userId,
      invoiceNo: this.firstFormGroup.controls['invoiceNo'].value,
      invoiceDate: this.firstFormGroup.controls['invoiceDate'].value,
      fromPeriod: this.firstFormGroup.controls['startDate'].value,
      toPeriod: this.firstFormGroup.controls['endDate'].value,
      billingAmount: this.firstFormGroup.controls['amount'].value,
      stateId: 3,
      isActive: true,
      createdBy: AppSettings.GetCreatedBy(),
      createdDate: AppSettings.GetDate(),
      lastModifiedBy: AppSettings.GetLastModifiedBy(),
      lastModifiedDate: AppSettings.GetDate(),
      invoiceFilePath: this.fileNameinvoicepdf,
      businessLocationId:
        this.firstFormGroup.controls['businessLocationID'].value[0].id,
      businessGroupId:
        this.firstFormGroup.controls['businessGroupID'].value[0].id,
    };

    this._clientInvoice.PostClientInvoice(invoice).subscribe({
      next: (data) => {
        this.submitted = false;
        this.fileinvoicepdf = null;
        this.fileNameinvoicepdf = null;
        this.filePathinvoicepdf = null;
        this.uploadProgressfileinvoicepdf = null;
        this.uploadfileinvoicepdf = null;
        this.dropDownSelect = false;
        this.firstFormGroup.reset();
        this.toast.success('Invoice Created Successfully!', '', {
          positionClass: 'toast-bottom-right',
        });
        this.isLoading = false;
        this.route.navigate(['invoice-list']);
      },
      error: (error) => {
        this.isLoading = false;
        this.submitted = false;
      },
    });
  }

  Cancel() {
    this.route.navigate(['invoice-list']);
  }
}
