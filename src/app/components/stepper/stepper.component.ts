import { Component, OnInit } from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { gapi } from 'gapi-script';

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [MatStepperModule, MatFormFieldModule, MatInputModule, MatButtonModule, CommonModule, ReactiveFormsModule],
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.css']
})
export class StepperComponent implements OnInit {
  stepperForm: FormGroup;
  stepData: string[] = [];

  constructor(private _formBuilder: FormBuilder) {
    this.stepperForm = this._formBuilder.group({
      step1: [''],
      step2: [''],
      step3: ['']
    });
  }

  ngOnInit() {
    this.loadGoogleSheetsData();
  }

  loadGoogleSheetsData() {
    // Initialize the Google API client and load data from the Google Sheet
    gapi.load('client', () => {
      gapi.client.init({
        apiKey: 'YOUR_API_KEY',
        discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4']
      }).then(() => {
        return gapi.client.sheets.spreadsheets.values.get({
          spreadsheetId: 'YOUR_SPREADSHEET_ID',
          range: 'Sheet1!A1:C1',
        });
      }).then((response: any) => {
        this.stepData = response.result.values[0];
        this.stepperForm.patchValue({
          step1: this.stepData[0],
          step2: this.stepData[1],
          step3: this.stepData[2],
        });
      }, (error: any) => {
        console.error('Error loading data from Google Sheets', error);
      });
    });
  }

  onSubmit() {
    console.log("Stepper data submitted:", this.stepperForm.value);
    // Additional logic for when the process is complete
  }
}
