export const validationConfig: {
    sheets: {
        [key: string]: {
            columnMap: Record<string, string>;
            rules: {
                mandatory: string[];
                dateWithinCurrentMonth: boolean;
                amountGreaterThanZero: boolean;
                allowZeroAmount: boolean;
            };
        };
    };
} = {
    sheets: {
        default: {
            columnMap: {
                Name: 'name',
                Amount: 'amount',
                Date: 'date',
                Verified: 'verified',
            },
            rules: {
                mandatory: ['Name', 'Amount', 'Date'],
                dateWithinCurrentMonth: true,
                amountGreaterThanZero: true,
                allowZeroAmount: false,
            },
        },
        invoices: {
            columnMap: {
                Name: 'name',
                Amount: 'amount',
                Date: 'date',
                Verified: 'verified',
            },
            rules: {
                mandatory: ['Name', 'Amount', 'Date'],
                dateWithinCurrentMonth: true,
                amountGreaterThanZero: true,
                allowZeroAmount: false,
            },
        },
    },
};
