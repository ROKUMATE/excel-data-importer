# Excel to Mongo Data Converter

This project is designed to simplify the process of converting Excel files into MongoDB collections. It provides a user-friendly interface and backend processing to upload, validate, and import Excel data directly into MongoDB, ensuring a seamless data migration experience.

## Project Structure

The project is organized into three main directories:

### 1. `client`

This directory contains the front-end code for the application. It provides a user interface for:

-   Uploading Excel files.
-   Viewing the status of uploaded files.
-   Monitoring the data conversion process.

### 2. `samplefiles`

This directory contains sample Excel files for testing and demonstration purposes. These files showcase the format and structure required for successful data conversion.

### 3. `server`

The server directory contains the back-end code that:

-   Handles file uploads.
-   Parses Excel files using libraries like `xlsx`.
-   Validates the data and checks for errors or inconsistencies.
-   Inserts validated data into MongoDB collections.

## Features

-   **Excel to MongoDB Conversion:** Quickly transform Excel sheets into MongoDB collections.
-   **Validation:** Ensure data integrity through automated validation rules.
-   **User-Friendly Interface:** Intuitive client interface for uploading and monitoring.
-   **Sample Files:** Pre-defined templates to guide users in structuring their data.

## Prerequisites

-   **Node.js** and **npm** for running the server and client.
-   **npm** packages like `multer`, `xlsx`, `moment`, `exceljs` used in the backend server, whereas packages like `tailwind` , `number-format.js`, `date-fns`, `date-fn` used in frontend client.
-   **MongoDB** for data storage.
-   Excel files with a supported structure.

## How to Use

1. Clone the repository.
2. Navigate to the `server` directory and run the server.
3. Navigate to the `client` directory and start the client application.
4. Use the interface to upload Excel files.
5. Monitor the conversion status and access the data in MongoDB.

## Technologies Used

-   **Frontend:** React, HTML, CSS
-   **Backend:** Node.js, Express
-   **Database:** MongoDB
-   **Libraries:** `xlsx` for Excel parsing

## Contributing

Feel free to contribute to this project by submitting pull requests or reporting issues. Ensure that your contributions align with the project goals and coding standards.

## License

This project is licensed under the MIT License.
