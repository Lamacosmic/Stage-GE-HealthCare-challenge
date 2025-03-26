import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ImageConverter from "./control/imageConverter";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from backend with TypeScript!');
});

app.get('/convert', (req, res) => {
    const type: string = req.query.type as string;
    let imageConverter: ImageConverter = new ImageConverter('../image_dcm/manifest-1743030850389/CMB-AML/MSB-05167/12-18-1959-NA-CTChest-92091/10.000000-AXIAL LG 3.0 X 3.0-84776/1-001.dcm', type);
    imageConverter.convert();
    res.send(`WIP`); //FIXME
}, )

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));