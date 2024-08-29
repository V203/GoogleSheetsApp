import { Component, inject, OnInit } from '@angular/core';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { ServicesService } from '../../services/services.service';
import { environment } from '../../../environments/environment';
import { NgFor } from '@angular/common';
import {MatTableModule} from '@angular/material/table';

@Component({
  selector: 'app-main',
  standalone: true,
  imports:[NgFor, MatTableModule],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  doc: GoogleSpreadsheet;

  service = inject(ServicesService);
  displayedColumns = ["name", "last_name", "email", "gender"];
  title:string = "";
  cell:string = "";
  arrayOfData:any;
  // dataSource = this.arrayOfData
  constructor() {
    this.doc = new GoogleSpreadsheet(environment.GOOGLE_SHEETS_DOCUMENT_ID, { apiKey: environment.api_key })
    
  }
  
  async ngOnInit() {
    try {
      this.cell = await this.service.getCellByGrid(1,1)
      await this.service.getRowByNumberAndHeader(1,"email");
      this.title = await this.service.getSheetTitle();
      this.arrayOfData = await this.service.getAllRowData()
      
    } catch (error) {
      console.error('Error accessing Google Sheets:', error);
    }
  }

 
}
