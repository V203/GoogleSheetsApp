import { Injectable, signal } from '@angular/core';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUser } from '../models/iuser';

@Injectable({
  providedIn: 'root',
})
export class ServicesService {

  doc: GoogleSpreadsheet;
  title!: string;

  updateBoolDisplay = signal<boolean>(false);
  allUsers = signal<IUser[]>([]);

  constructor(private http: HttpClient) {
    this.doc = new GoogleSpreadsheet(environment.GOOGLE_SHEETS_DOCUMENT_ID, { apiKey: environment.api_key });
    this.doc.loadInfo();
    this.getAllUsers()
  }

  ngOnInit() {

  }

  async loadDocs() {
    await this.doc.loadInfo();
  }

  async getSheetTitle(): Promise<string> {
    try {
      await this.doc.loadInfo();
      this.title = this.doc.title;
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
      await sheet.loadCells('A1:B2');
      //get row and column by index number
      let cell = sheet.getCell(row, col);
      // return cell as a value
      return cell.value as string;
    } catch (error) {
      console.error('Error getting cells:', error);
      throw error;
    }
  }
  // to be fully implemted
  async insertIntoCell() {
    try {
      await this.doc.loadInfo();
      let { sheetsByIndex } = this.doc;
      // console.log(await sheetsByIndex[0].getRows());
      let sheet = sheetsByIndex[0];
      let rows = await sheet.getRows();
      rows[0].set('A4', 'hello');
    } catch (error) {
      console.log(error);
    }
  }


  async getRowByNumberAndHeader(row: number, headerParams: string) {
    try {
      this.doc.loadInfo();
      let sheet = await this.doc.sheetsByIndex[0].getRows({
        offset: 0,
        limit: 2,
      });
      // console.log(await sheet[row].get(headerParams));
      return await sheet[row].get(headerParams);
    } catch (error) {
      console.log(error);
    }
  }

  // returns all rows from the excel spread sheet
  async getAllRowData() {
    try {
      this.doc.loadInfo();
      let sheet = this.doc.sheetsByIndex[0];

      let rows = await sheet.getCellsInRange('A2:Z');

      const keys = ['name', 'last_name', 'email'];

      const newRows = rows.map((item: any) => {
        return keys.reduce((obj: any, key, index) => {
          obj[key] = item[index];
          return obj;
        }, {});
      });

      return newRows;
    } catch (error) {
      console.log(error);
    }
  }
  // service.insertUser("John", "Doe", "jd@.co.za")
  insertUser(
    name: string,
    last_name: string,
    email: string
  ): Observable<IUser> {
    return this.http.post<IUser>(environment.CONNECTION_URL, {
      name,
      last_name,
      email,
    });
  }

  //deletes the user by taking an index number
  deleteUser(index: number) {
    return this.http.delete(`${environment.CONNECTION_URL}/${index}`);
    
  };

  //updates the user by taking in an index number and other name, string and email
  updateUser(index: number, name: string, last_name: string, email: string) {
    return this.http.put(`${environment.CONNECTION_URL}/${index}`, {
      name,
      last_name,
      email
    })
  };

  getAllUsers(): void {
    this.http.get<IUser[]>(`${environment.CONNECTION_URL}`).subscribe(el => {
       this.allUsers.set(el)
       console.log(this.allUsers());
      // el
    });
  }

}

