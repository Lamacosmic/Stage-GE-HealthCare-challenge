import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ImageConverter from './control/imageConverter';
import path from 'path';
import multer from 'multer';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Front -> back image upload management
const upload = multer({storage: multer.memoryStorage()});

app.get('/', (req, res) => {
    res.send('Hello from backend with TypeScript!');
});

app.post('/convert', upload.single('image'), (req, res) => {
    if(!req.file) {
        res.status(400).send('No file uploaded');
        return;
    }
    const type: string = req.query.type as string;
    try{
        const imageConverter: ImageConverter = new ImageConverter(req.file.buffer, type);
        imageConverter.convert()
            .then(() => res.sendFile(`out.${imageConverter.type}`, { root: path.join(__dirname, `../${imageConverter.outPath}`) }));
    } catch (e: any) {
        res.status(500).send(e.message);
    }
}, )

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));