# Frontend - Excel to Mongo Data Converter

The frontend provides an intuitive interface for users to upload Excel files, preview data, handle errors, and manage data import into MongoDB.

## Features

### 1. File Import Page

-   **Drag-and-Drop Upload:**
    -   Users can drag and drop Excel files (.xlsx) for upload.
    -   A fallback file input button is available for users who prefer a traditional upload method.
-   **File Restrictions:**
    -   Only accepts `.xlsx` files.
    -   Enforces a maximum file size of 2 MB.

### 2. Error Display

-   Displays backend validation errors in a **modal dialog**:
    -   Errors include the row number and a description for each invalid row.
-   **Multi-Sheet Error Handling:**
    -   For files with multiple sheets, errors are displayed in separate tabs for each sheet.

### 3. Data Preview

-   **Sheet Selection:**
    -   A dropdown lists all the sheets in the uploaded file.
    -   Users can select a sheet to preview its data.
-   **Paginated Table Display:**
    -   Displays the selected sheet's data in a paginated table.
    -   Formats dates to `DD-MM-YYYY`.
    -   Formats numeric values using the **Indian numbering format** (e.g., 12,34,456.00).
-   **Row Deletion:**
    -   Each row has a delete icon.
    -   Clicking the delete icon prompts a confirmation dialog.
    -   Rows are deleted only after user confirmation.

### 4. Data Import

-   **Import Button:**
    -   Allows users to import all valid rows into the database.
    -   Skips invalid rows automatically.
-   **Feedback Mechanism:**
    -   Displays a success message upon successful import.
    -   Highlights skipped rows for user reference.

## Prerequisites

-   A running backend server for file upload and validation.
-   Node.js and npm installed on your system.

## How to Run the Frontend

### Step 1: Install Dependencies

Navigate to the `client` directory and install the required dependencies:

```bash
npm install
```

### Step 2: Configure Environment Variables

Create a `.env` file in the `client` directory and add the backend URL:

```env
REACT_APP_BACKEND_URL=http://localhost:5000
```

### Step 3: Start the Frontend

Run the development server:

```bash
npm run dev
```

The application will start at `http://localhost:5173` by default.

## Technologies Used

-   **Frontend Framework:** React
-   **Styling:** CSS or a preferred CSS-in-JS solution
-   **Date Formatting:** `date-fns` or similar library
-   **Number Formatting:** Custom formatter for Indian number system

## Contributing

Contributions are welcome! Ensure that any new features align with the current design and functionality.

## License

This frontend code is licensed under the MIT License.
