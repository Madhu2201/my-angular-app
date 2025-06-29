import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
// import { TabsModule } from 'ngx-bootstrap/tabs'; // Import TabsModule for <tabset> and <tab> - REMOVED

@Component({
  selector: 'app-comparison-document',
  standalone: true,
  imports: [FormsModule, CommonModule], // TabsModule removed
 template:`
  <div class="main-container">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 adjust-margin right-section" *ngIf="flagstatusHeader">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 adjust-margin headername" style="display: none;">
                    {{flowName}}
                </div>
                <!-- Main container for BGV Document, Approve/Reject, and Statuses -->
                <div class="bgvDoc-main-wrapper">
                    <div class="bgv-doc-left-section">
                        <p class="BGVtitle">
                            <a (click)="displayPreview(DocumentView, BGVData._id, BGVData,'modal-xl')" class="icon-link">
                                <i class="icon fa fa-eye" aria-hidden="true" tooltip="View"></i>
                            </a>
                            BGV Document
                        </p>
                        <div class="main-action-buttons">
                            <button class="processButton-m" (click)="updateDocument('mainCollection','Reconciliation_Approved',BGVData,true)">Approve Candidate</button>
                            <button class="processButtonRed-m" (click)="openPopup($event, null,updateDocument,['mainCollection','Reject',BGVData,true])">Reject Candidate</button>
                        </div>
                    </div>

                    <div class="bgv-doc-right-section">
                        <div class="queuescroll">
                            <div class="status-block" *ngFor="let headS of statusHeader; let colIndex = index;">
                                <span class="statusheader" *ngIf="headS=='Proof_Of_Identication/Address_Documents'">POI AND POA</span>
                                <span class="statusheader" *ngIf="headS=='Bank_Statement_Documents'">Bank Statement</span>
                                <span class="statusheader" *ngIf="headS=='Employment_Documents'">Employment</span>
                                <span class="statusheader" *ngIf="headS=='Education_Documents'">Education</span>
                                <span class="statusheader" *ngIf="headS=='Supervisor_Documents'">Supervisor</span>
                                <span class="statusheader" *ngIf="headS=='Reference_Documents'">Referee </span>

                                <div class="status-counts">
                                    <div class="circle green" tooltip="Approve"><span class="statuscount">{{statusData.status[colIndex] ? statusData.status[colIndex][headS][0].Approve : 0}}</span></div>
                                    <div class="circle yellow" tooltip="Pending"><span class="statuscount">{{statusData.status[colIndex] ? statusData.status[colIndex][headS][0].Pending : 0}}</span></div>
                                    <div class="circle red" tooltip="Reject"><span class="statuscount">{{statusData.status[colIndex] ? statusData.status[colIndex][headS][0].Reject : 0}}</span></div>
                                </div>

                                <div class="component-action-buttons">
                                    <div class="componentLevelbtn" [ngClass]="compoentStatus[headS]=='Reconciliation_Approved' ? 'btnGreen paddingLeft5' : 'paddingLeft5'"
                                        (click)="updatecomponentDocument(headS,'Reconciliation_Approved',BGVData)">
                                        <a class="icon-link">
                                            <i class="icon fa fa-check" aria-hidden="true" tooltip="Approve"></i>
                                        </a>
                                    </div>
                                    <div class="componentLevelbtn" [ngClass]="compoentStatus[headS]=='Reject' ? 'btnRed' : ''">
                                        <a (click)="openPopup($event, null,updatecomponentDocument,[headS,'Reject',BGVData])" class="icon-link">
                                            <i class="icon fa fa-times" aria-hidden="true" tooltip="Reject"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="dms-and-scope-group">
                            <div class="dmsCount" (mouseover)="showTable()" (mouseout)="hideTable()">
                                <span class="statuscount">{{dmsDocList.length}}</span>
                            </div>
                            <div class="scope-container" *ngIf="!verification_flow" style="display:flex; align-items:center; gap:5px;">
                                <span class="scope">Scope</span>
                                <div class="purpleCircleForScope" (mouseover)="isValidScopeObjVisible=!isValidScopeObjVisible" (mouseout)="isValidScopeObjVisible=!isValidScopeObjVisible">
                                    <span class="statuscount">1</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tabs (Buttons) for document types -->
                <div class="document-tab-buttons">
                  <button *ngFor="let tabName of documentCategories; let i = index"
                          class="doc-tab-btn"
                          [ngClass]="{'active-tab': selectedTabIndexP === i}"
                          (click)="selectTabVTS(i)">
                    {{ tabName }}
                  </button>
                </div>

                <!-- Content Area for Tabs -->
                <div class="tab-content-area">
                    <div class="row put-top tab-content-wrapper">
                        <div class="col-lg-12">
                            <!-- Placeholder for empty state -->
                            <p class="text-center text-gray-500" [hidden]="selectedCategory && (documentTableData.length > 0 || currentEmploymentDocs.length > 0 || previousEmploymentDocs.length > 0)">
                                Select a document type tab to view its data in a table.
                            </p>

                            <ng-container *ngFor="let tabName of documentCategories; let i = index">
                                <div *ngIf="selectedTabIndexP === i">
                                    <!-- Conditional rendering for "Employment" tab (multiple tables + matching %) -->
                                    <ng-container *ngIf="tabName === 'Employment'">
                                        <!-- Current Employment Details Table -->
                                        <ng-container *ngIf="currentEmploymentDocs && currentEmploymentDocs.length > 0">
                                            <h3 class="sub-table-header">Current Employment Details</h3>
                                            <div class="tableScrollOnly">
                                                <table class="table table-striped table-bordered nowrap data-table">
                                                    <thead class="table-design">
                                                        <tr>
                                                            <th></th> <!-- For BGV/Document/Matching % labels + icons -->
                                                            <th>TB Details</th>
                                                            <th *ngFor="let key of getRelevantKeys(currentEmploymentDocs[0])">
                                                                {{ formatKey(key) }}
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <ng-container *ngFor="let doc of currentEmploymentDocs">
                                                            <!-- BGV Data Row -->
                                                            <tr>
                                                                <td class="tableData tablecellbold">
                                                                    <i class="fa fa-check-circle text-green-500 mr-2"></i> BGV
                                                                </td>
                                                                <td class="tableData">N/A</td> <!-- TB Details -->
                                                                <td class="tableData" *ngFor="let key of getRelevantKeys(doc)">
                                                                    {{ getBGVValueForField(doc, key) }}
                                                                </td>
                                                            </tr>
                                                            <!-- Document Data Row -->
                                                            <tr>
                                                                <td class="tableData tablecellbold">
                                                                    <i class="fa fa-file-alt text-blue-500 mr-2"></i> Employment
                                                                </td>
                                                                <td class="tableData">N/A</td> <!-- TB Details -->
                                                                <td class="tableData" *ngFor="let key of getRelevantKeys(doc)">
                                                                    {{ doc[key] || 'N/A' }}
                                                                </td>
                                                            </tr>
                                                            <!-- Matching Percentage Row -->
                                                            <tr class="matching-percentage-row">
                                                                <th class="tableData">Matching %</th>
                                                                <td class="tableData"></td> <!-- Empty cell for TB Details alignment -->
                                                                <td class="tableData" *ngFor="let key of getRelevantKeys(doc)">
                                                                    <ng-container *ngIf="isFieldForComparison(key, doc.originalCategory)">
                                                                        {{ findSimilarity(getBGVValueForField(doc, key), doc[key]) }}
                                                                    </ng-container>
                                                                    <ng-container *ngIf="!isFieldForComparison(key, doc.originalCategory)">
                                                                        &nbsp;
                                                                    </ng-container>
                                                                </td>
                                                            </tr>
                                                        </ng-container>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </ng-container>

                                        <!-- Previous Employment Details Table -->
                                        <ng-container *ngIf="previousEmploymentDocs && previousEmploymentDocs.length > 0">
                                            <h3 class="sub-table-header">Previous Employment Details</h3>
                                            <div class="tableScrollOnly">
                                                <table class="table table-striped table-bordered nowrap data-table">
                                                    <thead class="table-design">
                                                        <tr>
                                                            <th></th> <!-- For BGV/Document/Matching % labels + icons -->
                                                            <th>TB Details</th>
                                                            <th *ngFor="let key of getRelevantKeys(previousEmploymentDocs[0])">
                                                                {{ formatKey(key) }}
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <ng-container *ngFor="let doc of previousEmploymentDocs">
                                                            <!-- BGV Data Row -->
                                                            <tr>
                                                                <td class="tableData tablecellbold">
                                                                    <i class="fa fa-check-circle text-green-500 mr-2"></i> BGV
                                                                </td>
                                                                <td class="tableData">N/A</td> <!-- TB Details -->
                                                                <td class="tableData" *ngFor="let key of getRelevantKeys(doc)">
                                                                    {{ getBGVValueForField(doc, key) }}
                                                                </td>
                                                            </tr>
                                                            <!-- Document Data Row -->
                                                            <tr>
                                                                <td class="tableData tablecellbold">
                                                                    <i class="fa fa-file-alt text-blue-500 mr-2"></i> Employment
                                                                </td>
                                                                <td class="tableData">N/A</td> <!-- TB Details -->
                                                                <td class="tableData" *ngFor="let key of getRelevantKeys(doc)">
                                                                    {{ doc[key] || 'N/A' }}
                                                                </td>
                                                            </tr>
                                                            <!-- Matching Percentage Row -->
                                                            <tr class="matching-percentage-row">
                                                                <th class="tableData">Matching %</th>
                                                                <td class="tableData"></td> <!-- Empty cell for TB Details alignment -->
                                                                <td class="tableData" *ngFor="let key of getRelevantKeys(doc)">
                                                                    <ng-container *ngIf="isFieldForComparison(key, doc.originalCategory)">
                                                                        {{ findSimilarity(getBGVValueForField(doc, key), doc[key]) }}
                                                                    </ng-container>
                                                                    <ng-container *ngIf="!isFieldForComparison(key, doc.originalCategory)">
                                                                        &nbsp;
                                                                    </ng-container>
                                                                </td>
                                                            </tr>
                                                        </ng-container>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </ng-container>
                                    </ng-container>

                                    <!-- General Tab Content (separated tables per document) -->
                                    <ng-container *ngIf="tabName !== 'Employment'">
                                        <h4 class="document-title">{{ tabName }} Documents</h4>
                                        <div *ngIf="documentTableData.length === 0">
                                            <p class="no-data">No documents found for {{ tabName }}</p>
                                        </div>
                                        <ng-container *ngIf="documentTableData.length > 0">
                                            <ng-container *ngFor="let doc of documentTableData">
                                                <div class="tableScrollOnly">
                                                    <table class="table table-striped table-bordered nowrap data-table mb-4">
                                                        <thead class="table-design">
                                                            <tr>
                                                                <th></th> <!-- For BGV/Document/Matching % labels + icons -->
                                                                <th>TB Details</th>
                                                                <th *ngFor="let key of getRelevantKeys(doc)">
                                                                    {{ formatKey(key) }}
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <!-- BGV Data Row -->
                                                            <tr>
                                                                <td class="tableData tablecellbold">
                                                                    <i class="fa fa-check-circle text-green-500 mr-2"></i> BGV
                                                                </td>
                                                                <td class="tableData">N/A</td> <!-- TB Details -->
                                                                <td class="tableData" *ngFor="let key of getRelevantKeys(doc)">
                                                                    {{ getBGVValueForField(doc, key) }}
                                                                </td>
                                                            </tr>
                                                            <!-- Document Data Row -->
                                                            <tr>
                                                                <td class="tableData tablecellbold">
                                                                    <i class="fa fa-file-alt text-blue-500 mr-2"></i> {{ formatKey(doc.originalCategory) }}
                                                                </td>
                                                                <td class="tableData">N/A</td> <!-- TB Details -->
                                                                <td class="tableData" *ngFor="let key of getRelevantKeys(doc)">
                                                                    {{ doc[key] || 'N/A' }}
                                                                </td>
                                                            </tr>
                                                            <!-- Matching Percentage Row -->
                                                            <tr class="matching-percentage-row">
                                                                <th class="tableData">Matching %</th>
                                                                <td class="tableData"></td> <!-- Empty cell for TB Details alignment -->
                                                                <td class="tableData" *ngFor="let key of getRelevantKeys(doc)">
                                                                    <ng-container *ngIf="isFieldForComparison(key, doc.originalCategory)">
                                                                        {{ findSimilarity(getBGVValueForField(doc, key), doc[key]) }}
                                                                    </ng-container>
                                                                    <ng-container *ngIf="!isFieldForComparison(key, doc.originalCategory)">
                                                                        &nbsp;
                                                                    </ng-container>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </ng-container>
                                        </ng-container>
                                    </ng-container>
                                </div>
                            </ng-container>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <ng-template #DocumentView>
            <div class="modal-header">
                <h4 class="modal-title pull-left">Document View</h4>
                <button type="button" class="close pull-right" aria-label="Close" (click)="bsModalRef.hide()">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body" style="height: 85vh;">
                <img *ngIf="isImage" id="imgc" class="imgsize" [src]="documentURL" (error)="onErrorMsg()" alt="Document Preview">
                <iframe *ngIf="!isImage && srcFrame" id="iframe" [src]="srcFrame" class="imgsize" frameborder="0" (error)="onErrorMsg()"></iframe>
                <div *ngIf="showErrorMsg" class="alignError">
                    Preview Not Available
                </div>
            </div>
        </ng-template>
 `,
  styleUrls: ['./comparison-document.component.scss'],
})
export class ComparisonDocumentComponent implements OnInit, AfterViewInit {
  title = 'my-ComparisonDocumentComponent';
  params: { [paramName: string]: any } = {};
  appUrl: string = '';
  blueOceanURL: string = '';
  noSuper: boolean = false;
  public isMobile: boolean = false;
  public isDesktop: boolean = false;
  selectedTabIndexP: number = 0;
  isVisibleInDrop: boolean = false;
  subDoctype1_fe: any;
  InsufficiencyType: any;
  InsufficiencyData1: any;
  isVisibleInsubDrop: any;
  subDoctype2_fe: any;
  InsufficiencySubType: any;
  InsufficiencyDataSub: any;
  isVisibleDrop: any;
  subDoctype_fe: any;
  subDocumentType_arr: any;
  docTypeData: any;
  internalIndex: any;
  isShow: any;
  crtIndex: any;
  topPosition: any;
  isCursorOverFilterSet: any;
  isVisible: any;
  isVisibleMapSearch: any;
  searchText1: any;
  filterSet: any;
  showOcrIssuePopup: any;
  isImportant: any;
  previousValue: any;
  saveCroppedDataOriginal: any;
  ComponentTab: any[] = [];
  caseDetail: any;
  personalInfo: any;
  invData: any;
  scanFormFields: any[] = [];
  stateService: any;
  bsModalRef: any;
  modalService: any;
  BGVData: any;
  statusHeader: string[] = [];
  statusData: any = { status: [] };
  compoentStatus: any = {};
  statusDocument: string[] = [];
  statusDetailDocument: { [key: string]: any[] } = {};
  jsonKeys: { [key: string]: string[] } = {};
  jsonData: { [key: string]: { [key: string]: string } } = {};
  dmsDocList: any[] = [];
  verification_flow: boolean = false;

