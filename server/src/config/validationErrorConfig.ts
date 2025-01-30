// Creating the Error Interface that we have to return to the Frontend
export interface ValidationError {
    sheetName: string;
    rowNumber: number;
    description: string;
}
