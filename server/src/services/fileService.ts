import ExcelJS from 'exceljs';
import moment from 'moment';
import { ValidationError } from '../config/validationErrorConfig';

// Function to check the xlsx file locally
export const checkFile = async (): Promise<ValidationError[]> => {
    const workbook = new ExcelJS.Workbook();

    // Line change for checking it locally
    await workbook.xlsx.readFile(
        '../sample_files/example_validation_file.xlsx'
    );

    const errors: ValidationError[] = [];
    const currentMonth = moment().format('MM-YYYY');

    // Looping through the sheets and rows to validate the data
    workbook.eachSheet((sheet) => {
        // Looping through the rows
        sheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            // checking if the headers are correct
            if (rowNumber === 1) {
                const headers = ['Name', 'Amount', 'Date', 'Verified'];
                // @ts-ignore
                const rowHeaders = row.values ? row.values.slice(1) : [];
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

            // Checking the data
            if (row.values) {
                // @ts-ignore
                const [name, amount, date, verified] = row.values.slice(1);

                if (!name || typeof name !== 'string') {
                    errors.push({
                        sheetName: sheet.name,
                        rowNumber,
                        description: 'Name is required.',
                    });
                }
                // Checking if the amount is a number and greater than zero
                if (amount === undefined || isNaN(amount) || amount <= 0) {
                    errors.push({
                        sheetName: sheet.name,
                        rowNumber,
                        description:
                            'Amount must be numeric and greater than zero.',
                    });
                }
                // Checking the date format and if it is in the current month
                if (!date || !moment(date, 'MM/DD/YYYY', true).isValid()) {
                    errors.push({
                        sheetName: sheet.name,
                        rowNumber,
                        description: 'Invalid date format.',
                    });
                } else if (moment(date).format('MM-YYYY') !== currentMonth) {
                    errors.push({
                        sheetName: sheet.name,
                        rowNumber,
                        description: 'Date must be within the current month.',
                    });
                }
                // Checking if the verified column is "Yes" or "No"
                if (verified && !['Yes', 'No'].includes(verified)) {
                    errors.push({
                        sheetName: sheet.name,
                        rowNumber,
                        description: 'Verified must be "Yes" or "No".',
                    });
                }
            }
        });
    });
    return errors;
};

// Function to process the xlsx file from multer file buffer
export const processFile = async (
    fileBuffer: Buffer
): Promise<ValidationError[]> => {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(fileBuffer);

    const errors: ValidationError[] = [];
    const currentMonth = moment().format('MM-YYYY');

    workbook.eachSheet((sheet) => {
        sheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            if (rowNumber === 1) {
                const headers = ['Name', 'Amount', 'Date', 'Verified'];
                // @ts-ignore
                const rowHeaders = row.values ? row.values.slice(1) : [];
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
                // @ts-ignore
                const [name, amount, date, verified] = row.values.slice(1);

                if (!name || typeof name !== 'string') {
                    errors.push({
                        sheetName: sheet.name,
                        rowNumber,
                        description: 'Name is required.',
                    });
                }

                if (amount === undefined || isNaN(amount) || amount <= 0) {
                    errors.push({
                        sheetName: sheet.name,
                        rowNumber,
                        description:
                            'Amount must be numeric and greater than zero.',
                    });
                }

                if (!date || !moment(date, 'MM/DD/YYYY', true).isValid()) {
                    errors.push({
                        sheetName: sheet.name,
                        rowNumber,
                        description: 'Invalid date format.',
                    });
                } else if (moment(date).format('MM-YYYY') !== currentMonth) {
                    errors.push({
                        sheetName: sheet.name,
                        rowNumber,
                        description: 'Date must be within the current month.',
                    });
                }

                if (verified && !['Yes', 'No'].includes(verified)) {
                    errors.push({
                        sheetName: sheet.name,
                        rowNumber,
                        description: 'Verified must be "Yes" or "No".',
                    });
                }
            }
        });
    });

    return errors;
};