  isImage: boolean = false;
  docx: boolean = false;
  srcFrame: any;
  documentURL: string = '';
  showErrorMsg: boolean = false;
  flagstatusHeader: boolean = true;

  categorizedDocuments: { [categoryName: string]: { [subCategoryName: string]: any[] } | any[] } = {};
  documentCategories: string[] = [];
  selectedCategory: string = '';
  documentsInSelectedCategory: any[] = []; // Used for single-table tabs
  currentEmploymentDocs: any[] = []; // Specific for "Employment" tab
  previousEmploymentDocs: any[] = []; // Specific for "Employment" tab
  selectedDocumentForTable: any = null;
  documentTableData: any[] = []; // Will be populated for single-table tabs

  isValidScopeObjVisible: boolean = false;


  constructor() {
    this.bsModalRef = {
      hide: () => {
        console.log('bsModalRef.hide() called (dummy implementation)');
      }
    };
  }

  ngOnInit(): void {
    this.detectDevice();
    this.initValues();
  }

  ngAfterViewInit() {
    if (this.documentCategories.length > 0) {
      this.selectTabVTS(0);
    }
  }

  detectDevice() {
    const userAgent = navigator.userAgent;
    if (/Android|webOS|iPhone|iPad|IPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
      this.isMobile = true;
    } else {
      this.isDesktop = true;
    }
  }

