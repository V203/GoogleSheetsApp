import { Injectable } from '@angular/core';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  doc: GoogleSpreadsheet
  title!: string


  constructor() {

    enum headerParams {
      name = "name",
      email = "email",
      last_name = "last name",
      gender = "gender"
    };

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

  async getCellByGrid(row: number, col: number): Promise<string> {
    try {
      // Load sheets info into cache
      await this.doc.loadInfo();
      // sheet first sheet in our sheets by index
      let sheet = this.doc.sheetsByIndex[0];
      //load cells into cache 
      await sheet.loadCells("A1:B2");
      //get row and column by index number
      let cell = sheet.getCell(row, col);
      // return cell as a value
      return cell.value as string;
    } catch (error) {
      console.error('Error getting cells:', error);
      throw error;
    }
  }

  async insertIntoCell() {
    try {
      await this.doc.loadInfo();
      let { sheetsByIndex } = this.doc;
      // console.log(await sheetsByIndex[0].getRows());
      let sheet = sheetsByIndex[0];
      let rows = await sheet.getRows();
      rows[0].set("A4", "hello");

    } catch (error) {
      console.log(error);

    }
  };

  // to be fully implemented
  async createSheet(sheetHeaders: Array<string>) {
    try {
      // ["name","last_name","email","phone_number"]
      await this.doc.loadInfo();
      // await this.doc.addSheet({headerValues:sheetHeaders} )

      let sheet = this.doc.sheetsByIndex[0];

      await sheet.loadCells()
      // await sheet.addRow()
      let rows = await sheet.getRows();
      rows[1]
      rows[0].set("A4", "hello");
      await rows[0].save()
      console.log();
      // console.log(rows[1].get("hello"));
      // await rows[3].save()
    } catch (error) {
      console.log(error);
    }
  };

  async getRowByNumberAndHeader(row: number, headerParams: string) {
    try {
      this.doc.loadInfo();
      let sheet = await this.doc.sheetsByIndex[0].getRows({ offset: 0, limit: 2 });
      console.log(await sheet[row].get(headerParams));
      return await sheet[row].get(headerParams)
    } catch (error) {
      console.log(error);
    }
  };

  // returns all rows from the excel spread sheet
  async getAllRowData() {
    try {
      this.doc.loadInfo();
      let sheet = this.doc.sheetsByIndex[0]
      
      let rows = await sheet.getCellsInRange("A2:Z")
      
      const keys = ["name", "last_name", "email", "gender"];

      const newRows = rows.map((item: any) => {
        return keys.reduce((obj: any, key, index) => {
          obj[key] = item[index];
          return obj;
        }, {});
      });
      
      return newRows

    } catch (error) {
      console.log(error);
    }
  }




}
