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

  it('should handle error while getting the sheet title', async () => {
    spyOn(service, 'getSheetTitle').and.callFake(async () => {
      throw new Error('Failed to get the sheet title');
    });

    try {
      await service.getSheetTitle();
      fail('Expected error was not thrown');
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toBe('Failed to get the sheet title');
      } else {
        fail('Expected error to be an instance of Error');
      }
    }
  });

  it('should get cell value', async () => {
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    await sheet.loadCells('A1:B2');

    const cellValue = await service.getCellsByGrid(0, 0);
    const expectedCell = sheet.getCell(0, 0);

    const expectedValue = expectedCell.value ? String(expectedCell.value) : '';
    const cellValueStr = cellValue ? String(cellValue) : '';

    expect(cellValueStr).toBe(expectedValue);
  });
});
