import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GroupListService } from '../../services/groupList/group-list.service';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface BusinessGroupList {
  businessGroupName: string;
  industryType: string;
  packageType: string;
  countLocations: number;
  isActive: boolean;
}

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrl: './group-list.component.css'
})

export class GroupListComponent implements OnInit {
  dataSource: MatTableDataSource<BusinessGroupList>;
  displayedColumns: string[] = ['businessGroupName', 'industryType', 'packageTypeName', 'countLocations', 'Edit', 'Enable Group'];
  firstFormGroup: FormGroup;
  submitted = false;
  isLoading = false;
  businessGroupID: number = 0;
  filteredata: any = [];
  @ViewChild('closeModal') closeModal: ElementRef;

  constructor(private route: Router, private _groupService: GroupListService, private fb: FormBuilder) {
    this.firstFormGroup = this.fb.group({
      SMSProfileID: ['', Validators.required],
      SMSPhoneNumber: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.getBusinessGroups();
  }

  getBusinessGroups() {
    this.submitted = false;
    this._groupService.GetBusinessGroups().subscribe({
      next: (data) => {
        this.dataSource = data;
        this.filteredata = data;
      },
      error: error => {

      }
    })
  }

  Edit(element: any) {
    this.route.navigate(['home', { id: element.id }]);
  }

  AddNewPage() {
    this.route.navigate(['home', { id: "New" }]);
  }

  Cancel() {
    this.route.navigate(['group-list']);
  }

  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  toggleBusinessGroup(element) {
    this.businessGroupID = element.id;
  }

  Submit() {
    this.submitted = true;
    if (this.firstFormGroup.invalid) {
      return;
    }
    this.isLoading = true;
    let model = this.createBusinessGroupModel();
    this._groupService.EnableDisableBusinessGroupForAdminPanel(model.id, model)
      .subscribe({
        next: (data) => {
          this.closeModal.nativeElement.click();
          this.getBusinessGroups();
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

  createBusinessGroupModel() {
    let details = {
      "id": this.businessGroupID,
      "smsProfileID": this.firstFormGroup.controls['SMSProfileID'].value,
      "smsFromNumber": this.firstFormGroup.controls['SMSPhoneNumber'].value,
      "isActive": true
    }

    return details;
  }

  applyFilters(event: any) {
    const searchInput = event.target.value.toLowerCase();
    this.dataSource = this.filteredata.filter((item: any) => {
      return item.businessGroupName.toLowerCase().includes(searchInput)
    });
  }
}
