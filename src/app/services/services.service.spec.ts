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

  it('should get cell value for cell A1', async () => {
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    await sheet.loadCells('A1:B2');

    const cellValue = await service.getCellByGrid(0, 0);
    const expectedCell = sheet.getCell(0, 0);

    const expectedValue = expectedCell.value ? String(expectedCell.value) : '';
    const cellValueStr = cellValue ? String(cellValue) : '';

    expect(cellValueStr).toBe(expectedValue);
  });

  it('should get cell value for cell B2', async () => {
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    await sheet.loadCells('A1:B2');

    const cellValue = await service.getCellByGrid(1, 1);
    const expectedCell = sheet.getCell(1, 1);

    const expectedValue = expectedCell.value ? String(expectedCell.value) : '';
    const cellValueStr = cellValue ? String(cellValue) : '';

    expect(cellValueStr).toBe(expectedValue);
  });

  it('should get cell value for given header "name"', async () => {
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    const expectedValue = rows[0].get('name');
    const cellValue = await service.getRowByNumberAndHeader(0, 'name');

    expect(cellValue).toBe(expectedValue);
  });

  it('should handle error while getting cell value', async () => {
    spyOn(service, 'getCellByGrid').and.callFake(async () => {
      throw new Error('Error getting cells');
    });

    try {
      await service.getCellByGrid(0, 0);
      fail('Expected error was not thrown');
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toBe('Error getting cells');
      } else {
        fail('Expected error to be an instance of Error');
      }
    }
  });
});
