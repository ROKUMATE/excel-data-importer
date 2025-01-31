import express from 'express';
import multer from 'multer';
import { processFile, checkFile } from './services/fileService';
import cors from 'cors';
// import { connectToDatabase } from './services/databaseService';

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

const upload = multer({
    limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
    fileFilter: (req, file, cb) => {
        // Validate file type
        if (
            file.mimetype !==
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ) {
            return cb(
                new Error('Invalid file type. Only .xlsx files are allowed.')
            );
        }
        cb(null, true);
    },
});

// Establish database connection on startup
// connectToDatabase();

// Endpoint to check local file
// @ts-ignore
app.get('/check-endpoint', async (req, res) => {
    try {
        const errors = await checkFile();
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }
        return res.status(200).send('File processed successfully.');
    } catch (error) {
        console.error('Error in /check-endpoint:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// File upload endpoint
// @ts-ignore
app.post('/upload', upload.single('file'), async (req, res) => {
    console.log('Uploading file...');
    console.log('req.file --> ', req.file);

    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    try {
        const errors = await processFile(req.file.buffer);
        // console.log('errors are-->', errors);
        if (errors.length > 0) {
            console.log('error happened 400-1');
            return res
                .status(200)
                .json({ errors, message: 'File processed with errors.' });
        }
        console.log('file processed successfully');
        return res.status(200).send('File processed successfully.');
    } catch (error) {
        console.error('Error in /upload:', error);

        if (
            (error as Error).message ===
            'Invalid file type. Only .xlsx files are allowed.'
        ) {
            console.log('error happened 400-2');
            return res.status(400).json({ error: (error as Error).message });
        }
        console.log('error happened 500');
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
