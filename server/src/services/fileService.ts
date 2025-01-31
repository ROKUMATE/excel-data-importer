import ExcelJS from 'exceljs';
import moment from 'moment';
// import { insertData } from './databaseService';

// Interface import
import { validationConfig } from '../config/validationConfig';
import { ValidationError } from '../config/validationErrorConfig';

// Function to process an uploaded file (for `/upload`)
export const processFile = async (
    fileBuffer: Buffer
): Promise<ValidationError[]> => {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(fileBuffer);

    const errors: ValidationError[] = [];
    const importedData: Record<string, any[]> = {}; // Store data for insertion
    const currentMonth = moment().format('MM-YYYY');

    // console.log(workbook);
    workbook.eachSheet((sheet) => {
        // console.log(sheet);
        const config =
            validationConfig.sheets[sheet.name] ||
            validationConfig.sheets.default;
        const { columnMap, rules } = config;

        const sheetData: any[] = []; // Data for this specific sheet

        sheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            if (rowNumber === 1) {
                const headers = Object.keys(columnMap);
                const rowHeaders = Array.isArray(row.values)
                    ? row.values.slice(1)
                    : [];
                if (
                    !headers.every(
                        (header, index) => header === rowHeaders[index]
                    )
                ) {
                    errors.push({
                        sheetName: sheet.name,
                        rowNumber: 1,
                        description: `Invalid headers. Expected: ${headers.join(
                            ', '
                        )}`,
                    });
                }
                return;
            }

            if (row.values) {
                const rowData: Record<string, any> = {};
                Object.entries(columnMap).forEach(
                    ([excelCol, dbField], index) => {
                        rowData[dbField] = (row.values as ExcelJS.CellValue[])[
                            index + 1
                        ];
                    }
                );

                let hasError = false;

                // Validation Rules
                rules.mandatory.forEach((col) => {
                    if (!rowData[columnMap[col]]) {
                        errors.push({
                            sheetName: sheet.name,
                            rowNumber,
                            description: `${col} is mandatory.`,
                        });
                        hasError = true;
                    }
                });

                if (rules.dateWithinCurrentMonth) {
                    const dateCol =
                        columnMap['Date'] || columnMap['Invoice Date'];
                    const date = rowData[dateCol];
                    if (
                        !moment(date, 'MM/DD/YYYY', true).isValid() ||
                        moment(date, 'MM/DD/YYYY').format('MM-YYYY') !==
                            currentMonth
                    ) {
                        errors.push({
                            sheetName: sheet.name,
                            rowNumber,
                            description:
                                'Date must be valid and within the current month.',
                        });
                        hasError = true;
                    }
                }

                const amount = parseFloat(rowData[columnMap['Amount']]);
                if (!isNaN(amount)) {
                    if (rules.amountGreaterThanZero && amount <= 0) {
                        errors.push({
                            sheetName: sheet.name,
                            rowNumber,
                            description: 'Amount must be greater than zero.',
                        });
                        hasError = true;
                    }
                    if (!rules.allowZeroAmount && amount === 0) {
                        errors.push({
                            sheetName: sheet.name,
                            rowNumber,
                            description: 'Zero amount is not allowed.',
                        });
                        hasError = true;
                    }
                }

                // Add valid row to sheetData
                if (!hasError) {
                    sheetData.push(rowData);
                }
            }
        });

        // Store sheet data
        if (sheetData.length > 0) {
            importedData[sheet.name] = sheetData;
        }
    });

    // Insert valid data into MongoDB
    // for (const [sheetName, data] of Object.entries(importedData)) {
    //     await insertData(sheetName.toLowerCase(), data); // Use sheet name as collection name
    // }

    return errors;
};

// Function to check a local file for validation (for `/check-endpoint`)
export const checkFile = async (): Promise<ValidationError[]> => {
    const filePath = '../sample_files/example_validation_file.xlsx';
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    // @ts-ignore
    return processFile(await workbook.xlsx.writeBuffer());
};