  loadDocumentTable(tabName: string) {
    this.documentTableData = (this.categorizedDocuments[tabName] as any[]) || [];
  }

  initValues() {
    const newJson = {
      "data": [
        {
          "BGV": {
            "_id": "6839b00f1c46e228987cd95a",
            "Current Address": "Shwalwadi, manjri, stud torm hadpsar Pune 28, 453 tanhai krush niwas \nOpp. ZP school",
            "contact_no": "9890971327",
            "alternative_contact_no": "",
            "marital_status": "Single",
            "email_id": "Shvam.shewale97@gmail.com",
            "Supervisor_Name": ",",
            "Period_Of_Stay_From": "1997-04-01",
            "Period_Of_Stay_To": "2024-02-01",
            "Overall_Stay_Years": "17",
            "Supervisor_Contact_Number": ",",
            "Supervisor_Email_ID": ",",
            "Supervisor_Address": ",",
            "Supervisor_Designation": ",",
            "country": ",",
            "state": ",",
            "city": ",",
            "zip_code": ",",
            "landmark": "Near Zp School",
            "place_loc_area": "Hadpsar",
            "Village/Town": "Shewalewadi manjri",
            "Address": ",",
            "Candidate_Name": "Shivam Narayan Shewale",
            "Permanent Address": "Shwalwadi, manjri, stud torm hadpsar Pune 28, 453 tanhai krush niwas \nOpp. ZP school",
            "Former Name/Maiden Name": "",
            "father_name": "Narayan Krushnaji Shewale",
            "date_of_birth": "1997-04-13",
            "gender": "Male",
            "Social Security Number": "",
            "Nationality": "Indian",
            "Residence Number": "453",
            "Position applied for": "Joftwaredevelopen",
            "Location": "Pune, maharashtra",
            "PAN Number": "",
            "documentTitle": "Background Verification Form",
            "subDocumentType": "BGV",
            "multiTable": [
              {
                "Education Details": [
                  {
                    "College Name & Address": "Annasaheh magay Dune University",
                    "University Name & Address": "",
                    "Dates Attended": "",
                    "From": "05/008",
                    "To": "",
                    "Qualification Gained": "",
                    "ID /Roll No": "",
                    "Please tick mark the documents submitted for this qualification along with this form": "",
                    "Full Time": "Full Time",
                    "Part Time": "",
                    "Name of the Degree": "",
                    "Major": "",
                    "Year of Passing": "",
                    "imageFilePath": "/home/anil/env-user/acheck-files/File1096b9058634d0c7e5f9ce15707fcd6d_aiqod_com1_BGV_ShivamS-1.jpg",
                    "filePath": "/home/anil/env-user/acheck-files/File1096b9058634d0c7e5f9ce15707fcd6d_aiqod.com1_BGV_ShivamS.pdf",
                    "referenceNumber": "File1096b9058634d0c7e5f9ce15707fcd6d"
                  },
                  {
                    "College Name & Address": "Another College",
                    "University Name & Address": "Another University",
                    "Dates Attended": "2010-2012",
                    "From": "01/2010",
                    "To": "12/2012",
                    "Qualification Gained": "High School Diploma",
                    "ID /Roll No": "HS12345",
                    "Please tick mark the documents submitted for this qualification along with this form": "Diploma",
                    "Full Time": "Full Time",
                    "Part Time": "",
                    "Name of the Degree": "High School",
                    "Major": "General",
                    "Year of Passing": "2012",
                    "imageFilePath": "/home/anil/env-user/acheck-files/File1096b9058634d0c7e5f9ce15707fcd6d_aiqod_com1_BGV_ShivamS-1.jpg",
                    "filePath": "/home/anil/env-user/acheck-files/File1096b9058634d0c7e5f9ce15707fcd6d_aiqod.com1_BGV_ShivamS.pdf",
                    "referenceNumber": "File1096b9058634d0c7e5f9ce15707fcd6d"
                  }
                ],
                "keys": [
                  "College Name & Address",
                  "University Name & Address",
                  "Dates Attended",
                  "From",
                  "To",
                  "Qualification Gained",
                  "ID /Roll No",
                  "Please tick mark the documents submitted for this qualification along with this form",
                  "Full Time",
                  "Part Time",
                  "Name of the Degree",
                  "Major",
                  "Year of Passing"
                ]
              },
              {
                "Current Employment Details": [
                  {
                    "Name of Current Employer": "Tech Solutions Inc.",
                    "Address of Current Employer": "123 Tech Park, Silicon Valley",
                    "Telephone No": "555-123-4567",
                    "Employee Code/No": "EMP001",
                    "Designation": "Software engineer",
                    "Department": "R&D",
                    "Employment Period": "2020-01-01 to Present",
                    "From": "2020-01-01",
                    "To": "Present",
                    "Manager's Name": "John Doe",
                    "Manager's Contact No": "555-987-6543",
                    "Manager's Email ID": "john.doe@techsolutions.com",
                    "Can a reference taken now?": "Yes",
                    "Duties & Responsibilities": "Understanding Requirements, Implementing Logic on Survey Side, Datastore Designing",
                    "Reasons for leaving": "N/A",
                    "First Salary drawn": "50,000",
                    "Was this Position": "Permanent",
                    "Agency Details": "Direct Hire",
                    "Last Salary drawn": "75,000",
                    "Please tick mark the documents submitted for this employment": "Offer Letter, Payslips, Service Certificate",
                    "imageFilePath": "/home/anil/env-user/acheck-files/File1096b9058634d0c7e5f9ce15707fcd6d_aiqod_com1_BGV_ShivamS-1.jpg",
                    "filePath": "/home/anil/env-user/acheck-files/File1096b9058634d0c7e5f9ce15707fcd6d_aiqod.com1_BGV_ShivamS.pdf",
                    "referenceNumber": "File1096b9058634d0c7e5f9ce15707fcd6d"
                  }
                ],
                "keys": [
                  "Name of Current Employer",
                  "Address of Current Employer",
                  "Telephone No",
                  "Employee Code/No",
                  "Designation",
                  "Department",
                  "Employment Period",
                  "From",
                  "To",
                  "Manager's Name",
                  "Manager's Contact No",
                  "Manager's Email ID",
                  "Can a reference taken now?",
                  "Duties & Responsibilities",
                  "Reasons for leaving",
                  "First Salary drawn",
                  "Was this Position",
                  "Agency Details",
                  "Last Salary drawn",
                  "Please tick mark the documents submitted for this employment"
                ]
              },
              {
                "Reference Details": [
                  {
                    "Name & Position held": "Ajay Aluny",
                    "Email Address": "ajay.aluny@example.com",
                    "Contact Number": "1387417386",
                    "How do you know this person?": "Former Colleague"
                  },
                  {
                    "Name & Position held": "Abhshek Sawcilkar, Leamlead LAeteBocins",
                    "Email Address": "abhishek.s@example.com",
                    "Contact Number": "9730090093",
                    "How do you know this person?": "Project Lead"
                  }
                ],
                "keys": [
                  "Name & Position held",
                  "Email Address",
                  "Contact Number",
                  "How do you know this person?"
                ]
              },
            ],
            "referenceNumber": "File1096b9058634d0c7e5f9ce15707fcd6d",
            "createdAt": "2025-05-30T18:48:07.027Z",
            "updatedAt": "2025-05-30T14:04:01.053Z",
            "fileName": "/home/anil/env-user/acheck-files/File1096b9058634d0c7e5f9ce15707fcd6d_aiqod_com1_BGV_ShivamS-1_invoice_Merged.csv",
            "orgId": "5c495dbfffa2a85b2c19a77f",
            "isTmp": false,
            "ocrConfidence": [],
            "model": "llama",
            "avgPrediction": 70,
            "documentType": "Background Verification Form",
            "filePath": "/home/anil/env-user/acheck-files/File1096b9058634d0c7e5f9ce15707fcd6d_aiqod.com1_BGV_ShivamS.pdf",
            "flow": "GENAI",
            "invoiceItems": [],
            "masterObj": true,
            "oPred": [],
            "pageLimit": 4,
            "prediction": [],
            "subscriberId": "5beaabd82ac6767c86dc311c",
            "tableConfidence": [],
            "tableCordinates": [],
            "tableEnd": [],
            "tableStart": [],
            "table_headers": [],
            "templateId": "",
            "templateName": "",
            "Vendor_Name": "Accordion Technology Pvt Ltd",
            "candidateKey": "Cand45c3d2cba46b5a4e18399e6ec633543a",
            "documentStatus": "BGV_Reconciliation_Pending",
            "DocumentLevelError": [],
            "deptId": "",
            "error": [],
            "inputId": {},
            "invoiceItemsNew": [],
            "mlCorrection": "true",
            "ocrCorrection": [],
            "roleId": "",
            "tally_status": "Approved",
            "userId": "5beaabd82ac6767c86dc311e",
            "user_status": "frontend"
          }
        },
        {
          "Employment": [
            // {
            //   "_id": "6839afdd1c46e228987cd958",
            //   "company_name": "Arete Brains Pvt Ltd",
            //   "company_address": "Office no 205, gran exito, above axis bank, b.t. kawade rord, ghorpadi, pune-411001. Registered Office : House no 205, shewalewadi, datta chowk, near grampanchayat office, hadpsar pune-412307.",
            //   "employee_id": "ARETE001",
            //   "designation": "Software Engineer",
            //   "ctc": "700000",
            //   "from_date": "2022-05-01",
            //   "to_date": "2023-11-30",
            //   "reson_for_leaving": "Shivam's decision to leave Arete brains Pvt Ltd. ",
            //   "referenceNumber": "File3e9f96db286e44137985c42aaadd8b99",
            //   "filePath": "/home/anil/env-user/acheck-files/File3e9f96db286e44137985c42aaadd8b99_aiqod.com3_Service_shivam.shewale.experience.letter.pdf",
            //   "documentStatus": "DataEntry_Complete",
            //   "imageFilePath": "/home/anil/env-user/acheck-files/File3e9f96db286e44137985c42aaadd8b99_aiqod_com3_Service_shivam_shewale_experience_letter-1.jpg"
            // },
            // {
            //   "_id": "6839afdd1c46e228987cd958",
            //   "company_name": "New Tech Corp",
            //   "company_address": "456 Innovation Drive, Tech City",
            //   "employee_id": "NTC005",
            //   "designation": "Senior Software Engineer",
            //   "ctc": "900000",
            //   "from_date": "2024-01-15",
            //   "to_date": "Present",
            //   "reson_for_leaving": "N/A",
            //   "referenceNumber": "File3e9f96db286e44137985c42aaadd8b99_2",
            //   "filePath": "/home/anil/env-user/acheck-files/File3e9f96db286e44137985c42aaadd8b99_aiqod.com3_Service_shivam.shewale.experience.letter.pdf",
            //   "documentStatus": "Approved",
            //   "imageFilePath": "/home/anil/env-user/acheck-files/File3e9f96db286e44137985c42aaadd8b99_aiqod_com3_Service_shivam_shewale_experience_letter-1.jpg"
            // }
          ]
        },
        {
          "Previous Employment Details": [
            {
              "Name of Employer": "Old Gen Co.",
              "Address of Employer": "789 Legacy Lane, Old Town",
              "Telephone No": "555-000-1111",
              "Employee Code/No": "OGC001",
              "Designation": "Junior Developer",
              "Department": "Software",
              "Employment Period": "2018-06-01 to 2019-12-31",
              "From": "2018-06-01",
              "To": "2019-12-31",
              "Manager's Name": "Jane Smith",
              "Manager's Contact No": "555-222-3333",
              "Manager's Email ID": "jane.smith@oldgenco.com",
              "Duties & Responsibilities": "Basic coding tasks, bug fixing.",
              "Reasons for leaving": "Better opportunities",
              "First Salary drawn": "30,000",
              "Was this Position": "Contract",
              "Agency Details": "RecruitFast",
              "Last Salary drawn": "45,000",
              "Please tick mark the documents submitted for this employment": "Experience Certificate",
              "imageFilePath": "/home/anil/env-user/acheck-files/File1096b9058634d0c7e5f9ce15707fcd6d_aiqod_com1_BGV_ShivamS-1.jpg",
              "filePath": "/home/anil/env-user/acheck-files/File1096b9058634d0c7e5f9ce15707fcd6d_aiqod.com1_BGV_ShivamS.pdf",
              "referenceNumber": "File1096b9058634d0c7e5f9ce15707fcd6d"
            }
          ],
          "keys": [
            "Name of Employer",
            "Address of Employer",
            "Telephone No",
            "Employee Code/No",
            "Designation",
            "Department",
            "Employment Period",
            "From",
            "To",
            "Manager's Name",
            "Manager's Contact No",
            "Manager's Email ID",
            "Duties & Responsibilities",
            "Reasons for leaving",
            "First Salary drawn",
            "Was this Position",
            "Agency Details",
            "Last Salary drawn",
            "Please tick mark the documents submitted for this employment"
          ]
        }
      ]
    };

    this.BGVData = newJson.data[0].BGV;

    this.personalInfo = {
      'Candidate Name (First, Middle, Last)': 'John Doe',
      'Date of Birth': '1990-05-20',
      'Gender': 'Male',
      "Father's Name": 'Richard Doe',
      'Contact number with Country code': '+1 555-123-4567',
      'Email ID': 'john.doe@example.com',
      'LOA/ Consent Form': 'Signed'
    };

    this.statusDetailDocument = {};
    this.jsonKeys = {};
    this.jsonData = {};
    this.categorizedDocuments = {};
    let statusComponentTabSet = new Set<string>();
    let documentCategoryTabSet = new Set<string>();

    const processMultiTableEntry = (tableEntry: any) => {
      const categoryName = Object.keys(tableEntry).find(key => key !== 'keys') || '';
      const documents = tableEntry[categoryName];
      const keys = tableEntry.keys;

      let mappedStatusCategoryName: string;
      let mappedDocumentCategoryName: string;

      if (categoryName === "Education Details") {
        mappedStatusCategoryName = "Education_Documents";
        mappedDocumentCategoryName = "Education";
      } else if (categoryName.includes("Employment Details")) {
        mappedStatusCategoryName = "Employment_Documents";
        mappedDocumentCategoryName = "Employment";
      } else if (categoryName === "Reference Details") {
        mappedStatusCategoryName = "Reference_Documents";
        mappedDocumentCategoryName = "Reference Details";
      } else if (categoryName === "Bank Statement") {
        mappedStatusCategoryName = "Bank_Statement_Documents";
        mappedDocumentCategoryName = "Bank Statement";
      } else if (categoryName === "POI AND POA") {
        mappedStatusCategoryName = "Proof_Of_Identication/Address_Documents";
        mappedDocumentCategoryName = "POI AND POA";
      } else {
        mappedStatusCategoryName = categoryName.replace(/\s/g, '_');
        mappedDocumentCategoryName = categoryName;
      }

      statusComponentTabSet.add(mappedStatusCategoryName);
      documentCategoryTabSet.add(mappedDocumentCategoryName);

      this.jsonKeys[mappedStatusCategoryName] = keys;
      this.jsonData[mappedStatusCategoryName] = {};
      keys.forEach((key: string) => {
        this.jsonData[mappedStatusCategoryName][key] = key;
      });

      if (!this.statusDetailDocument[mappedStatusCategoryName]) {
        this.statusDetailDocument[mappedStatusCategoryName] = [];
      }

      if (mappedDocumentCategoryName === "Employment") {
        if (!(this.categorizedDocuments[mappedDocumentCategoryName] instanceof Object) || Array.isArray(this.categorizedDocuments[mappedDocumentCategoryName])) {
          this.categorizedDocuments[mappedDocumentCategoryName] = {};
        }
        if (!(this.categorizedDocuments[mappedDocumentCategoryName] as any)[categoryName]) {
          (this.categorizedDocuments[mappedDocumentCategoryName] as any)[categoryName] = [];
        }
      } else {
        if (!Array.isArray(this.categorizedDocuments[mappedDocumentCategoryName])) {
          this.categorizedDocuments[mappedDocumentCategoryName] = [];
        }
      }

      documents.forEach((doc: any, index: number) => {
        const imageUrls = [];
        if (doc.imageFilePath) {
          const fileName = doc.imageFilePath.split('/').pop();
          imageUrls.push(`https://placehold.co/600x800/28a745/ffffff?text=${fileName}`);
        } else {
          imageUrls.push('https://placehold.co/600x800/808080/ffffff?text=No+Image');
        }

        const documentStatus = doc.documentStatus || 'Pending';
        const uniqueId = doc.referenceNumber || doc._id || `doc_${Math.random().toString(36).substring(2, 9)}`;
        const docDisplayName = `${categoryName}${documents.length > 1 ? ` #${index + 1}` : ''}`;

        this.statusDetailDocument[mappedStatusCategoryName].push({
          BGV: this.BGVData,
          data: {
            ...doc,
            _id: uniqueId,
            imageUrls: imageUrls,
            documentStatus: documentStatus,
            documentType: docDisplayName,
          }
        });

        const docToAdd = {
          ...doc,
          _uniqueId: uniqueId,
          documentType: docDisplayName,
          imageUrls: imageUrls,
          documentStatus: documentStatus,
          originalCategory: categoryName,
          _tableKeys: keys
        };

        if (mappedDocumentCategoryName === "Employment") {
          (this.categorizedDocuments[mappedDocumentCategoryName] as any)[categoryName].push(docToAdd);
        } else {
          (this.categorizedDocuments[mappedDocumentCategoryName] as any[]).push(docToAdd);
        }
      });
    };

    const multiTable = this.BGVData && this.BGVData.multiTable ? this.BGVData.multiTable : [];
    multiTable.forEach(processMultiTableEntry);

    const topLevelEmploymentBlock = newJson.data[1];
    if (topLevelEmploymentBlock && topLevelEmploymentBlock.Employment) {
      const topLevelEmploymentDocuments = topLevelEmploymentBlock.Employment;
      const topLevelEmploymentKeys = Object.keys(topLevelEmploymentDocuments[0] || {}).filter(key => !['filePath', 'imageFilePath', '_id', 'referenceNumber', 'documentStatus'].includes(key));

      const categoryName = "Current Employment Details";
      const mappedStatusCategoryName = "Employment_Documents";
      const mappedDocumentCategoryName = "Employment";

      statusComponentTabSet.add(mappedStatusCategoryName);
      documentCategoryTabSet.add(mappedDocumentCategoryName);

      if (!this.jsonKeys[mappedStatusCategoryName]) {
        this.jsonKeys[mappedStatusCategoryName] = topLevelEmploymentKeys;
        this.jsonData[mappedStatusCategoryName] = {};
        topLevelEmploymentKeys.forEach(key => this.jsonData[mappedStatusCategoryName][key] = key);
      }

      if (!this.statusDetailDocument[mappedStatusCategoryName]) {
        this.statusDetailDocument[mappedStatusCategoryName] = [];
      }

      if (!(this.categorizedDocuments[mappedDocumentCategoryName] instanceof Object) || Array.isArray(this.categorizedDocuments[mappedDocumentCategoryName])) {
        this.categorizedDocuments[mappedDocumentCategoryName] = {};
      }
      if (!(this.categorizedDocuments[mappedDocumentCategoryName] as any)[categoryName]) {
        (this.categorizedDocuments[mappedDocumentCategoryName] as any)[categoryName] = [];
      }

      topLevelEmploymentDocuments.forEach((empDoc: any, index: number) => {
        const imageUrls = [];
        if (empDoc.imageFilePath) {
          const fileName = empDoc.imageFilePath.split('/').pop();
          imageUrls.push(`https://placehold.co/600x800/FFA500/FFFFFF?text=${fileName}`);
        } else {
          imageUrls.push('https://placehold.co/600x800/808080/ffffff?text=No+Image');
        }

        const documentStatus = empDoc.documentStatus || 'Pending';
        const uniqueId = empDoc.referenceNumber || empDoc._id || `doc_${Math.random().toString(36).substring(2, 9)}`;
        const docDisplayName = `${categoryName}${topLevelEmploymentDocuments.length > 1 ? ` #${index + 1}` : ''}`;

        const docToAdd = {
          ...empDoc,
          _uniqueId: uniqueId,
          documentType: docDisplayName,
          imageUrls: imageUrls,
          documentStatus: documentStatus,
          originalCategory: categoryName,
          _tableKeys: topLevelEmploymentKeys // Ensure _tableKeys are set
        };

        (this.categorizedDocuments[mappedDocumentCategoryName] as any)[categoryName].push(docToAdd);
        this.statusDetailDocument[mappedStatusCategoryName].push({
          BGV: this.BGVData,
          data: {
            ...empDoc,
            _id: uniqueId,
            imageUrls: imageUrls,
            documentStatus: documentStatus,
            documentType: docDisplayName,
          }
        });
      });
    }

    const prevEmploymentBlock = newJson.data[2];
    if (prevEmploymentBlock && prevEmploymentBlock["Previous Employment Details"]) {
      const prevEmploymentDocuments = prevEmploymentBlock["Previous Employment Details"];
      const prevEmploymentKeys = Object.keys(prevEmploymentDocuments[0] || {}).filter(key => !['filePath', 'imageFilePath', '_id', 'referenceNumber', 'documentStatus'].includes(key));

      const categoryName = "Previous Employment Details";
      const mappedStatusCategoryName = "Employment_Documents";
      const mappedDocumentCategoryName = "Employment";

      statusComponentTabSet.add(mappedStatusCategoryName);
      documentCategoryTabSet.add(mappedDocumentCategoryName);

      if (!this.jsonKeys[mappedStatusCategoryName]) {
        this.jsonKeys[mappedStatusCategoryName] = prevEmploymentKeys;
        this.jsonData[mappedStatusCategoryName] = {};
        prevEmploymentKeys.forEach(key => this.jsonData[mappedStatusCategoryName][key] = key);
      }

      if (!this.statusDetailDocument[mappedStatusCategoryName]) {
        this.statusDetailDocument[mappedStatusCategoryName] = [];
      }

      if (!(this.categorizedDocuments[mappedDocumentCategoryName] instanceof Object) || Array.isArray(this.categorizedDocuments[mappedDocumentCategoryName])) {
        this.categorizedDocuments[mappedDocumentCategoryName] = {};
      }
      if (!(this.categorizedDocuments[mappedDocumentCategoryName] as any)[categoryName]) {
        (this.categorizedDocuments[mappedDocumentCategoryName] as any)[categoryName] = [];
      }

      prevEmploymentDocuments.forEach((prevEmpDoc: any, index: number) => {
        const imageUrls = [];
        if (prevEmpDoc.imageFilePath) {
          const fileName = prevEmpDoc.imageFilePath.split('/').pop();
          imageUrls.push(`https://placehold.co/600x800/FFD700/000000?text=${fileName}`);
        } else {
          imageUrls.push('https://placehold.co/600x800/808080/ffffff?text=No+Image');
        }

        const documentStatus = prevEmpDoc.documentStatus || 'Pending';
        const uniqueId = prevEmpDoc.referenceNumber || prevEmpDoc._id || `doc_${Math.random().toString(36).substring(2, 9)}`;
        const docDisplayName = `${categoryName}${prevEmploymentDocuments.length > 1 ? ` #${index + 1}` : ''}`;

        const docToAdd = {
          ...prevEmpDoc,
          _uniqueId: uniqueId,
          documentType: docDisplayName,
          imageUrls: imageUrls,
          documentStatus: documentStatus,
          originalCategory: categoryName,
          _tableKeys: prevEmploymentKeys // Ensure _tableKeys are set
        };

        (this.categorizedDocuments[mappedDocumentCategoryName] as any)[categoryName].push(docToAdd);
        this.statusDetailDocument[mappedStatusCategoryName].push({
          BGV: this.BGVData,
          data: {
            ...prevEmpDoc,
            _id: uniqueId,
            imageUrls: imageUrls,
            documentStatus: documentStatus,
            documentType: docDisplayName,
          }
        });
      });
    }

    this.ComponentTab = Array.from(statusComponentTabSet);
    this.statusDocument = this.ComponentTab;
    this.statusHeader = this.ComponentTab;

    this.documentCategories = Array.from(documentCategoryTabSet);
    this.documentCategories.sort();

    this.selectedCategory = '';
    this.documentsInSelectedCategory = [];
    this.selectedDocumentForTable = null;

    this.statusData = { status: [] };
    this.ComponentTab.forEach((tabName: string) => {
      let approveCount = 0;
      let pendingCount = 0;
      let rejectCount = 0;
      const docs = this.statusDetailDocument[tabName] || [];
      docs.forEach((item: any) => {
        if (item.data.documentStatus === 'Approved' || item.data.documentStatus === 'Reconciliation_Approved' || item.data.documentStatus === 'DataEntry_Complete') {
          approveCount++;
        } else if (item.data.documentStatus === 'Reject') {
          rejectCount++;
        } else {
          pendingCount++;
        }
      });
      const statusObj: { [key: string]: any[] } = {};
      statusObj[tabName] = [{ Approve: approveCount, Pending: pendingCount, Reject: rejectCount }];
      this.statusData.status.push(statusObj);
    });

    this.dmsDocList = ['dummyDoc1', 'dummyDoc2'];
    this.verification_flow = false;
    sessionStorage.setItem('ongoback', 'true');

    this.statusHeader = Array.from(statusComponentTabSet);
    this.statusDocument = this.statusHeader;
    this.documentCategories.sort();
    this.statusHeader.sort();
  }

