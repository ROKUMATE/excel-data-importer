import React, { useState } from 'react';
import Modal from 'react-modal';
import { format } from 'date-fns';

Modal.setAppElement('#root'); // Set the root element for accessibility

const FileImportPage: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<string>('');
    const [sheetData, setSheetData] = useState<{ [key: string]: any[] }>({});
    const [activeSheet, setActiveSheet] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [showDataEntries, setShowDataEntries] = useState(false);

    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            if (
                selectedFile.type !==
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            ) {
                setError('Only .xlsx files are allowed.');
                setFile(null);
            } else if (selectedFile.size > 2 * 1024 * 1024) {
                setError('File size must be less than 2 MB.');
                setFile(null);
            } else {
                setError(null);
                setFile(selectedFile);
                await uploadFileToBackend(selectedFile);
            }
        }
    };

    const uploadFileToBackend = async (file: File) => {
        setIsLoading(true);
        const formData = new FormData();
        formData.append('file', file, file.name);

        try {
            const response = await fetch('http://localhost:3000/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();

            // Update state with data from backend
            setSheetData(data.sheets || {});
            setActiveSheet(Object.keys(data.sheets || {})[0] || '');
            setValidationErrors(data.errors || []);
            if (data.errors?.length > 0) {
                setActiveTab(data.errors[0].sheetName);
                setIsModalOpen(true);
            }
        } catch (err) {
            setError('Failed to upload file. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleDataEntries = () => {
        setShowDataEntries((prev) => !prev);
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
            <div className="p-8 w-full max-w-lg bg-gray-800 rounded-2xl shadow-xl">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-100">
                    Upload Your File
                </h2>
                <input
                    type="file"
                    accept=".xlsx"
                    onChange={handleFileChange}
                    className="block w-full text-center text-gray-300 mb-4 bg-gray-700 rounded-lg p-2 file:cursor-pointer file:bg-gray-600 file:text-gray-100 file:py-1 file:px-3 file:rounded-lg"
                />
                {error && <p className="text-red-500 text-center">{error}</p>}
                {file && (
                    <p className="text-green-500 text-center">
                        Selected file: {file.name}
                    </p>
                )}
                {isLoading && (
                    <p className="text-blue-500 text-center mt-4">
                        Uploading...
                    </p>
                )}
            </div>

            {/* Modal for Validation Errors */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-lg mx-auto mt-20 relative"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <h2 className="text-xl font-bold mb-6 text-center text-gray-100">
                    Validation Errors
                </h2>
                <div className="flex mb-6 overflow-x-auto">
                    {validationErrors.map((error) => (
                        <button
                            key={error.sheetName}
                            className={`px-4 py-2 mr-2 rounded-lg font-semibold ${
                                activeTab === error.sheetName
                                    ? 'bg-gray-700 text-white'
                                    : 'bg-gray-600 text-gray-300'
                            } hover:bg-gray-700 transition`}
                            onClick={() => setActiveTab(error.sheetName)}>
                            {error.sheetName}
                        </button>
                    ))}
                </div>
                <div className="max-h-60 overflow-y-auto text-gray-300">
                    {validationErrors
                        .filter((error) => error.sheetName === activeTab)
                        .map(
                            (
                                error: {
                                    rowNumber: number;
                                    description: string;
                                },
                                index: number
                            ) => (
                                <p key={index} className="text-red-400 mb-2">
                                    Row {error.rowNumber}: {error.description}
                                </p>
                            )
                        )}
                </div>
                <button
                    onClick={() => setIsModalOpen(false)}
                    className="mt-6 px-6 py-2 bg-blue-600 rounded-lg text-white font-semibold hover:bg-blue-500 transition">
                    Close
                </button>
            </Modal>

            {/* Data Table */}
            <div className="mt-10 w-full max-w-4xl">
                <button
                    onClick={toggleDataEntries}
                    className="mb-4 px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 transition">
                    {showDataEntries
                        ? 'Hide Data Entries'
                        : 'Show Data Entries'}
                </button>

                {showDataEntries && (
                    <>
                        <select
                            value={activeSheet}
                            onChange={(e) => setActiveSheet(e.target.value)}
                            className="mb-4 p-3 bg-gray-700 text-white rounded-lg shadow focus:ring-2 focus:ring-blue-500">
                            {Object.keys(sheetData).map((sheetName) => (
                                <option key={sheetName} value={sheetName}>
                                    {sheetName}
                                </option>
                            ))}
                        </select>

                        <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg">
                            <table className="table-auto w-full text-left">
                                <thead className="bg-gray-700 text-gray-300 uppercase">
                                    <tr>
                                        <th className="p-4">Name</th>
                                        <th className="p-4">Date</th>
                                        <th className="p-4">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sheetData[activeSheet]?.map((row) => (
                                        <tr
                                            key={row.id}
                                            className="border-t border-gray-700 hover:bg-gray-700 transition">
                                            <td className="p-4">{row.name}</td>
                                            <td className="p-4">
                                                {format(
                                                    new Date(row.date),
                                                    'dd-MM-yyyy'
                                                )}
                                            </td>
                                            <td className="p-4">
                                                {row.amount}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default FileImportPage;
