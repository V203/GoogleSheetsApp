import { TestBed } from '@angular/core/testing';
import { ServicesService } from './services.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { environment } from '../../environments/environment';
import { IUser } from '../models/iuser';

describe('ServicesService', () => {
  let service: ServicesService;
  let httpMock: HttpTestingController;
  let doc: GoogleSpreadsheet;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ServicesService],
    });

    service = TestBed.inject(ServicesService);
    httpMock = TestBed.inject(HttpTestingController);

    doc = new GoogleSpreadsheet(environment.GOOGLE_SHEETS_DOCUMENT_ID, {
      apiKey: environment.api_key,
    });
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle error while loading documents', async () => {
    spyOn(service, 'loadDocs').and.callFake(async () => {
      throw new Error('Error loading documents');
    });

    try {
      await service.loadDocs();
      fail('Expected error was not thrown');
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toBe('Error loading documents');
      } else {
        fail('Expected error to be an instance of Error');
      }
    }
  });

  it('should insert into cell', async () => {
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    await sheet.loadCells();

    await service.insertIntoCell();

    const rows = await sheet.getRows();
    const cellValue = rows[0].get('A4');

    expect(cellValue).toBe('hello');
  });

  it('should handle error while inserting into cell', async () => {
    spyOn(service, 'insertIntoCell').and.callFake(async () => {
      throw new Error('Error inserting into cell');
    });

    try {
      await service.insertIntoCell();
      fail('Expected error was not thrown');
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toBe('Error inserting into cell');
      } else {
        fail('Expected error to be an instance of Error');
      }
    }
  });

  it('should get row by number and header', async () => {
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    const expectedValue = rows[0].get('name');
    const cellValue = await service.getRowByNumberAndHeader(0, 'name');

    expect(cellValue).toBe(expectedValue);
  });

  it('should handle error while getting row by number and header', async () => {
    spyOn(service, 'getRowByNumberAndHeader').and.callFake(async () => {
      throw new Error('Error getting row by number and header');
    });

    try {
      await service.getRowByNumberAndHeader(0, 'name');
      fail('Expected error was not thrown');
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toBe('Error getting row by number and header');
      } else {
        fail('Expected error to be an instance of Error');
      }
    }
  });

  it('should get all row data', async () => {
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    const data = await service.getAllRowData();

    const expectedData = rows.map((row) => ({
      name: row.get('name'),
      last_name: row.get('last_name'),
      email: row.get('email'),
    }));

    expect(data).toEqual(expectedData);
  });

  it('should handle error while getting all row data', async () => {
    spyOn(service, 'getAllRowData').and.callFake(async () => {
      throw new Error('Error getting all row data');
    });

    try {
      await service.getAllRowData();
      fail('Expected error was not thrown');
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toBe('Error getting all row data');
      } else {
        fail('Expected error to be an instance of Error');
      }
    }
  });

  it('should insert user', () => {
    const newUser: IUser = {
      name: 'John',
      last_name: 'Doe',
      email: 'jd@.co.za',
    };

    service
      .insertUser(newUser.name, newUser.last_name, newUser.email)
      .subscribe((response) => {
        expect(response).toEqual(newUser);
      });

    const req = httpMock.expectOne(environment.CONNECTION_URL);
    expect(req.request.method).toBe('POST');
    req.flush(newUser);
  });

  it('should delete user', () => {
    const index = 1;

    service.deleteUser(index).subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${environment.CONNECTION_URL}/${index}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should update user', () => {
    const index = 1;
    const updatedUser: IUser = {
      name: 'Jane',
      last_name: 'Doe',
      email: 'jane.doe@example.com',
    };

    service
      .updateUser(
        index,
        updatedUser.name,
        updatedUser.last_name,
        updatedUser.email
      )
      .subscribe((response) => {
        expect(response).toEqual(updatedUser);
      });

    const req = httpMock.expectOne(`${environment.CONNECTION_URL}/${index}`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedUser);
  });
});