  // Helper to get entries for rendering Case Details (for template)
  getCaseDetailsEntries(): { key: string; value: string }[] {
    if (!this.BGVData) return [];
    return Object.entries(this.BGVData).map(([key, value]) => ({
      key,
      value: (key.includes('Date') && value)
        ? new Date(value as string).toLocaleString()
        : (value === undefined || value === null)
          ? 'N/A'
          : (typeof value === 'object' ? JSON.stringify(value) : String(value))
    }));
  }

  // Helper to get entries for rendering Personal Information (for template)
  getPersonalInfoEntries(): { key: string; value: string }[] {
    if (!this.personalInfo) return [];
    return Object.entries(this.personalInfo).map(([key, value]) => ({
      key,
      value: value !== undefined && value !== null ? String(value) : 'N/A'
    }));
  }

  // Selects a tab and prepares data for rendering
  selectTabVTS(index: number) {
    this.selectedTabIndexP = index;
    const selectedTabName = this.documentCategories[index];
    this.selectedCategory = selectedTabName;

    this.documentTableData = []; // Clear previous single table data
    this.currentEmploymentDocs = []; // Clear previous employment data
    this.previousEmploymentDocs = []; // Clear previous employment data

    if (selectedTabName === "Employment") {
      const employmentData = this.categorizedDocuments["Employment"] as { [subCategory: string]: any[] };
      this.currentEmploymentDocs = employmentData && employmentData["Current Employment Details"] ? employmentData["Current Employment Details"] : [];
      this.previousEmploymentDocs = employmentData && employmentData["Previous Employment Details"] ? employmentData["Previous Employment Details"] : [];
    } else {
      this.documentTableData = (this.categorizedDocuments[selectedTabName] as any[]) || [];
    }
  }

