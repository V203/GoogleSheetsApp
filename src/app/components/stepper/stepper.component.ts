import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { CommonModule } from '@angular/common';
import { ServicesService } from '../../services/services.service';

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [MatStepperModule, MatFormFieldModule, MatInputModule, MatButtonModule, CommonModule, ReactiveFormsModule],
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.css']
})
export class StepperComponent implements OnInit {

  stepperForm: FormGroup;

  constructor(private _formBuilder: FormBuilder, private service: ServicesService) {
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
          step2: data[1]?.name || '',
          step3: data[2]?.name || '',
        });
      } else {
        console.error('Insufficient data from Google Sheets to populate the stepper.');
      }
    } catch (error) {
      console.error('Error fetching data from Google Sheets:', error);
    }
  }

  onSubmit() {
    if (this.stepperForm.valid) {
      console.log('Stepper data submitted:', this.stepperForm.value);
      // Additional logic for when the form is submitted and the process is complete
    } else {
      console.error('Form is invalid. Please complete all steps.');
    }
  }
}
