import express from 'express';
import multer from 'multer';
import { processFile, checkFile } from './services/fileService';
import { connectToDatabase } from './services/databaseService';

const app = express();
const upload = multer();

const PORT = process.env.PORT || 3000;

// @ts-ignore
app.get('/check-endpoint', async (req, res) => {
    const errors = await checkFile();
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }
    return res.status(200).send('File processed successfully.');
});

// @ts-ignore
app.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    try {
        const errors = await processFile(req.file.buffer);
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }
        return res.status(200).send('File processed successfully.');
    } catch (err) {
        console.error('File processing error:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, async () => {
    // await connectToDatabase();
    console.log(`Server is running on port ${PORT}`);
});