  // Helper methods
  mapToStatusName(tabName: string): string {
    switch (tabName) {
      case 'Education':
        return 'Education_Documents';
      case 'Employment':
        return 'Employment_Documents';
      case 'Reference Details':
        return 'Reference_Documents';
      case 'Supervisor':
        return 'Supervisor_Documents';
      case 'POI AND POA':
        return 'Proof_Of_Identication/Address_Documents';
      default:
        return tabName.replace(/\s+/g, '_');
    }
  }

  formatKey(key: string): string {
    const formatted = key
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }

  /**
   * Retrieves a specific BGV field value for a given document.
   * This is used when rendering the BGV row in the comparison table.
   * @param doc The current document object from the table's *ngFor loop.
   * @param fieldKey The key of the field to retrieve from the BGV data.
   * @returns The value of the BGV field, or 'N/A' if not found or empty.
   */
  getBGVValueForField(doc: any, fieldKey: string): any {
    if (!this.BGVData || !doc || !doc.originalCategory || !fieldKey) return 'N/A'; // Changed to 'N/A'

    const findMatchingBGVEntry = (categoryKey: string, docToMatch: any, matchKeys: string[]) => {
      const multiTableEntry = this.BGVData.multiTable?.find((entry: any) => Object.keys(entry).includes(categoryKey));
      if (multiTableEntry && Array.isArray(multiTableEntry[categoryKey]) && multiTableEntry[categoryKey].length > 0) {
        const found = multiTableEntry[categoryKey].find((bgvDoc: any) => {
          return matchKeys.every(key => {
            const docVal = String(docToMatch[key] || '').toLowerCase().trim();
            const bgvVal = String(bgvDoc[key] || '').toLowerCase().trim();
            return docVal === bgvVal && docVal !== '';
          });
        });
        return found || multiTableEntry[categoryKey][0]; // Fallback to first if no precise match
      }
      return null;
    };

    let relevantBGVData: any = null;

    switch (doc.originalCategory) {
      case 'Education Details':
        relevantBGVData = findMatchingBGVEntry(
          'Education Details',
          doc,
          ['College Name & Address', 'Year of Passing']
        );
        break;
      case 'Current Employment Details':
        relevantBGVData = findMatchingBGVEntry(
          'Current Employment Details',
          doc,
          ['Name of Current Employer', 'From']
        );
        break;
      case 'Previous Employment Details':
        relevantBGVData = findMatchingBGVEntry(
          'Previous Employment Details',
          doc,
          ['Name of Employer', 'From']
        );
        break;
      case 'Reference Details':
        relevantBGVData = findMatchingBGVEntry(
          'Reference Details',
          doc,
          ['Name & Position held', 'Contact Number']
        );
        break;
      case 'POI AND POA':
      case 'Bank Statement':
        // For these categories, BGV data is typically at the top level or requires specific handling
        // For now, return relevant data directly from BGVData if the field exists there
        const topLevelValue = this.BGVData[fieldKey];
        return (topLevelValue !== undefined && topLevelValue !== null && topLevelValue !== '') ? topLevelValue : 'N/A'; // Changed to 'N/A'
      default:
        // Fallback for general BGV fields if not specifically handled in multiTable
        const defaultValue = this.BGVData[fieldKey];
        return (defaultValue !== undefined && defaultValue !== null && defaultValue !== '') ? defaultValue : 'N/A'; // Changed to 'N/A'
    }

    // If relevantBGVData was found for a multi-table entry, return the specific field
    if (relevantBGVData) {
      const value = relevantBGVData[fieldKey];
      return (value !== undefined && value !== null && value !== '') ? value : 'N/A'; // Changed to 'N/A'
    }

    // Fallback if no specific multiTable entry or match was found
    const fallbackValue = this.BGVData[fieldKey];
    return (fallbackValue !== undefined && fallbackValue !== null && fallbackValue !== '') ? fallbackValue : 'N/A'; // Changed to 'N/A'
  }

