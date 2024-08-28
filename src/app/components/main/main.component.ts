import { Component, inject, OnInit } from '@angular/core';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { ServicesService } from '../../services/services.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-main',
  standalone: true,
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  doc: GoogleSpreadsheet;

  service = inject(ServicesService);
  title = this.service.getSheetTitle();
  cell:string = '';
  constructor() {
    this.doc = new GoogleSpreadsheet(environment.GOOGLE_SHEETS_DOCUMENT_ID, { apiKey: environment.api_key });
    
  }
  
  async ngOnInit() {
    try {
      this.cell = await this.service.getCellsByGrid(0,1)
      
    } catch (error) {
      console.error('Error accessing Google Sheets:', error);
    }
  }

 
}
