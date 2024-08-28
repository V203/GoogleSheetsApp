import { TestBed } from '@angular/core/testing';
import { ServicesService } from './services.service';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { environment } from '../../environments/environment';

describe('ServicesService', () => {
  let service: ServicesService;
  let doc: GoogleSpreadsheet;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicesService);

    doc = new GoogleSpreadsheet(environment.GOOGLE_SHEETS_DOCUMENT_ID, {
      apiKey: environment.api_key,
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get the sheet title', async () => {
    await doc.loadInfo();
    console.log(doc.title);
    const title = await service.getSheetTitle();

    expect(title).toBe(doc.title);
  });

  it('should get cell value', async () => {
    const cellValue = await service.getCellsByGrid(0, 0);

    const expectedValue = 'Hello';
    const cellValueStr = cellValue ? String(cellValue) : '';

    expect(cellValueStr).toBe(expectedValue);
  });
});
