import { Component, OnInit } from '@angular/core';
import { GoogleSpreadsheet } from 'google-spreadsheet';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-main',
  standalone: true,
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  doc: GoogleSpreadsheet;

  constructor() {
    
    this.doc = new GoogleSpreadsheet(environment.GOOGLE_SHEETS_DOCUMENT_ID, { apiKey: environment.api_key });
  }



  async ngOnInit() {
    try {

      await this.doc.loadInfo();

      // Log the spreadsheet title
      console.log('Spreadsheet Title:', this.doc.title);

    } catch (error) {
      console.error('Error accessing Google Sheets:', error);
    }
  }

  // to be implemented
  async getSheets() {
    try {
      // Access the first sheet
      const sheet = this.doc.sheetsByIndex[0];
      sheet.getRows()
      console.log('Sheet Title:', sheet.title);
      console.log('Row Count:', sheet.rowCount);

      // Read rows from the sheet
      const rows = await sheet.getRows();
      rows.forEach(row => {
        console.log(row);
      });

    } catch (error) {
      console.error('Error getting sheets:', error);
    }
  }
}
