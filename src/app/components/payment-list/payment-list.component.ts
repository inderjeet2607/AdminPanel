import { Component } from '@angular/core';
import { GroupListService } from '../../services/groupList/group-list.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BusinessProfilesService } from '../../services/businessProfile/business-profiles.service';
import { ClientInvoiceService } from '../../services/clientInvoice/clientInvoice.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ClientPaymentsService } from '../../services/clientPayment/clientPayment.service';

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrl: './payment-list.component.css',
})
export class PaymentListComponent {
  firstFormGroup: FormGroup;
  dropdownSettingsSingleGroup: IDropdownSettings = {};
  dropdownSettingsSingleLocation: IDropdownSettings = {};
  submitted = false;
  isLoading = false;
  businessGroupData: any = [];
  businessLocationData: any = [];
  dropDownSelect = false;
  dropDownSelectLocation = false;
  // dataSource: MatTableDataSource<InvoiceList>;
  paymentData: any = [];
  displayedColumns: string[] = ['Date & Time', 'Amount', 'Method'];

  constructor(
    private route: Router,
    private fb: FormBuilder,
    private _groupService: GroupListService,
    private _businessProfileService: BusinessProfilesService,
    private _clientPaymentservice: ClientPaymentsService
  ) {
    this.firstFormGroup = this.fb.group({
      businessGroupID: ['', Validators.required],
      businessLocationID: ['', Validators.required],
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

  AddNewPayment() {
    this.route.navigate(['payment']);
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
      this.paymentData = [];
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

  getPaymentsByBusinessLocationID(event) {
    if (this.dropDownSelectLocation) {
      this.paymentData = [];
      if (
        this.firstFormGroup.controls['businessLocationID'].value.length != 0
      ) {
        this.isLoading = true;
        let locationID =
          this.firstFormGroup.controls['businessLocationID'].value[0].id;
        this.GetClientInvoicesByBusinessLocationId(locationID);
      } else {
        this.businessLocationData = [];
      }
    }
  }

  GetClientInvoicesByBusinessLocationId(locationId) {
    this._clientPaymentservice
      .GetClientPaymentsByBusinessLocationId(locationId)
      .pipe()
      .subscribe({
        next: (data) => {
          this.paymentData = data;
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
        },
      });
  }
}
