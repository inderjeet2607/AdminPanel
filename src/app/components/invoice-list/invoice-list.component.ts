import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { BusinessProfilesService } from '../../services/businessProfile/business-profiles.service';
import { GroupListService } from '../../services/groupList/group-list.service';
import { ClientInvoiceService } from '../../services/clientInvoice/clientInvoice.service';

export interface InvoiceList {
  invoiceNo: string;
  Date: Date;
  packageType: string;
  countLocations: number;
  isActive: boolean;
}

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrl: './invoice-list.component.css',
})
export class InvoiceListComponent {
  firstFormGroup: FormGroup;
  dropdownSettingsSingleGroup: IDropdownSettings = {};
  dropdownSettingsSingleLocation: IDropdownSettings = {};
  submitted = false;
  isLoading = false;
  businessGroupData: any = [];
  businessLocationData: any = [];
  dropDownSelect = false;
  dropDownSelectLocation = false;
  invoicesData: any = [];
  displayedColumns: string[] = [
    'invoiceNo',
    'date',
    'duration',
    'currency',
    'invoice',
  ];

  constructor(
    private route: Router,
    private fb: FormBuilder,
    private _groupService: GroupListService,
    private _businessProfileService: BusinessProfilesService,
    private _clientInvoiceservice: ClientInvoiceService
  ) {
    this.firstFormGroup = this.fb.group({
      businessGroupID: ['', Validators.required],
      businessLocationID: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.getBusinessGroups();
    this.dropdownSettingsSingleGroup = {
      idField: 'id',
      textField: 'businessGroupName',
      singleSelection: true
    };

    this.dropdownSettingsSingleLocation = {
      idField: 'id',
      textField: 'businessName',
      singleSelection: true,
    };
  }

  AddNewInvoice() {
    this.route.navigate(['invoice']);
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

  getBusinessLocationsByGroupID() {
    // if (this.dropDownSelect) {
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
    }
    else {
      this.businessLocationData = [];
    }
    // }
  }

  getInvoiceByBusinessLocationID() {
    // if (this.dropDownSelectLocation) {
    this.invoicesData = [];
    if (this.firstFormGroup.controls['businessLocationID'].value.length != 0) {
      this.isLoading = true;
      let locationID = this.firstFormGroup.controls['businessLocationID'].value[0].id;
      this.GetClientInvoicesByBusinessLocationId(locationID);
    } else {
      this.invoicesData = [];
    }
    // }
  }

  GetClientInvoicesByBusinessLocationId(locationId) {
    this._clientInvoiceservice
      .GetClientInvoicesByBusinessLocationId(locationId)
      .pipe()
      .subscribe({
        next: (data) => {
          this.invoicesData = data;
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
        },
      });
  }
}