  /**
   * Determines if a given field should be included in the similarity comparison.
   * @param key The field key.
   * @param category The original category of the document.
   * @returns True if the field should be compared, false otherwise.
   */
  isFieldForComparison(key: string, category: string): boolean {
    const commonComparisonFields = ['Designation', 'From', 'To'];
    const educationComparisonFields = ['College Name & Address', 'Qualification Gained', 'Year of Passing'];
    const referenceComparisonFields = ['Name & Position held', 'Contact Number'];

    if (category.includes('Employment')) {
      return commonComparisonFields.includes(key);
    } else if (category === 'Education Details') {
      return educationComparisonFields.includes(key);
    } else if (category === 'Reference Details') {
        return referenceComparisonFields.includes(key);
    }
    // Add other categories and their relevant comparison fields as needed
    return false; // Default to not compare
  }


  findSimilarity(data1: any, data2: any): string {
    if (data1 === data2) return '100%';
    if (!data1 || !data2) return '0%';
    const str1 = String(data1).toLowerCase();
    const str2 = String(data2).toLowerCase();

    let matches = 0;
    const minLength = Math.min(str1.length, str2.length);
    for (let i = 0; i < minLength; i++) {
      if (str1[i] === str2[i]) {
        matches++;
      }
    }
    return `${((matches / Math.max(str1.length, str2.length)) * 100).toFixed(0)}%`;
  }

