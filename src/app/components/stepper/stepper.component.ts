import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
<<<<<<< HEAD
  ReactiveFormsModule,
  Validators,
=======
  Validators,
  ReactiveFormsModule,
>>>>>>> origin/headerAndStyling
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { ServicesService } from '../../services/services.service';

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [
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
  stepperForm: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
<<<<<<< HEAD
    private service: ServicesService,
=======
    private service: ServicesService
>>>>>>> origin/headerAndStyling
  ) {
    this.stepperForm = this._formBuilder.group({
      step1: ['', Validators.required],
      step2: ['', Validators.required],
      step3: ['', Validators.required],
    });
  }

  async ngOnInit() {
    try {
      await this.loadGoogleSheetsData();
    } catch (error) {
      console.error('Error loading Google Sheets data:', error);
    }
  }

  async loadGoogleSheetsData() {
    try {
      // Fetch the row data that corresponds to the steps
      const data = await this.service.getAllRowData();

      if (data.length >= 3) {
        this.stepperForm.patchValue({
          step1: data[0]?.name || '',
          step2: data[1]?.last_name || '',
          step3: data[2]?.email || '',
        });
      } else {
        console.error(
<<<<<<< HEAD
          'Insufficient data from Google Sheets to populate the stepper.',
=======
          'Insufficient data from Google Sheets to populate the stepper.'
>>>>>>> origin/headerAndStyling
        );
      }
    } catch (error) {
      console.error('Error fetching data from Google Sheets:', error);
    }
  }

  // async onSubmit() {
  //   if (this.stepperForm.valid) {
  //     this.service.addRowToSheet({
  //       name: this.stepperForm.value.step1,
  //       last_name: this.stepperForm.value.step2,
  //       email: this.stepperForm.value.step3,
  //     }).subscribe({
  //       next: (result) => {
  //         console.log('Row successfully added:', result);
  //       },
  //       error: (error) => {
  //         console.error('Error adding row:', error);
  //       }
  //     });      
  //   } else {
  //     console.error('Form is invalid. Please complete all steps.');
  //   }
  // }
  

  async onSubmit() {
    console.log(this.selectedUser);



    let { name = "", last_name = "", email = "" } = this.stepperForm.value as { name: string, last_name: string, email: string };

    console.log(this.formAddUser.value);
    console.log(this.selectedIndex);

    this.service.insertUser( name, last_name, email).subscribe({
      next: (res) => {

        console.log(res);
        this.service.getAllUsers()

      },
      error: (error) => {

        console.log(error);

      }
    })

  }


}
