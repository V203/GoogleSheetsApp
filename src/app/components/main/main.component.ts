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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HeaderComponent } from "../header/header.component";
import { SpinnerComponent } from '../spinner/spinner.component';
import { ListUsersComponent } from '../list-users/list-users.component';


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
    MatProgressSpinnerModule,
    HeaderComponent,
    SpinnerComponent,
    ListUsersComponent
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
  listedUsers: any;
  updateBoolDisplay = this.service.updateBoolDisplay;
  selectedUser: any = null
  selectedIndex: any = null
  loading = false


  formUpdate = new FormGroup({
    name: new FormControl<string>(this.selectedUser ? this.selectedUser.name : ""),
    last_name: new FormControl<string>(this.selectedUser ? this.selectedUser.last_name : ""),
    email: new FormControl<string>(this.selectedUser ? this.selectedUser.email : ""),
  });

  formAddUser = new FormGroup(
    {
      name: new FormControl("", [Validators.required]),
      last_name: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.required]),
    }
  )

  allUsers = this.service.allUsers

  constructor(private router: Router) {
    this.doc = new GoogleSpreadsheet(environment.GOOGLE_SHEETS_DOCUMENT_ID, { apiKey: environment.api_key });
  }

  async ngOnInit() {

    try {


      this.cell = await this.service.getCellByGrid(1, 1)
      await this.service.getRowByNumberAndHeader(1, "email");
      this.title = await this.service.getSheetTitle();
      this.listedUsers = await this.service.getAllRowData()
      this.service.getAllUsers();

      this.allUsers.set(this.listedUsers)

    } catch (error) {
      console.error('Error accessing Google Sheets:', error);
    }
  };

  deleteUser(id: number) {
    this.loading = true
    this.service.deleteUser(id).subscribe({

      next: (res) => {

        console.log(res);
        this.service.getAllUsers();
        this.loading = false

        if (res) {

          this.router.navigate(["/"])

        }

      }
    })
  };


  // toggleBoolDisplay() {
  //   this.updateBoolDisplay.set(!this.updateBoolDisplay())

  // };

  // fectSelctedUser(person: IUser, index: number) {
  //   this.selectedUser = person;
  //   // console.log(person);
  //   // console.log(this.selectedUser);
  //   this.selectedIndex = index;
  //   this.formUpdate.setValue (
  //     {
  //       name: person.name,
  //       last_name: person.last_name,
  //       email : person.email
  //     } )
  // };


  // onSubmitUpateUser() {
  //   this.loading = true
    
  //   console.log(this.selectedUser);
  //   let { name = "", last_name = "", email = "" } = this.formUpdate.value as { name: string, last_name: string, email: string };

  //   this.service.updateUser(this.selectedIndex, name, last_name, email).subscribe({
  //     next: (res) => {

  //       console.log(res);
  //       this.service.getAllUsers()
  //       this.loading = false
  //     },
  //     error: (error) => {

  //       console.log(error);

  //     }
  //   })

  //   this.selectedUser = null
  //   this.service.getAllUsers()

  // }

  onSubmitAddUser() {
    let { name = "", last_name = "", email = "" } = this.formAddUser.value as { name: string, last_name: string, email: string };
    this.loading = true
    this.service.insertUser(name, last_name, email).subscribe({
      next: (res) => {

        console.log(res);
        this.service.getAllUsers()
        this.loading = false
      },
      error: (error) => {

        console.log(error);

      }
    })
  }
};
