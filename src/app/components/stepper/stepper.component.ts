import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { IUser } from '../../models/iuser';
import { environment } from '../../../environments/environment';
import { ServicesService } from '../../services/services.service';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-stepper',
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
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.css'],
})
export class StepperComponent implements OnInit {
  doc: GoogleSpreadsheet;
  service = inject(ServicesService);
  displayedColumns = ['name', 'last_name', 'email', 'actions'];
  title: string = '';
  cell: string = '';
  listedUsers: any;
  updateBoolDisplay = this.service.updateBoolDisplay;
  selectedUser: any = null;
  selectedIndex: any = null;

  formAddUser = new FormGroup({
    name: new FormControl('', [Validators.required]),
    last_name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
  });

  allUsers = this.service.allUsers;

  constructor(private router: Router) {
    this.doc = new GoogleSpreadsheet(environment.GOOGLE_SHEETS_DOCUMENT_ID, {
      apiKey: environment.api_key,
    });
  }

  async ngOnInit() {
    try {
      this.cell = await this.service.getCellByGrid(1, 1);
      await this.service.getRowByNumberAndHeader(1, 'email');
      this.title = await this.service.getSheetTitle();
      this.listedUsers = await this.service.getAllRowData();
      this.service.getAllUsers();

      this.allUsers.set(this.listedUsers);
    } catch (error) {
      console.error('Error accessing Google Sheets:', error);
    }
  }

  onSubmit() {
    if (this.formAddUser?.valid) {
      // console.log("Selected users:", this.selectedUser);
  
      const { name = '', last_name = '', email = '' } = this.formAddUser.value as {
        name: string;
        last_name: string;
        email: string;
      };
  
      if (!name || !last_name || !email) {
        // Display an error message to the user
        console.error('Please fill in all fields');
        return;
      }

      console.log("Form value:", this.formAddUser.value);
      console.log("Selected index:", this.selectedIndex);
  
      this.service?.insertUser(name, last_name, email).subscribe({
        next: (res) => {
          console.log("User added successfully", res);
          this.service?.getAllUsers();
        },
        error: (error) => {
          console.log('Error adding user:', error);
        },
      });
    } else {
      console.error("Form is invalid. Please complete all fields.");
    }
  }
  
}