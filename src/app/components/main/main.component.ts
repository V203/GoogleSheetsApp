import { Component, inject, OnInit } from '@angular/core';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { ServicesService } from '../../services/services.service';
import { environment } from '../../../environments/environment';
import { NgFor } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button'; 
import {MatIconModule} from '@angular/material/icon';


@Component({
  selector: 'app-main',
  standalone: true,
  imports: [NgFor, MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  doc: GoogleSpreadsheet;

  service = inject(ServicesService);
  displayedColumns = ["name", "last_name", "email","actions"];
  title: string = "";
  cell: string = "";
  arrayOfData: any;
  
  constructor(private router: Router) {
    this.doc = new GoogleSpreadsheet(environment.GOOGLE_SHEETS_DOCUMENT_ID, { apiKey: environment.api_key });
  }

  async ngOnInit() {
    try {
      this.cell = await this.service.getCellByGrid(1, 1)
      await this.service.getRowByNumberAndHeader(1, "email");
      this.title = await this.service.getSheetTitle();
      this.arrayOfData = await this.service.getAllRowData()
      
     

    } catch (error) {
      console.error('Error accessing Google Sheets:', error);
    }
  };


  deleteUser(id:number){
    
    this.service.deleteUser(id).subscribe({
      next: (res)=> {
        console.log(res);
        if(res){
          this.router.navigate(["/"])

        }

      }
    })
  };
};
