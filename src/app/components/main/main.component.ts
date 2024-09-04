import { Component, inject, OnInit } from '@angular/core';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { ServicesService } from '../../services/services.service';
import { environment } from '../../../environments/environment';
import { CommonModule, NgFor } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { IUser } from '../../models/iuser';


@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    NgFor,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    NgIf,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  doc: GoogleSpreadsheet;

  service = inject(ServicesService);
  displayedColumns = ["name", "last_name", "email", "actions"];
  title: string = "";
  cell: string = "";
  arrayOfData: any;
  updateBoolDisplay = this.service.updateBoolDisplay;
  selectedUser:any = null
  selectedIndex:any = null
  
  
  formUpdate = new FormGroup({
    name: new FormControl<string>(''),
    last_name: new FormControl<string>(''),
    email: new FormControl<string>(''),
  })
  constructor(private router: Router) {
    this.doc = new GoogleSpreadsheet(environment.GOOGLE_SHEETS_DOCUMENT_ID, { apiKey: environment.api_key });

  }

  async ngOnInit() {
   
    try {

      // this.service.insertUser("Maven uodated", "Pain", "jgjgj@mp.co.za").subscribe(
      //   {
      //   next:(res)=> {
  
      //     if(res){
      //       console.log(res);
      //     }
      //   },error:(error) =>{
      //     if(error){
      //       console.log(error);
      //             }
      //   } 
      // });
     
      console.log(this.updateBoolDisplay());
      this.cell = await this.service.getCellByGrid(1, 1)
      await this.service.getRowByNumberAndHeader(1, "email");
      this.title = await this.service.getSheetTitle();
      this.arrayOfData = await this.service.getAllRowData()
   



    } catch (error) {
      console.error('Error accessing Google Sheets:', error);
    }
  };

  deleteUser(id: number) {

    this.service.deleteUser(id).subscribe({
      next: (res) => {
        console.log(res);
        if (res) {
          this.router.navigate(["/"])

        }

      }
    })
  };


  toggleBoolDisplay() {
    this.updateBoolDisplay.set(!this.updateBoolDisplay())

  }

  toggleBoolDisplayV2(person:IUser,index:number) {
    this.selectedUser = person;
    this.selectedIndex = index
    
    
    // this.updateBoolDisplay.set(!this.updateBoolDisplay())

  }


  onSubmit(){
    console.log(this.selectedUser);

    

    let {name="",last_name="",email=""} = this.formUpdate.value as { name: string, last_name: string, email: string }
  console.log(this.formUpdate.value);
  console.log(this.selectedIndex);
  
    this.service.updateUser(this.selectedIndex,name,last_name,email).subscribe({
      next: (res)=> {
        console.log(res);
        
      },
      error : (error)=> {
        console.log(error);
        
      }
    })
    this.selectedUser = null
    
  }



};
