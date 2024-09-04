import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { of, from, Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { IUser } from '../models/iuser';

@Injectable({
  providedIn: 'root',
})
export class ServicesService {
  doc: GoogleSpreadsheet;
  title!: string;

  constructor(private http: HttpClient) {
    this.doc = new GoogleSpreadsheet(environment.GOOGLE_SHEETS_DOCUMENT_ID, {
      apiKey: environment.api_key,
    });
  }

  ngOnInit() {
    this.loadDocs();
  }

  async loadDocs() {
    try {
      await this.doc.loadInfo();
    } catch (error) {
      console.error('Error loading Google Sheets document:', error);
      throw new Error('Failed to load Google Sheets document');
    }
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

  // to be fully implemented
  async createSheet(sheetHeaders: Array<string>) {
    try {
      // ["name","last_name","email","phone_number"]
      await this.doc.loadInfo();
      // await this.doc.addSheet({headerValues:sheetHeaders} )

      let sheet = this.doc.sheetsByIndex[0];

      await sheet.loadCells();
      // await sheet.addRow()
      let rows = await sheet.getRows();
      rows[1];
      rows[0].set('A4', 'hello');
      await rows[0].save();
      console.log();
      // console.log(rows[1].get("hello"));
      // await rows[3].save()
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
      
      return await sheet[row].get(headerParams);
    } catch (error) {
      console.log(error);
    }
  }

  // returns all rows from the excel spread sheet
  async getAllRowData() {
    try {
      await this.doc.loadInfo();
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
    email: string,
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
  }
  //updates the user by taking in an index number and other name, string and email
  updateUser(index: number, name: string, last_name: string, email: string) {
    return this.http.put(`${environment.CONNECTION_URL}/${index}`, {
      name,
      last_name,
      email,
    });
  }

  getAllUsers(): void {
    this.http.get<IUser[]>(${environment.CONNECTION_URL}).subscribe(el => {
       this.allUsers.set(el)
       console.log(this.allUsers());
      // el
    });
  }

  addRowToSheet(data: { name: string; last_name: string; email: string; }): Observable<any> {
    return from(this.loadDocs()).pipe(
      // Load the Google Sheets document
      switchMap(() => {
        this.doc.loadInfo();
        console.log('Loaded docs:', this.doc.title);
        const sheet = this.doc.sheetsByIndex[0];
        console.log('Loaded sheet:', sheet.title);
  
        // Count the number of rows
        return from(sheet.getRows()).pipe(
          switchMap(rows => {
            const newRowIndex = rows.length + 1;
            console.log(`Current number of rows: ${rows.length}. Adding row at index: ${newRowIndex}`);
  
            // Add a new empty row
            return from(sheet.addRow({})).pipe(
              switchMap((newRow) => {
                // Call updateUser to update the newly added row with the stepper data
                return this.updateUser(newRowIndex, data.name, data.last_name, data.email);
              })
            );
          })
        );
      }),
      // Map the added row to any transformation you need
      map(addedRow => {
        console.log('Added and updated row:', addedRow);
        return addedRow;
      }),
      // Catch any errors that may occur
      catchError(error => {
        console.error('Error adding row to Google Sheets:', error);
        return throwError(() => new Error('Failed to add data to Google Sheets'));
      }),
    );
  }
  
  


  addRowToSheetTest() {
    this.addRowToSheet({ name: 'John', last_name: 'Doe', email: 'john.doe@example.com' });
  }

}
