import express from 'express';
import multer from 'multer';
import { processFile } from './services/fileService';
import cors from 'cors';
import { connectToDatabase } from './services/databaseService';
import dotenv from 'dotenv';
import { getAllEntries } from './services/databaseService';

const app = express();
app.use(cors());
dotenv.config();

const PORT = process.env.PORT || 3000;

const upload = multer({
    limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
    fileFilter: (req, file, cb) => {
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

// File upload endpoint
// @ts-ignore
app.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    try {
        const errors = await processFile(req.file.buffer);

        if (errors.length > 0) {
            return res
                .status(200)
                .json({ errors, message: 'File processed with errors.' });
        }

        return res.status(200).send('File processed successfully.');
    } catch (error) {
        console.error('Error in /upload:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// @ts-ignore
// app.get('/entries', async (req, res) => {
//     try {
//         const entries = await getAllEntries(); // Assuming getAllEntries is a function in your database service
//         return res.status(200).json(entries);
//     } catch (error) {
//         console.error('Error in /entries:', error);
//         return res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

app.listen(PORT, () => {
    connectToDatabase();
    console.log(`Server is running on port ${PORT}`);
});