  getRelevantKeys(doc: any): string[] {
    if (doc && doc._tableKeys) {
      // These are strictly internal or metadata keys that should never be displayed as table columns.
      // All other keys from _tableKeys, which represent actual data, will now be included.
      const excludeKeys = [
        '_id', 'id', '_uniqueId', 'checked', 'createdAt', 'fileRefNum', 'fileName',
        'imageUrls', 'croppedFields', 'multiTable', 'ocrConfidence', 'model', 'avgPrediction',
        "documentTitle", "subDocumentType", "filePath", "flow", "invoiceItems", "masterObj", "oPred",
        "pageLimit", "prediction", "subscriberId", "tableConfidence", "tableCordinates", "tableEnd",
        "tableStart", "table_headers", "templateId", "templateName", "Vendor_Name", "candidateKey",
        "documentStatus", "DocumentLevelError", "deptId", "error", "inputId", "invoiceItemsNew",
        "mlCorrection", "ocrCorrection", "roleId", "tally_status", "userId", "user_status",
        'originalCategory', 'keys', 'referenceNumber'
      ];

      // Return only keys that should be displayed as columns in the table
      return doc._tableKeys.filter((key: string) => !excludeKeys.includes(key));
    }
    return [];
  }

  // Dummy methods (kept for compatibility, no actual functionality here)
  insufficiencyfilterDropdown(event: any, cat: any) { console.log('insufficiencyfilterDropdown called (dummy)'); }
  showTab(tabName: string): boolean {
    if (this.documentCategories && this.selectedTabIndexP !== undefined && this.selectedTabIndexP >= 0 && this.selectedTabIndexP < this.documentCategories.length) {
      return this.documentCategories[this.selectedTabIndexP] === tabName;
    }
    return false;
  }
  onChangePage(pageOfItems: any[]) { console.log('onChangePage called (dummy)'); }
  getSelectedTabData() { console.log('getSelectedTabData called (dummy)'); return null; }
  updateDocument(docType: string, status: string, data: any, isMain: boolean) { console.log('updateDocument called (dummy)'); }
  updatecomponentDocument(headS: string, status: string, BGVData: any) { console.log('updatecomponentDocument called (dummy)'); }
  openPopup(event: any, item: any, callback: Function, args: any[]) { alert('Are you sure you want to proceed with this action? (This is a dummy alert)'); }
  displayPreview(template: any, id: string, data: any, modalSize: string) { alert('Preview not implemented in this version.'); }
  disableFlags(data: any): boolean { return data.documentStatus === 'Reconciliation_Approved' || data.documentStatus === 'Reject'; }
  showTable(): void { console.log('showTable called (dummy)'); }
  hideTable(): void { console.log('hideTable called (dummy)'); }
  onErrorMsg(): void { this.showErrorMsg = true; console.error('Error loading document preview.'); }
  updateStatusCounts() { console.log('updateStatusCounts called (dummy)'); }
  sleep(ms: number) { return new Promise(resolve => setTimeout(resolve, ms)); }
  delay(ms: number) { return new Promise((resolve) => setTimeout(resolve, ms)); }
  cancelCopy() { alert('Cancel clicked. (Dummy)'); }
  openModal(template: any) { alert('Modal opened. (Dummy)'); }
}
