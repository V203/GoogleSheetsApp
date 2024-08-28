import { Injectable } from '@angular/core';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { environment } from '../../environments/environment';
import { Signal } from '@angular/core';



@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  doc: GoogleSpreadsheet
  title!: string
  constructor() {
    this.doc = new GoogleSpreadsheet(environment.GOOGLE_SHEETS_DOCUMENT_ID, { apiKey: environment.api_key });
    this.doc.loadInfo()
  }

  async ngOnInit() {
    try {
      this.doc.title
    } catch (error) {
      console.log(error);

    }
  }

  async loadDocs() {
    await this.doc.loadInfo();
  }




  async getSheetTitle(): Promise<string> {
    try {

      await this.doc.loadInfo();
      this.title = this.doc.title

      return this.title;
    } catch (error) {

      console.error('Error accessing Google Sheets:', error);


      throw new Error('Failed to get the sheet title');
    }
  }

  async getCellsByGrid(row:number,col:number): Promise<string> {
    try {
      await this.doc.loadInfo();
      let sheet = this.doc.sheetsByIndex[0];
      await sheet.loadCells("A1:B2");
      let cell = sheet.getCell(row, col);
      return cell.value as string;
    } catch (error) {
      console.error('Error getting cells:', error);
      throw error;
    }
  }
  

}
