import { HttpEventType } from '@angular/common/http';
import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { MatTableDataSource } from '@angular/material/table';
import { BusinessLabelService } from '../../services/businessLabel/business-label.service';
import { ToastrService } from 'ngx-toastr';
import { PaymentInfoService } from '../../services/paymentInfo/payment-info.service';
import { SourceService } from '../../services/source/source.service';
import { StripeCardComponent, StripeService } from 'ngx-stripe';
import { StripeCardElementOptions, StripeElementsOptions, } from '@stripe/stripe-js';
import { PaymentDocsService } from '../../services/paymentDocs/payment-docs.service';
import { GoogleMapsService } from '../../services/googleMaps/google-maps.service';

export interface BusinessLocationList {
  legalName: string;
  businessName: string;
  industry: string;
  city: string;
  pinCode: string;
}

export interface PaymentInfoList {
  businessLocationName: string;
  paymentType: string;
  cardOrAccNumber: string;
  isDefault: string;
}

export interface SourcesList {
  sourceName: string;
  businessLocationName: string;
}

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
  paymentDocFromGroup: FormGroup;
  // paymentDocs: FormArray;
  businessGroupID: any;
  submitted = false;
  secondStepSubmitted = false;
  thirdStepSubmitted = false;
  fourthStepSubmitted = false;
  //#region Group Logo variables
  fileGroupLogo: File;
  uploadProgressGroupLogo: any;
  loadingGroupLogo: boolean = false;
  uploadSubGroupLogo: Subscription;
  isfileUploadedGroupLogo = false;
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
  dropdownSettingsPaymentDocs: IDropdownSettings = {};
  //#region Business Logo variables
  fileBusinessLogo: File;
  uploadProgressBusinessLogo: any;
  loadingBusinessLogo: boolean = false;
  uploadSubBusinessLogo: Subscription;
  isfileUploadedBusinessLogo = false;
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
  fileNameBusinessImage1: any = null;
  filePathBusinessImage1: any = null;
  //#endregion
  //#region Business Image 2
  fileBusinessImage2: File;
  uploadProgressBusinessImage2: any;
  loadingBusinessImage2: boolean = false;
  uploadSubBusinessImage2: Subscription;
  isfileUploadedBusinessImage2 = false;
  fileNameBusinessImage2: any = null;
  filePathBusinessImage2: any = null;
  //#endregion
  //#region Business Image 3
  fileBusinessImage3: File;
  uploadProgressBusinessImage3: any;
  loadingBusinessImage3: boolean = false;
  uploadSubBusinessImage3: Subscription;
  isfileUploadedBusinessImage3 = false;
  fileNameBusinessImage3: any = null;
  filePathBusinessImage3: any = null;
  //#endregion
  //#region Business Image 4
  fileBusinessImage4: File;
  uploadProgressBusinessImage4: any;
  loadingBusinessImage4: boolean = false;
  uploadSubBusinessImage4: Subscription;
  isfileUploadedBusinessImage4 = false;
  fileNameBusinessImage4: any = null;
  filePathBusinessImage4: any = null;
  //#endregion
  dataSourceBusinessLocation: MatTableDataSource<BusinessLocationList>;
  businessLocationDisplayedColumns: string[] = ['legalName', 'businessName', 'industry', 'city', 'pinCode', 'Action', "Enable Business"];
  showLocationList: Boolean = true;
  selectedBusinessLabels: { id: number, name: string }[] = [];
  filteredBusinessLabels: any = [];
  businessLabels: any = [];
  dataSourcePaymentInfo: MatTableDataSource<PaymentInfoList>;
  paymentInfoDisplayedColumns: string[] = ['businessLocationName', 'paymentType', 'cardOrAccNumber', 'isDefault', 'Action'];
  showPaymentList: Boolean = true;
  paymentInfoes: any = [];
  paymentInfoID: number = 0;
  businessLocationID: number = 0;
  sourceID: number = 0;
  indexID: any = '';
  sourcesData: any = [];
  dataSourceSources: MatTableDataSource<SourcesList>;
  sourcesDisplayedColumns: string[] = ['sourceName', 'businessLocationName', 'Action'];
  showSourceList: Boolean = true;
  businessGroupSaveBtn: any = 'Save & Continue';
  businessLocationSaveBtn: any = 'Save & Continue';
  paymentInfoSaveBtn: any = 'Save & Continue';
  sourceSaveBtn: any = 'Review & Save';
  latitude: any = '';
  longitude: any = '';
  industry: any = '';
  customerUserName: any = '';
  storeUserName: any = '';
  customerSourceName: any = '';
  storeSourceName: any = '';
  isSourceLocationDisabled: boolean = false;
  cardNumber: any = '';
  ChkMakeDefaultTime = false;
  isPaymentLocationDisabled: boolean = false;
  stripeCustomerID: any = '';
  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: '300',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#212529'
        }
      },
    },
    disableLink: true
  };
  elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };
  @ViewChild(StripeCardComponent) card: StripeCardComponent;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('search') searchElementRef: ElementRef;
  filteredataForLocations: any = [];
  filterDataForPaymentInfo: any = [];
  filterDataForSources: any = [];
  paymentMethodID: any = '';
  expiryMonth: any = 0;
  expiryYear: any = 0;
  zipCode: string = '';
  showNgxCard: boolean = true;
  docTypeList: any = [];
  docList: any = [];
  selectedBusiness: any = [];
  //#region PaymentDoc
  filePaymentDoc: File;
  loadingPaymentDoc: boolean = false;
  uploadSubPaymentDoc: Subscription;
  isfileUploadedPaymentDoc = false;
  //#endregion

  constructor(private aroute: ActivatedRoute, private route: Router, private fb: FormBuilder, private _uploadService: UploadServiceService,
    private _industryService: IndustryService, private _packageService: PackageTypeService, private _groupService: GroupListService,
    private _stateService: StateService, private _businessProfileService: BusinessProfilesService, private toast: ToastrService,
    private _businessLabelService: BusinessLabelService, private _paymentInfoService: PaymentInfoService,
    private _sourceService: SourceService, private stripeService: StripeService, private _paymentDocService: PaymentDocsService,
    private ngZone: NgZone, private googleMapsService: GoogleMapsService) {

    this.paymentInfoID = 0;
    this.businessLocationID = 0;
    this.sourceID = 0;
    this.stripeCustomerID = '';
    this.showNgxCard = false;
    this.paymentMethodID = '';
    this.expiryMonth = 0;
    this.expiryYear = 0;
    this.cardNumber = 0;
    this.zipCode = '';
    this.selectedBusiness = [];
    this.indexID = '';
    this.customerSourceName = '';
    this.storeSourceName = '';
    this.customerUserName = '';
    this.storeUserName = '';

    this.firstFormGroup = this.fb.group({
      BusinessgroupName: ['', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      IndustryTypeID: ['', Validators.required],
      PackageTypeID: ['', Validators.required],
      SMSProfileID: [''],
      SMSPhoneNumber: [''],
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
      City: ['', Validators.required],
      StateID: ['', Validators.required],
      Pincode: ['', Validators.required],
      BusinessLabelID: [''],
      Description: [''],
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
      BusinessLocationName: ['', Validators.required],
      ChkMakeDefault: [''],
      CardHolderName: [''],
      selectedOption: ['', Validators.required],
      GoLiveDate: ['', Validators.required],
      paymentSchedule: ['', Validators.required],
      paymentAmountMonthly: [0],
      paymentAmountYearly: [0]
    });
    this.paymentDocFromGroup = this.fb.group({
      paymentDocs: this.fb.array([])
    })
    this.fourthFormGroup = this.fb.group({
      SrcBusinessLocationName: ['', Validators.required],
      CustTabletBrand: ['', Validators.required],
      CustTabletModel: ['', Validators.required],
      StoreTabletBrand: ['', Validators.required],
      StoreTabletModel: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.aroute.params.subscribe((params: Params) => {
      this.businessGroupID = params['id']
    });
    this.getIndustries();
    this.getPackageTypes();
    this.getStates();
    this.GetBusinessLabels();
    this.getPaymentDocTypes();

    if (this.businessGroupID != null && this.businessGroupID != '' && this.businessGroupID != undefined && this.businessGroupID != 'New') {
      this.businessGroupSaveBtn = 'Update & Continue';
      this.getBusinessGroupByID(this.businessGroupID);
      this.getBusinessLocationsByGroupID();
      this.getPaymentInfoesByGroupID();
      this.getSourcesByGroupID();
    }
    else {
      this.businessGroupSaveBtn = 'Save & Continue';
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

    this.dropdownSettingsPaymentDocs = {
      idField: 'id',
      textField: 'name',
      singleSelection: true
    }
  }

  getIndustries() {
    this._industryService.GetIndustries().subscribe({
      next: (data: any) => {
        this.industryTypeData = data;
      },
      error: (error: any) => {
        console.log("This is error message", error)
      }
    })
  }

  getStates() {
    this._stateService.GetStates().subscribe({
      next: (data: any) => {
        this.statesData = data;
      },
      error: (error: any) => {
        console.log("This is error message", error)
      }
    })
  }

  getPackageTypes() {
    this._packageService.GetPackageTypes().subscribe({
      next: (data: any) => {
        this.packageTypeData = data;
      },
      error: (error: any) => {
        console.log("This is error message", error)
      }
    })
  }

  getBusinessLocationsByGroupID() {
    this._businessProfileService.GetBusinessLocationByGroupId(this.businessGroupID).subscribe({
      next: (data: any) => {
        this.businessLocationName = data;
        this.dataSourceBusinessLocation = this.businessLocationName;
        this.filteredataForLocations = data;
      },
      error: (error: any) => {
        console.log("This is error message", error)
      }
    })
  }

  getPaymentInfoesByGroupID() {
    this._paymentInfoService.GetPaymentInfoesByBusinessGroupID(this.businessGroupID).subscribe({
      next: (data: any) => {
        this.paymentInfoes = data;
        this.dataSourcePaymentInfo = this.paymentInfoes;
        this.filterDataForPaymentInfo = data;
      },
      error: (error: any) => {
        console.log("This is error message", error)
      }
    })
  }

  GetBusinessLabels() {
    this._businessLabelService.GetBusinessLabels().subscribe({
      next: (data) => {
        this.businessLabels = data;
        this.filteredBusinessLabels = this.businessLabels;
      },
      error: error => {
        console.log("This is error message", error)
      }
    })
  }

  getSourcesByGroupID() {
    this._sourceService.GetSourcesByBusinessGroupID(this.businessGroupID).subscribe({
      next: (data) => {
        this.sourcesData = data;
        this.dataSourceSources = this.sourcesData;
        this.filterDataForSources = data;
      },
      error: error => {
        console.log("This is error message", error)
      }
    })
  }

  getPaymentDocsByLocationID(id) {
    while (this.paymentDocs.length !== 0) {
      this.paymentDocs.removeAt(0)
    }

    this._paymentDocService.GetLocationDocsByPaymentID(id).subscribe({
      next: (data) => {
        this.docList = data;
        this.docList.forEach(element => {
          this.paymentDocs.push(this.fb.group({
            id: element.id,
            type: [this.docTypeList.filter(x => x.id == element.documentType), Validators.required],
            fileName: [element.documentPath, Validators.required],
            uploadProgressPaymentDoc: [(element.documentPath != '' && element.documentPath != null && element.documentPath != undefined) ?
              ((100).toString() + "%") : null],
            filePathPaymentDoc: [(element.documentPath != '' && element.documentPath != null && element.documentPath != undefined) ?
              (AppSettings.API_ENDPOINT + AppSettings.Root_ENDPOINT + "/" + element.documentPath) : null],
            paymentDocSubmitted: [false]
          }));
        });
      },
      error: error => {
        console.log("This is error message", error)
      }
    })
  }

  getPaymentDocTypes() {
    this.docTypeList.push({
      id: 1,
      name: 'Cancelled Cheque'
    }, {
      id: 2,
      name: 'ID Proof'
    });
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
    this.isfileUploadedBusinessLogo = false;
    this.fileNameBusinessLogo = null;
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
    this.isfileUploadedBusinessDisplayImage = false;
    this.fileNameBusinessDisplayImage = null;
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
    this.isfileUploadedBusinessImage1 = false;
    this.fileNameBusinessImage1 = null;
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
    this.isfileUploadedBusinessImage2 = false;
    this.fileNameBusinessImage2 = null;
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
    this.isfileUploadedBusinessImage3 = false;
    this.fileNameBusinessImage3 = null;
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
    this.isfileUploadedBusinessImage4 = false;
    this.fileNameBusinessImage4 = null;
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
    this.paymentInfoID = 0;
    this.businessLocationID = 0;
    this.sourceID = 0;
    this.customerSourceName = '';
    this.storeSourceName = '';
    this.customerUserName = '';
    this.storeUserName = '';
    this.stripeCustomerID = '';
    this.businessGroupSaveBtn = 'Save & Continue';
    this.businessLocationSaveBtn = 'Save & Continue';
    this.paymentInfoSaveBtn = 'Save & Continue';
    this.sourceSaveBtn = 'Review & Save';
    this.paymentMethodID = '';
    this.expiryMonth = 0;
    this.expiryYear = 0;
    this.zipCode = '';
    this.showNgxCard = true;
    this.cardNumber = 0;
    this.selectedBusiness = [];
    this.thirdFormGroup.controls['ChkMakeDefault'].enable();
    this.indexID = '';
  }

  SaveGroupDetails() {
    this.submitted = true;
    if (this.firstFormGroup.invalid) {
      return;
    }
    this.isLoading = true;
    let model = this.createBusinessGroupModel();
    if (this.businessGroupID == 'New') {
      this._groupService.PostBusinessGroupForAdminPanel(model)
        .subscribe({
          next: (data) => {
            this.businessGroupID = data.id;
            this.businessGroupSaveBtn = 'Update & Continue';
            this.isLoading = false;
            this.submitted = false;
            this.stepper.next();
          },
          error: error => {
            console.log(error);
            this.isLoading = false;
            this.submitted = false;
          }
        });
    }
    else {
      model.id = this.businessGroupID;
      this._groupService.PutBusinessGroupForAdminPanel(model.id, model)
        .subscribe({
          next: (data) => {
            this.isLoading = false;
            this.submitted = false;
            this.stepper.next();
          },
          error: error => {
            console.log(error);
            this.isLoading = false;
            this.submitted = false;
          }
        });
    }
  }

  getBusinessGroupByID(id) {
    this._groupService.GetBusinessGroupByID(id).subscribe({
      next: (data: any) => {
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
        this.firstFormGroup.controls['SMSPhoneNumber'].setValue(data.smsFromNumber == 0 ? "" : data.smsFromNumber);
        this.firstFormGroup.controls['SignoutRequired'].setValue(data.isSignOutRequired);
        this.firstFormGroup.controls['SignoutHours'].setValue(data.autoSignOutTime);
        this.firstFormGroup.controls['SpinWheelRequired'].setValue(data.isSpinRequired);

        let time = (new Date(data.businessClosureTime).getHours() < 10 ? ("0" + new Date(data.businessClosureTime).getHours()) :
          new Date(data.businessClosureTime).getHours()) + ':' +
          (new Date(data.businessClosureTime).getMinutes() < 10 ? ("0" + new Date(data.businessClosureTime).getMinutes()) :
            new Date(data.businessClosureTime).getMinutes());
        this.firstFormGroup.controls['BusinessClosureTime'].setValue(time);

        this.firstFormGroup.controls['FirstName'].setValue(data.firstName);
        this.firstFormGroup.controls['LastName'].setValue(data.lastName);
        this.firstFormGroup.controls['PhoneNumber'].setValue(data.mobile);
        this.firstFormGroup.controls['EmailID'].setValue(data.email);
        this.isEmailVerified = data.isEmailVerified;
        this.verificationText = data.isEmailVerified == true ? 'Verified' :
          (data.isEmailVerified == false ? 'Unverified' : '');

        if (data.logoPath != '' && data.logoPath != null && data.logoPath != undefined) {
          this.filePathGroupLogo = AppSettings.API_ENDPOINT + AppSettings.Root_ENDPOINT + "/" + data.logoPath;
          this.uploadProgressGroupLogo = (100).toString() + "%";
          this.fileNameGroupLogo = data.logoPath;
        }
        else {
          this.cancelUpload();
        }
      },
      error: (error: any) => {
        console.log("This is error message", error)
      }
    })
  }

  createBusinessGroupModel() {
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
      "smsFromNumber": this.firstFormGroup.controls['SMSPhoneNumber'].value == "" ? 0 : this.firstFormGroup.controls['SMSPhoneNumber'].value,
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

  createBusinessLocationModel() {
    let details = {
      "uniqueId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "id": 0,
      "businessName": this.secondFormGroup.controls['BusinessShortName'].value,
      "legalName": this.secondFormGroup.controls['BusinessLocationName'].value,
      "adress": this.secondFormGroup.controls['Address'].value,
      "phoneNo": this.secondFormGroup.controls['PhoneNo'].value,
      "pinCode": this.secondFormGroup.controls['Pincode'].value,
      "industry": this.industry,
      "descriptions": this.secondFormGroup.controls['Description'].value,
      "logoPath": this.fileNameBusinessLogo,
      "imagePath": this.fileNameBusinessDisplayImage,
      "website": this.secondFormGroup.controls['WebsiteUrl'].value,
      "facebookUrl": this.secondFormGroup.controls['FacebookUrl'].value,
      "twitterUrl": this.secondFormGroup.controls['TwitterUrl'].value,
      "googleUrl": this.secondFormGroup.controls['GoogleUrl'].value,
      "instagramUrl": this.secondFormGroup.controls['InstagramUrl'].value,
      "yelpUrl": this.secondFormGroup.controls['YelpUrl'].value,
      "stateId": 3,
      "isActive": false,
      "createdBy": AppSettings.GetCreatedBy(),
      "createdDate": AppSettings.GetDate(),
      "lastModifiedBy": AppSettings.GetLastModifiedBy(),
      "lastModifiedDate": AppSettings.GetDate(),
      "latitude": this.latitude,
      "longitude": this.longitude,
      "stateCodeId": this.secondFormGroup.controls['StateID'].value[0].id,
      "city": this.secondFormGroup.controls['City'].value,
      "businessGroupId": this.businessGroupID,
      "metaData": "",
      "galleryImagePath1": this.fileNameBusinessImage1,
      "galleryImagePath2": this.fileNameBusinessImage2,
      "galleryImagePath3": this.fileNameBusinessImage3,
      "galleryImagePath4": this.fileNameBusinessImage4,
      "isAgeRestriction": false,
      "customerID": this.stripeCustomerID,
      "businesswiseLabels": this.GetBusinessLabelModel(),
      "businesswiseWorkingDays": this.GetBusinessWorkingHoursModel()
    }

    return details;
  }

  GetBusinessLabelModel() {
    let details = [];
    this.selectedBusinessLabels.forEach((element: any) => {
      let tempdefDetails = {
        "uniqueId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "id": 0,
        "labelId": element.id,
        "businessId": this.businessLocationID,
        "isActive": true,
        "createdBy": AppSettings.GetCreatedBy(),
        "createdDate": AppSettings.GetDate(),
        "lastModifiedBy": AppSettings.GetLastModifiedBy(),
        "lastModifiedDate": AppSettings.GetDate(),
      }
      details.push(tempdefDetails);
    });

    return details;
  }

  GetBusinessWorkingHoursModel() {
    let details = [];
    let tempdefDetails = {
      "uniqueId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "id": 0,
      "businessId": this.businessLocationID,
      "isActive": true,
      "createdBy": AppSettings.GetCreatedBy(),
      "createdDate": AppSettings.GetDate(),
      "lastModifiedBy": AppSettings.GetLastModifiedBy(),
      "lastModifiedDate": AppSettings.GetDate(),
      "monFromTime": this.secondFormGroup.controls['MonFromTime'].value,
      "monToTime": this.secondFormGroup.controls['MonToTime'].value,
      "tueFromTime": this.secondFormGroup.controls['TueFromTime'].value,
      "tueToTime": this.secondFormGroup.controls['TueToTime'].value,
      "wedFromTime": this.secondFormGroup.controls['WedFromTime'].value,
      "wedToTime": this.secondFormGroup.controls['WedToTime'].value,
      "thuFromTime": this.secondFormGroup.controls['ThuFromTime'].value,
      "thuToTime": this.secondFormGroup.controls['ThuToTime'].value,
      "friFromTime": this.secondFormGroup.controls['FriFromTime'].value,
      "friToTime": this.secondFormGroup.controls['FriToTime'].value,
      "satFromTime": this.secondFormGroup.controls['SatFromTime'].value,
      "satToTime": this.secondFormGroup.controls['SatToTime'].value,
      "sunFromTime": this.secondFormGroup.controls['SunFromTime'].value,
      "sunToTime": this.secondFormGroup.controls['SunToTime'].value,
    }
    details.push(tempdefDetails);

    return details;
  }

  createPaymentInfoModel() {
    let details = {
      "uniqueId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "id": 0,
      "name": "",
      "cardNumber": this.cardNumber,
      "expireMonth": this.expiryMonth,
      "expireYear": this.expiryYear,
      "cvv": 0,
      "zipCode": this.zipCode,
      "stateId": 3,
      "isActive": true,
      "createdBy": AppSettings.GetCreatedBy(),
      "createdDate": AppSettings.GetDate(),
      "lastModifiedBy": AppSettings.GetLastModifiedBy(),
      "lastModifiedDate": AppSettings.GetDate(),
      "businessGroupId": this.businessGroupID,
      "businessLocationId": this.thirdFormGroup.controls['BusinessLocationName'].value[0].id,
      "isDefault": this.thirdFormGroup.controls['ChkMakeDefault'].value == null ||
        this.thirdFormGroup.controls['ChkMakeDefault'].value == undefined || this.thirdFormGroup.controls['ChkMakeDefault'].value == '' ? false
        : this.thirdFormGroup.controls['ChkMakeDefault'].value,
      "paymentType": this.thirdFormGroup.controls['selectedOption'].value,
      "paymentScheduleID": this.thirdFormGroup.controls['paymentSchedule'].value,
      "packageMonthlyAmount": this.thirdFormGroup.controls['paymentAmountMonthly'].value,
      "packageYearlyAmount": this.thirdFormGroup.controls['paymentAmountYearly'].value,
      "goLiveDate": this.thirdFormGroup.controls['GoLiveDate'].value,
      "accountNumber": '',
      "routingName": '',
      "cardHolderName": this.thirdFormGroup.controls['CardHolderName'].value,
      "paymentMethodID": this.paymentMethodID
    }

    return details;
  }

  createSourceModel() {
    let details = {
      "uniqueId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "id": 0,
      "sourceName": this.customerSourceName,
      "isActive": true,
      "createdBy": AppSettings.GetCreatedBy(),
      "createdDate": AppSettings.GetDate(),
      "lastModifiedBy": AppSettings.GetLastModifiedBy(),
      "lastModifiedDate": AppSettings.GetDate(),
      "businessLocationID": this.fourthFormGroup.controls['SrcBusinessLocationName'].value[0].id,
      "businessLocationName": this.fourthFormGroup.controls['SrcBusinessLocationName'].value[0].businessName,
      "businessGroupID": this.businessGroupID,
      "businessGroupName": "",
      "custTabletBrand": this.fourthFormGroup.controls['CustTabletBrand'].value,
      "custTabletModel": this.fourthFormGroup.controls['CustTabletModel'].value,
      "storeTabletBrand": this.fourthFormGroup.controls['StoreTabletBrand'].value,
      "storeTabletModel": this.fourthFormGroup.controls['StoreTabletModel'].value,
      "customerTabUserName": this.customerUserName,
      "storeTabUserName": this.storeUserName,
      "storeSourceName": this.storeSourceName,
      "pairedID": 0
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
    this.thirdStepSubmitted = true;
    this.isLoading = true;

    if (this.thirdFormGroup.invalid) {
      this.isLoading = false;
      return;
    }
    let paymentType = this.thirdFormGroup.controls['selectedOption'].value;
    if (this.paymentInfoID == 0) {
      if (paymentType == 1 || paymentType == 2) {
        this.stripeService.createPaymentMethod({ type: "card", card: this.card.element }).subscribe(({ error, paymentMethod }) => {
          if (error) {
            this.isLoading = false;
            console.log(error.message);
          }
          else {
            console.log(paymentMethod.id)
            this.paymentMethodID = paymentMethod.id;
            this.expiryMonth = paymentMethod.card.exp_month;
            this.expiryYear = paymentMethod.card.exp_year;
            this.zipCode = paymentMethod.billing_details.address.postal_code;
            this.cardNumber = paymentMethod.card.last4;

            let model = this.createPaymentInfoModel();
            this._paymentInfoService.PostPaymentInfo(model)
              .subscribe({
                next: (data) => {
                  this.paymentInfoID = data.id;
                  this.paymentInfoSaveBtn = 'Update & Continue';
                  this.isLoading = false;
                  this.thirdStepSubmitted = false;
                  this.stepper.next();
                },
                error: error => {
                  console.log(error);
                  this.isLoading = false;
                  this.thirdStepSubmitted = false;
                }
              });
          }
        });
      }
      else {
        let model = this.createPaymentInfoModel();
        this._paymentInfoService.PostPaymentInfo(model)
          .subscribe({
            next: (data) => {
              this.paymentInfoID = data.id;
              this.paymentInfoSaveBtn = 'Update & Continue';
              this.isLoading = false;
              this.thirdStepSubmitted = false;
              this.stepper.next();
            },
            error: error => {
              console.log(error);
              this.isLoading = false;
              this.thirdStepSubmitted = false;
            }
          });
      }
    }
    else {
      let model = this.createPaymentInfoModel();
      model.id = this.paymentInfoID;
      this._paymentInfoService.PutPaymentInfo(model.id, model)
        .subscribe({
          next: (data) => {
            this.isLoading = false;
            this.thirdStepSubmitted = false;
            this.stepper.next();
          },
          error: error => {
            console.log(error);
            this.isLoading = false;
            this.thirdStepSubmitted = false;
          }
        });
    }
  }

  SaveSource() {
    this.fourthStepSubmitted = true;
    if (this.fourthFormGroup.invalid) {
      return;
    }
    this.isLoading = true;
    let model = this.createSourceModel();
    if (this.sourceID == 0) {
      this._sourceService.PostSourcesForAdminPanel(model)
        .subscribe({
          next: (data) => {
            this.sourceID = data.id;
            this.sourceSaveBtn = 'Update & Continue';
            this.isLoading = false;
            this.fourthStepSubmitted = false;
            this.stepper.next();
          },
          error: error => {
            console.log(error);
            this.isLoading = false;
            this.fourthStepSubmitted = false;
          }
        });
    }
    else {
      model.id = this.sourceID;
      this._sourceService.PutSourcesForAdminPanel(model.id, model)
        .subscribe({
          next: (data) => {
            this.isLoading = false;
            this.fourthStepSubmitted = false;
            this.stepper.next();
          },
          error: error => {
            console.log(error);
            this.isLoading = false;
            this.fourthStepSubmitted = false;
          }
        });
    }
  }

  AddNewLocation() {
    this.businessLocationID = 0;
    this.showLocationList = false;
  }

  EditBusinessLocation(e) {
    this._businessProfileService.GetBusinessLocationById(e.id).subscribe({
      next: (data: any) => {
        this.businessLocationID = e.id;
        this.latitude = data.latitude;
        this.longitude = data.longitude;
        this.industry = data.industry;
        this.stripeCustomerID = data.customerID;

        this.secondFormGroup.controls['BusinessLocationName'].setValue(data.legalName);
        this.secondFormGroup.controls['BusinessShortName'].setValue(data.businessName);
        this.secondFormGroup.controls['PhoneNo'].setValue(data.phoneNo);
        this.secondFormGroup.controls['Address'].setValue(data.adress);
        this.secondFormGroup.controls['City'].setValue(data.city);
        let selectedState: { id: any, name: any }[] = [];
        selectedState.push({
          id: data.stateCodeID,
          name: this.statesData.filter(x => x.id == data.stateCodeID)[0].name
        });
        this.secondFormGroup.controls['StateID'].setValue(selectedState);

        this.secondFormGroup.controls['Pincode'].setValue(data.pinCode);
        this.secondFormGroup.controls['Description'].setValue(data.descriptions);
        this.secondFormGroup.controls['WebsiteUrl'].setValue(data.website);
        this.secondFormGroup.controls['FacebookUrl'].setValue(data.facebookUrl);
        this.secondFormGroup.controls['TwitterUrl'].setValue(data.twitterUrl);
        this.secondFormGroup.controls['GoogleUrl'].setValue(data.googleUrl);
        this.secondFormGroup.controls['InstagramUrl'].setValue(data.instagramUrl);
        this.secondFormGroup.controls['YelpUrl'].setValue(data.yelpUrl);

        let monFrom = ((new Date(data.businesswiseWorkingDays[0].monFromTime).getHours() < 10 ? '0' : '') +
          (new Date(data.businesswiseWorkingDays[0].monFromTime).getHours())) + ':' +
          ((new Date(data.businesswiseWorkingDays[0].monFromTime).getMinutes() < 10 ? '0' : '') +
            (new Date(data.businesswiseWorkingDays[0].monFromTime).getMinutes()));
        this.secondFormGroup.controls['MonFromTime'].setValue(monFrom);

        let monTo = ((new Date(data.businesswiseWorkingDays[0].monToTime).getHours() < 10 ? '0' : '') +
          (new Date(data.businesswiseWorkingDays[0].monToTime).getHours())) + ':' +
          ((new Date(data.businesswiseWorkingDays[0].monToTime).getMinutes() < 10 ? '0' : '') +
            (new Date(data.businesswiseWorkingDays[0].monToTime).getMinutes()));
        this.secondFormGroup.controls['MonToTime'].setValue(monTo);

        let tueFrom = ((new Date(data.businesswiseWorkingDays[0].tueFromTime).getHours() < 10 ? '0' : '') +
          (new Date(data.businesswiseWorkingDays[0].tueFromTime).getHours())) + ':' +
          ((new Date(data.businesswiseWorkingDays[0].tueFromTime).getMinutes() < 10 ? '0' : '') +
            (new Date(data.businesswiseWorkingDays[0].tueFromTime).getMinutes()));
        this.secondFormGroup.controls['TueFromTime'].setValue(tueFrom);

        let tueTo = ((new Date(data.businesswiseWorkingDays[0].tueToTime).getHours() < 10 ? '0' : '') +
          (new Date(data.businesswiseWorkingDays[0].tueToTime).getHours())) + ':' +
          ((new Date(data.businesswiseWorkingDays[0].tueToTime).getMinutes() < 10 ? '0' : '') +
            (new Date(data.businesswiseWorkingDays[0].tueToTime).getMinutes()));
        this.secondFormGroup.controls['TueToTime'].setValue(tueTo);

        let wedFrom = ((new Date(data.businesswiseWorkingDays[0].wedFromTime).getHours() < 10 ? '0' : '') +
          (new Date(data.businesswiseWorkingDays[0].wedFromTime).getHours())) + ':' +
          ((new Date(data.businesswiseWorkingDays[0].wedFromTime).getMinutes() < 10 ? '0' : '') +
            (new Date(data.businesswiseWorkingDays[0].wedFromTime).getMinutes()));
        this.secondFormGroup.controls['WedFromTime'].setValue(wedFrom);

        let wedTo = ((new Date(data.businesswiseWorkingDays[0].wedToTime).getHours() < 10 ? '0' : '') +
          (new Date(data.businesswiseWorkingDays[0].wedToTime).getHours())) + ':' +
          ((new Date(data.businesswiseWorkingDays[0].wedToTime).getMinutes() < 10 ? '0' : '') +
            (new Date(data.businesswiseWorkingDays[0].wedToTime).getMinutes()));
        this.secondFormGroup.controls['WedToTime'].setValue(wedTo);

        let thuFrom = ((new Date(data.businesswiseWorkingDays[0].thuFromTime).getHours() < 10 ? '0' : '') +
          (new Date(data.businesswiseWorkingDays[0].thuFromTime).getHours())) + ':' +
          ((new Date(data.businesswiseWorkingDays[0].thuFromTime).getMinutes() < 10 ? '0' : '') +
            (new Date(data.businesswiseWorkingDays[0].thuFromTime).getMinutes()));
        this.secondFormGroup.controls['ThuFromTime'].setValue(thuFrom);

        let thuTo = ((new Date(data.businesswiseWorkingDays[0].thuToTime).getHours() < 10 ? '0' : '') +
          (new Date(data.businesswiseWorkingDays[0].thuToTime).getHours())) + ':' +
          ((new Date(data.businesswiseWorkingDays[0].thuToTime).getMinutes() < 10 ? '0' : '') +
            (new Date(data.businesswiseWorkingDays[0].thuToTime).getMinutes()));
        this.secondFormGroup.controls['ThuToTime'].setValue(thuTo);

        let friFrom = ((new Date(data.businesswiseWorkingDays[0].friFromTime).getHours() < 10 ? '0' : '') +
          (new Date(data.businesswiseWorkingDays[0].friFromTime).getHours())) + ':' +
          ((new Date(data.businesswiseWorkingDays[0].friFromTime).getMinutes() < 10 ? '0' : '') +
            (new Date(data.businesswiseWorkingDays[0].friFromTime).getMinutes()));
        this.secondFormGroup.controls['FriFromTime'].setValue(friFrom);

        let friTo = ((new Date(data.businesswiseWorkingDays[0].friToTime).getHours() < 10 ? '0' : '') +
          (new Date(data.businesswiseWorkingDays[0].friToTime).getHours())) + ':' +
          ((new Date(data.businesswiseWorkingDays[0].friToTime).getMinutes() < 10 ? '0' : '') +
            (new Date(data.businesswiseWorkingDays[0].friToTime).getMinutes()));
        this.secondFormGroup.controls['FriToTime'].setValue(friTo);

        let satFrom = ((new Date(data.businesswiseWorkingDays[0].satFromTime).getHours() < 10 ? '0' : '') +
          (new Date(data.businesswiseWorkingDays[0].satFromTime).getHours())) + ':' +
          ((new Date(data.businesswiseWorkingDays[0].satFromTime).getMinutes() < 10 ? '0' : '') +
            (new Date(data.businesswiseWorkingDays[0].satFromTime).getMinutes()));
        this.secondFormGroup.controls['SatFromTime'].setValue(satFrom);

        let satTo = ((new Date(data.businesswiseWorkingDays[0].satToTime).getHours() < 10 ? '0' : '') +
          (new Date(data.businesswiseWorkingDays[0].satToTime).getHours())) + ':' +
          ((new Date(data.businesswiseWorkingDays[0].satToTime).getMinutes() < 10 ? '0' : '') +
            (new Date(data.businesswiseWorkingDays[0].satToTime).getMinutes()));
        this.secondFormGroup.controls['SatToTime'].setValue(satTo);

        let sunFrom = ((new Date(data.businesswiseWorkingDays[0].sunFromTime).getHours() < 10 ? '0' : '') +
          (new Date(data.businesswiseWorkingDays[0].sunFromTime).getHours())) + ':' +
          ((new Date(data.businesswiseWorkingDays[0].sunFromTime).getMinutes() < 10 ? '0' : '') +
            (new Date(data.businesswiseWorkingDays[0].sunFromTime).getMinutes()));
        this.secondFormGroup.controls['SunFromTime'].setValue(sunFrom);

        let sunTo = ((new Date(data.businesswiseWorkingDays[0].sunToTime).getHours() < 10 ? '0' : '') +
          (new Date(data.businesswiseWorkingDays[0].sunToTime).getHours())) + ':' +
          ((new Date(data.businesswiseWorkingDays[0].sunToTime).getMinutes() < 10 ? '0' : '') +
            (new Date(data.businesswiseWorkingDays[0].sunToTime).getMinutes()));
        this.secondFormGroup.controls['SunToTime'].setValue(sunTo);

        this.showLocationList = false;

        this.secondFormGroup.controls['TueFromTime'].enable();
        this.secondFormGroup.controls['TueToTime'].enable();
        this.secondFormGroup.controls['WedFromTime'].enable();
        this.secondFormGroup.controls['WedToTime'].enable();
        this.secondFormGroup.controls['ThuFromTime'].enable();
        this.secondFormGroup.controls['ThuToTime'].enable();
        this.secondFormGroup.controls['FriFromTime'].enable();
        this.secondFormGroup.controls['FriToTime'].enable();
        this.secondFormGroup.controls['SatFromTime'].enable();
        this.secondFormGroup.controls['SatToTime'].enable();
        this.secondFormGroup.controls['SunFromTime'].enable();
        this.secondFormGroup.controls['SunToTime'].enable();
        this.ChkMakeDefaultTime = false;

        this.businessLocationSaveBtn = "Update & Continue";

        let labels = this.GetBusinessLabelsForEdit(data['businesswiseLabels']);
        this.selectedBusinessLabels = [];
        labels.forEach(element => {
          this.selectedBusinessLabels.push({
            id: element.labelID,
            name: this.businessLabels.filter(x => x.id == element.labelID)[0].name
          })
        });

        if (data.logoPath != '' && data.logoPath != null && data.logoPath != undefined) {
          this.filePathBusinessLogo = AppSettings.API_ENDPOINT + AppSettings.Root_ENDPOINT + "/" + data.logoPath;
          this.uploadProgressBusinessLogo = (100).toString() + "%";
          this.fileNameBusinessLogo = data.logoPath;
        }
        else {
          this.cancelUploadBusinessLogo();
        }

        if (data.imagePath != '' && data.imagePath != null && data.imagePath != undefined) {
          this.filePathBusinessDisplayImage = AppSettings.API_ENDPOINT + AppSettings.Root_ENDPOINT + "/" + data.imagePath;
          this.uploadProgressBusinessDisplayImage = (100).toString() + "%";
          this.fileNameBusinessDisplayImage = data.imagePath;
        }
        else {
          this.cancelUploadBusinessDisplayImage();
        }

        if (data.galleryImagePath1 != '' && data.galleryImagePath1 != null && data.galleryImagePath1 != undefined) {
          this.filePathBusinessImage1 = AppSettings.API_ENDPOINT + AppSettings.Root_ENDPOINT + "/" + data.galleryImagePath1;
          this.uploadProgressBusinessImage1 = (100).toString() + "%";
          this.fileNameBusinessImage1 = data.galleryImagePath1;
        }
        else {
          this.cancelUploadBusinessImage1();
        }

        if (data.galleryImagePath2 != '' && data.galleryImagePath2 != null && data.galleryImagePath2 != undefined) {
          this.filePathBusinessImage2 = AppSettings.API_ENDPOINT + AppSettings.Root_ENDPOINT + "/" + data.galleryImagePath2;
          this.uploadProgressBusinessImage2 = (100).toString() + "%";
          this.fileNameBusinessImage2 = data.galleryImagePath2;
        }
        else {
          this.cancelUploadBusinessImage2();
        }

        if (data.galleryImagePath3 != '' && data.galleryImagePath3 != null && data.galleryImagePath3 != undefined) {
          this.filePathBusinessImage3 = AppSettings.API_ENDPOINT + AppSettings.Root_ENDPOINT + "/" + data.galleryImagePath3;
          this.uploadProgressBusinessImage3 = (100).toString() + "%";
          this.fileNameBusinessImage3 = data.galleryImagePath3;
        }
        else {
          this.cancelUploadBusinessImage3();
        }

        if (data.galleryImagePath4 != '' && data.galleryImagePath4 != null && data.galleryImagePath4 != undefined) {
          this.filePathBusinessImage4 = AppSettings.API_ENDPOINT + AppSettings.Root_ENDPOINT + "/" + data.galleryImagePath4;
          this.uploadProgressBusinessImage4 = (100).toString() + "%";
          this.fileNameBusinessImage4 = data.galleryImagePath4;
        }
        else {
          this.cancelUploadBusinessImage4();
        }
      },
      error: (error: any) => {

      }
    })
  }

  GetBusinessLabelsForEdit(data: any) {
    let details = [];
    data.forEach((element: any) => {
      let tempdefDetails = {
        "uniqueID": element.uniqueId,
        "id": element.id,
        "businessID": element.businessId,
        "labelID": element.labelId,
        "isActive": element.isActive,
        "createdDate": element.createdDate,
        "createdBy": element.createdBy,
        "lastModifiedBy": element.lastModifiedBy,
        "lastModifiedDate": element.lastModifiedDate,
      }
      details.push(tempdefDetails);
    });
    return details;
  }

  SaveLocationDetails() {
    this.secondStepSubmitted = true;
    if (this.secondFormGroup.invalid) {
      return;
    }

    this.isLoading = true;
    let model = this.createBusinessLocationModel();
    if (this.businessLocationID == 0) {
      this._businessProfileService.PostBusinessProfile(model)
        .subscribe({
          next: (data) => {
            this.businessLocationID = data.id;
            this.businessLocationSaveBtn = 'Update & Continue';
            this.isLoading = false;
            this.secondStepSubmitted = false;
            this.getBusinessLocationsByGroupID();
            this.stepper.next();
          },
          error: error => {
            console.log(error);
            this.isLoading = false;
            this.secondStepSubmitted = false;
          }
        });
    }
    else {
      model.id = this.businessLocationID;
      this._businessProfileService.PutBusinessProfile(model.id, model)
        .subscribe({
          next: (data) => {
            this.isLoading = false;
            this.secondStepSubmitted = false;
            this.stepper.next();
          },
          error: error => {
            console.log(error);
            this.isLoading = false;
            this.secondStepSubmitted = false;
          }
        });
    }
  }

  changePaymentAmount(value: number) {
    if (this.paymentInfoID == 0) {
      if (value == 1) {
        this.thirdFormGroup.controls['paymentAmountMonthly'].setValue(
          this.packageTypeData.filter((x: { id: any; }) => x.id == (
            this.firstFormGroup.controls['PackageTypeID'].value[0].id
          ))[0].pricePerMonth
        );
      }
      else if (value == 2) {
        this.thirdFormGroup.controls['paymentAmountYearly'].setValue(
          this.packageTypeData.filter((x: { id: any; }) => x.id == (
            this.firstFormGroup.controls['PackageTypeID'].value[0].id
          ))[0].yearlyAmount
        );
      }
    }
  }

  changePaymentType(type) {
    if (type == 1 || type == 2) {
      this.thirdFormGroup.controls['CardHolderName'].addValidators(Validators.required);
    }
    else if (type == 3 || type == 4) {
      this.thirdFormGroup.controls['CardHolderName'].reset();
      this.thirdFormGroup.controls['CardHolderName'].clearValidators();
    }
    this.thirdFormGroup.controls["CardHolderName"].updateValueAndValidity();
  }

  businessLabelOnChange() {
    if (this.secondFormGroup.controls["BusinessLabelID"].value.length >= 2) {
      this.filteredBusinessLabels = this.businessLabels.filter(x => x.name.toLowerCase().includes(this.secondFormGroup.controls['BusinessLabelID'].value.toLowerCase()));
    }
    else {
      this.filteredBusinessLabels = this.businessLabels;
    }
  }

  selectBusiness(id: any) {
    if (this.selectedBusinessLabels.length == 5) {
      this.toast.warning("You can select upto 5 Business labels only !", '', { positionClass: 'toast-bottom-right' })
      return;
    }

    if (this.selectedBusinessLabels.filter(x => x.id == id).length == 0) {
      this.secondFormGroup.controls['BusinessLabelID'].setValue('');
      this.selectedBusinessLabels.push({
        id: id,
        name: this.businessLabels.filter(x => x.id == id)[0].name
      })
    }
  }

  removeBusiness(id: any) {
    this.selectedBusinessLabels.splice((this.selectedBusinessLabels.indexOf(this.selectedBusinessLabels.filter(x => x.id == id)[0])), 1);
  }

  AddNewPaymentInfo() {
    this.paymentInfoID = 0;
    this.paymentMethodID = '';
    this.showPaymentList = false;
    this.cardNumber = 0;
    this.expiryMonth = 0;
    this.expiryYear = 0;
    this.zipCode = '';
    this.showNgxCard = true;
  }

  EditPaymentInfo(e) {
    this._paymentInfoService.GetPaymentInfoByID(e.id).subscribe({
      next: (data: any) => {
        this.paymentInfoID = e.id;
        let selectedLocation: { id: any, businessName: any }[] = [];
        selectedLocation.push({
          id: data.businessLocationId,
          businessName: this.businessLocationName.filter(x => x.id == data.businessLocationId)[0].businessName
        });
        this.thirdFormGroup.controls['BusinessLocationName'].setValue(selectedLocation);
        this.thirdFormGroup.controls['ChkMakeDefault'].setValue(data.isDefault);
        if (data.isDefault == true) {
          this.thirdFormGroup.controls['ChkMakeDefault'].disable();
        }
        this.thirdFormGroup.controls['CardHolderName'].setValue(data.cardHolderName);
        this.thirdFormGroup.controls['selectedOption'].setValue(data.paymentType);

        this.cardNumber = data.cardNumber;
        this.paymentMethodID = data.paymentMethodID;
        this.expiryMonth = data.expireMonth;
        this.expiryYear = data.expireYear;
        this.zipCode = data.zipCode;

        let dt = new Date(data.goLiveDate).getDate();
        let month = (new Date(data.goLiveDate).getMonth() + 1) < 10 ? ("0" + (new Date(data.goLiveDate).getMonth() + 1)) :
          (new Date(data.goLiveDate).getMonth() + 1);
        let year = new Date(data.goLiveDate).getFullYear();
        let liveDate = (year + "-" + month + "-" + dt)
        this.thirdFormGroup.controls['GoLiveDate'].setValue(liveDate);

        this.thirdFormGroup.controls['paymentSchedule'].setValue(JSON.stringify(data.paymentScheduleID));
        this.thirdFormGroup.controls['paymentAmountMonthly'].setValue(data.packageMonthlyAmount);
        this.thirdFormGroup.controls['paymentAmountYearly'].setValue(data.packageYearlyAmount);

        this.showPaymentList = false;
        this.isPaymentLocationDisabled = true;
        this.thirdFormGroup.controls['selectedOption'].disable();
        this.thirdFormGroup.controls['paymentSchedule'].disable();
        this.paymentInfoSaveBtn = "Update & Continue";

        if (data.paymentType == 1 || data.paymentType == 2) {
          this.thirdFormGroup.controls['CardHolderName'].addValidators(Validators.required);
          this.thirdFormGroup.controls["CardHolderName"].updateValueAndValidity();
        }

        this.showNgxCard = false;
      },
      error: (error: any) => {

      }
    })
  }

  AddNewSource() {
    this.showSourceList = false;
  }

  EditSource(e) {
    this._sourceService.GetSourcesByIDForAdminPanel(e.id).subscribe({
      next: (data: any) => {
        this.sourceID = e.id;

        let selectedLocation: { id: any, businessName: any }[] = [];
        selectedLocation.push({
          id: data.businessLocationID,
          businessName: this.businessLocationName.filter(x => x.id == data.businessLocationID)[0].businessName
        });
        this.fourthFormGroup.controls['SrcBusinessLocationName'].setValue(selectedLocation);
        this.isSourceLocationDisabled = true;

        this.fourthFormGroup.controls['CustTabletBrand'].setValue(data.custTabletBrand);
        this.fourthFormGroup.controls['CustTabletModel'].setValue(data.custTabletModel);
        this.fourthFormGroup.controls['StoreTabletBrand'].setValue(data.storeTabletBrand);
        this.fourthFormGroup.controls['StoreTabletModel'].setValue(data.storeTabletModel);

        this.customerSourceName = data.sourceName;
        this.storeSourceName = data.storeSourceName;

        this.customerUserName = data.customerTabUserName;
        this.storeUserName = data.storeTabUserName;

        this.showSourceList = false;
        this.sourceSaveBtn = 'Review & Update';
      },
      error: (error: any) => {

      }
    })
  }

  onBusinessSelect() {
    let value = this.fourthFormGroup.controls['SrcBusinessLocationName'].value[0].id;
    this._sourceService.GetSourceCountByLocationID(value).subscribe({
      next: (data) => {

        this.customerSourceName = data.businessLocationName.toLowerCase() + (data.count > 0 ? (data.count + 1) : '') + "customer";
        this.storeSourceName = data.businessLocationName.toLowerCase() + (data.count > 0 ? (data.count + 1) : '') + "store";

        this.customerUserName = this.customerSourceName;
        this.storeUserName = this.storeSourceName;
      },
      error: error => {
        console.log("This is error message", error)
      }
    })
  }

  onBusinessDeSelected() {
    this.customerSourceName = '';
    this.storeSourceName = '';
    this.customerUserName = '';
    this.storeUserName = '';
  }

  DeletePaymentMethod() {
    this._paymentInfoService.DeletePaymentInfo(this.paymentInfoID).subscribe({
      next: (data: any): any => {
        this.isLoading = false;
        this.getPaymentInfoesByGroupID();
      }, error(err) {
        console.log(err)
      },
    });
  }

  deleteBtnOnClick(e) {
    this.paymentInfoID = e.id;
  }

  onChangeDefaultTime() {
    let getValueFrom = this.secondFormGroup.controls['MonFromTime'].value;
    let getValueTo = this.secondFormGroup.controls['MonToTime'].value;

    this.ChkMakeDefaultTime = !this.ChkMakeDefaultTime;

    if (this.ChkMakeDefaultTime) {
      this.secondFormGroup.controls['TueFromTime'].disable();
      this.secondFormGroup.controls['TueToTime'].disable();
      this.secondFormGroup.controls['WedFromTime'].disable();
      this.secondFormGroup.controls['WedToTime'].disable();
      this.secondFormGroup.controls['ThuFromTime'].disable();
      this.secondFormGroup.controls['ThuToTime'].disable();
      this.secondFormGroup.controls['FriFromTime'].disable();
      this.secondFormGroup.controls['FriToTime'].disable();
      this.secondFormGroup.controls['SatFromTime'].disable();
      this.secondFormGroup.controls['SatToTime'].disable();
      this.secondFormGroup.controls['SunFromTime'].disable();
      this.secondFormGroup.controls['SunToTime'].disable();
    }
    else if (!this.ChkMakeDefaultTime) {
      this.secondFormGroup.controls['TueFromTime'].enable();
      this.secondFormGroup.controls['TueToTime'].enable();
      this.secondFormGroup.controls['WedFromTime'].enable();
      this.secondFormGroup.controls['WedToTime'].enable();
      this.secondFormGroup.controls['ThuFromTime'].enable();
      this.secondFormGroup.controls['ThuToTime'].enable();
      this.secondFormGroup.controls['FriFromTime'].enable();
      this.secondFormGroup.controls['FriToTime'].enable();
      this.secondFormGroup.controls['SatFromTime'].enable();
      this.secondFormGroup.controls['SatToTime'].enable();
      this.secondFormGroup.controls['SunFromTime'].enable();
      this.secondFormGroup.controls['SunToTime'].enable();
    }
    this.secondFormGroup.controls['TueFromTime'].setValue(getValueFrom);
    this.secondFormGroup.controls['TueToTime'].setValue(getValueTo);
    this.secondFormGroup.controls['WedFromTime'].setValue(getValueFrom);
    this.secondFormGroup.controls['WedToTime'].setValue(getValueTo);
    this.secondFormGroup.controls['ThuFromTime'].setValue(getValueFrom);
    this.secondFormGroup.controls['ThuToTime'].setValue(getValueTo);
    this.secondFormGroup.controls['FriFromTime'].setValue(getValueFrom);
    this.secondFormGroup.controls['FriToTime'].setValue(getValueTo);
    this.secondFormGroup.controls['SatFromTime'].setValue(getValueFrom);
    this.secondFormGroup.controls['SatToTime'].setValue(getValueTo);
    this.secondFormGroup.controls['SunFromTime'].setValue(getValueFrom);
    this.secondFormGroup.controls['SunToTime'].setValue(getValueTo);
  }

  goToSteps(stepNumber: number, stepperType: string) {
    switch (stepperType) {
      case 'businessLocation':
        this.stepper.selectedIndex = stepNumber - 1;
        break;
      case 'paymentInfo':
        this.stepper.selectedIndex = stepNumber - 1;
        break;
      case 'sources':
        this.stepper.selectedIndex = stepNumber - 1;
        break;
      default:
    }
  }

  CheckIfBusinessGroupExists() {
    let businessGroupName = this.firstFormGroup.controls['BusinessgroupName'].value;
    let id = this.businessGroupID == 'New' ? 0 : this.businessGroupID;
    console.log(businessGroupName)
    console.log(id)
    if (businessGroupName.trim() != '') {
      this._groupService.CheckIfBusinessGroupExists(id, businessGroupName).subscribe({
        next: (data: any) => {
          if (data == 200) {
            this.toast.warning('Business Group with same name already exists !', '', { positionClass: 'toast-bottom-right' });
            this.firstFormGroup.controls['BusinessgroupName'].setValue('');
          }
          else if (data == 400) {
            this.toast.error('Something went wrong !', '', { positionClass: 'toast-bottom-right' });
            this.firstFormGroup.controls['BusinessgroupName'].setValue('');
          }
        },
        error: (error: any) => {
          this.toast.error('Something went wrong !', '', { positionClass: 'toast-bottom-right' });
          this.firstFormGroup.controls['BusinessgroupName'].setValue('');
          console.log("This is error message", error);
        }
      });
    }
  }

  toggleBusinessGroup(element) {
    this.businessLocationID = element.id;
  }

  enableBusinessLocation() {
    this._businessProfileService.EnableDisableBusinessProfile(this.businessLocationID)
      .subscribe({
        next: (data) => {
          this.closeModal.nativeElement.click();
          this.getBusinessLocationsByGroupID();
        },
        error: error => {
          console.log(error);
        }
      });
  }

  // Searching filter for Business Locations....
  applyFiltersForLocation(event: any) {
    const searchInput = event.target.value.toLowerCase();
    this.dataSourceBusinessLocation = this.filteredataForLocations.filter((item: any) => {
      return item.businessName.toLowerCase().includes(searchInput)
    });
  }

  // Searching filter for Payment info......
  applyFiltersForPaymentInfo(event: any) {
    const searchInput = event.target.value.toLowerCase();
    this.dataSourcePaymentInfo = this.filterDataForPaymentInfo.filter((item: any) => {
      return item.businessLocationName.toLowerCase().includes(searchInput)
    });
  }

  // Searching filter for Sources....
  applyFiltersForSources(event: any) {
    const searchInput = event.target.value.toLowerCase();
    this.dataSourceSources = this.filterDataForSources.filter((item: any) => {
      return item.businessLocationName.toLowerCase().includes(searchInput)
    });
  }

  // editCardDetails() {
  //   this.showNgxCard = !this.showNgxCard;
  // }

  AddNewPaymentDoc() {
    if (this.selectedBusiness.length == 0) {
      this.toast.warning("Select Business Location !", '', { positionClass: 'toast-bottom-right' })
      return;
    }
    this.paymentDocs.push(this.fb.group({
      id: [0],
      type: ['', Validators.required],
      fileName: ['', Validators.required],
      uploadProgressPaymentDoc: [null],
      filePathPaymentDoc: [null],
      paymentDocSubmitted: [false]
    }));
  }

  get paymentDocs() {
    return this.paymentDocFromGroup.get('paymentDocs') as FormArray;
  }

  ControlValue(index: number, controlName: string) {
    return this.paymentDocs.at(index).get(controlName).value;
  }

  isInvalid(index: number, controlName: string) {
    const control = this.paymentDocs.at(index).get(controlName);
    return control.invalid;
  }

  createPaymentDocModel(i) {
    let details = {
      "id": this.paymentDocs.controls[i].value['id'],
      "businessLocationID": this.selectedBusiness[0].id,
      "documentType": this.paymentDocs.controls[i].value['type'][0].id,
      "documentPath": this.paymentDocs.controls[i].value['fileName'],
      "createdBy": AppSettings.GetCreatedBy(),
      "createdDate": AppSettings.GetDate(),
      "lastModifiedBy": AppSettings.GetLastModifiedBy(),
      "lastModifiedDate": AppSettings.GetDate()
    }

    return details;
  }

  SavePaymentDoc(i) {
    this.paymentDocs.at(i).get('paymentDocSubmitted').setValue(true);
    if (this.paymentDocs.at(i).invalid) {
      return;
    }

    this.isLoading = true;
    let model = this.createPaymentDocModel(i);
    if (model.id == 0) {
      this._paymentDocService.PostLocationwisePaymentDocs(model)
        .subscribe({
          next: (data) => {
            this.paymentDocs.at(i).get('id').setValue(data.id);
            this.toast.success("Saved Successfully !", '', { positionClass: 'toast-bottom-right' });
            this.isLoading = false;
            this.paymentDocs.at(i).get('paymentDocSubmitted').setValue(false);
          },
          error: error => {
            console.log(error);
            this.isLoading = false;
            this.paymentDocs.at(i).get('paymentDocSubmitted').setValue(false);
          }
        });
    }
    else {
      this._paymentDocService.PutLocationwisePaymentDocs(model.id, model)
        .subscribe({
          next: (data) => {
            this.toast.success("Updated Successfully !", '', { positionClass: 'toast-bottom-right' });
            this.isLoading = false;
            this.paymentDocs.at(i).get('paymentDocSubmitted').setValue(false);
          },
          error: error => {
            console.log(error);
            this.isLoading = false;
            this.paymentDocs.at(i).get('paymentDocSubmitted').setValue(false);
          }
        });
    }
  }

  deletePaymentDocOnClick(i) {
    this.indexID = i;
  }

  DeleteDoc() {
    if (this.indexID.toString() != "") {
      this.paymentDocs.at(this.indexID).get('paymentDocSubmitted').setValue(true);
      this.isLoading = true;

      let id = this.paymentDocs.at(this.indexID).get('id').value;
      if (id != 0) {
        this._paymentDocService.DeleteLocationwisePaymentDocs(id)
          .subscribe({
            next: (data) => {
              this.getPaymentDocsByLocationID(this.selectedBusiness[0].id);
              this.toast.success("Deleted Successfully !", '', { positionClass: 'toast-bottom-right' });
              this.isLoading = false;
              this.indexID = '';
            },
            error: error => {
              console.log(error);
              this.isLoading = false;
              this.paymentDocs.at(this.indexID).get('paymentDocSubmitted').setValue(false);
              this.indexID = '';
            }
          });
      }
      else {
        const data = this.paymentDocFromGroup.controls['paymentDocs'] as FormArray;
        data.removeAt(this.indexID);
        this.indexID = '';
      }
    }
  }

  onBusinessSelectedPaymentDocs() {
    if (this.selectedBusiness.length > 0) {
      this.getPaymentDocsByLocationID(this.selectedBusiness[0].id);
    }
    else {
      this.docList = [];
      while (this.paymentDocs.length !== 0) {
        this.paymentDocs.removeAt(0)
      }
    }
  }

  // search Google Maps....
  initAutocomplete() {
    this.googleMapsService.api.then((maps) => {
      let autocomplete = new maps.places.Autocomplete(
        this.searchElementRef.nativeElement
      );
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {

          this.latitude = autocomplete.getPlace().geometry.location.lat();
          this.longitude = autocomplete.getPlace().geometry.location.lng();
          this.secondFormGroup.controls['Address'].setValue(this.searchElementRef.nativeElement.value);
        });
      });

      this.searchElementRef.nativeElement.addEventListener('keydown', (event: any) => {
        if (event.key === 'Enter') {
          event.preventDefault();
        }
      })
    });
  }

  //#region BusinessImage1
  onChangePaymentDoc(event: any, index) {
    this.filePaymentDoc = event.target.files[0];

    const uploadProgressPaymentDoc = this.paymentDocs.at(index).get('uploadProgressPaymentDoc');
    const filePathPaymentDoc = this.paymentDocs.at(index).get('filePathPaymentDoc');
    const fileName = this.paymentDocs.at(index).get('fileName');

    if (this.filePaymentDoc) {
      this.loadingPaymentDoc = true;
      this._uploadService.uploadBusinessImage(this.filePaymentDoc).subscribe((event: any) => {
        if (event.type == HttpEventType.UploadProgress) {
          uploadProgressPaymentDoc.setValue(Math.round(100 * (event.loaded / event.total)).toString() + "%")
        }
        if (event.partialText != undefined && event.partialText.split('|')[0] == "file uploaded") {
          this.loadingPaymentDoc = false;
          this.isfileUploadedPaymentDoc = true;
          let array = event.partialText.split('|')[1].split('\\');
          fileName.setValue(array[array.length - 1]);
          filePathPaymentDoc.setValue(AppSettings.API_ENDPOINT + AppSettings.Root_ENDPOINT + "/" + array[array.length - 1]);
        } else {
          this.loadingPaymentDoc = false;
          this.isfileUploadedPaymentDoc = false;
        }
      });
    }
    this.loadingPaymentDoc = false;
  }

  cancelUploadPaymentDoc(index) {
    this.isfileUploadedPaymentDoc = false;
    this.resetBusinessPaymentDoc(index);
  }

  resetBusinessPaymentDoc(index) {
    const uploadProgressPaymentDoc = this.paymentDocs.at(index).get('uploadProgressPaymentDoc');
    const filePathPaymentDoc = this.paymentDocs.at(index).get('filePathPaymentDoc');
    const fileName = this.paymentDocs.at(index).get('fileName');

    this.filePaymentDoc = null;
    filePathPaymentDoc.setValue(null);
    uploadProgressPaymentDoc.setValue(null);
    fileName.setValue(null);
  }
  //#endregion

  navigateToList() {
    this.route.navigate(['/group-list']);
  }
}