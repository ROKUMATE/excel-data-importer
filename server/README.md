# Server - Excel to Mongo Data Converter

The server is the backbone of the Excel to Mongo Data Converter project. It handles file validation, data processing, and interaction with the MongoDB database.

## Features

### 1. File Validation

The server ensures that the uploaded Excel files meet the required standards before importing data into the database:

#### Validation Rules

1. The sheet must contain the following mandatory columns:
    - **Name**
    - **Amount**
    - **Date**
    - **Verified** (Yes or No)
2. Column-specific rules:
    - **Name**, **Amount**, and **Date** are mandatory fields.
    - **Date** must be valid and fall within the current month.
    - **Amount** must be numeric and greater than zero.
3. Error responses include:
    - Sheet name.
    - Row number.
    - Description of the error.

### 2. Support for Future Extensions

The server is designed with flexibility to support various sheet formats and validation rules:

-   **Dynamic Validation:**
    -   Allows for column-specific rules such as permitting previous-month dates or handling multiple date columns (e.g., Invoice Date and Receipt Date).
    -   Supports optional columns and fields that allow zero as a valid value.
-   **Configuration-Driven Approach:**
    -   A separate configuration file maps:
        -   Excel sheet column names to database field names.
        -   Validation rules for each sheet type.

### 3. Database Interaction

-   Uses **MongoDB Atlas (free tier)** for data storage.
-   Efficiently processes thousands of rows.
-   Ensures data integrity during import.

## Prerequisites

-   **Node.js** and **npm** installed on your machine.
-   A **MongoDB Atlas account** set up.

## How to Run the Server

### Step 1: Install Dependencies

Navigate to the `server` directory and install the required dependencies:

```bash
npm install
```

### Step 2: Set Up Environment Variables

Create a `.env` file in the `server` directory and add the following variables:

```env
MONGO_URI=<Your MongoDB Atlas Connection String>
PORT=5000
```

### Step 3: Start the Server

Run the server:

```bash
npm run dev
```

The server will start on the port specified in the `.env` file (default: 5000).

## Technologies Used

-   **Backend Framework:** Node.js, Express
-   **File Parsing:** Libraries such as `xlsx` or `exceljs`
-   **Database:** MongoDB Atlas

## Contributing

Contributions are welcome! Ensure that any updates to the validation rules or configuration file are well-documented.

## License

This server code is licensed under the MIT License.
