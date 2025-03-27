import fs from 'fs';
import dicomParser, {DataSet, Element} from 'dicom-parser';
import sharp, {Sharp} from "sharp";

class ImageConverter {

    private readonly _pixels;
    private readonly _type: string;
    private readonly _width: number;
    private readonly _height: number;
    private readonly _bitsAllocated: number;

    public constructor(path: string, type: string) {
        this._type = type.toLowerCase();
        const dataset: DataSet = dicomParser.parseDicom(fs.readFileSync(path)); // lecture et parsing de l'image

        const pixelData: Element = dataset.elements.x7fe00010; //recuperation des valeurs des pixels sans les metadata
        this._width = dataset.uint16("x00280011") || 0;
        this._height = dataset.uint16("x00280010") || 0;
        this._bitsAllocated = dataset.uint16("x00280100") || 0;

        if (!pixelData || !this._width && !this._height && !this._bitsAllocated) {
            throw new Error("Could not parse image data.");
        }

        this._pixels = new Uint16Array(dataset.byteArray.buffer, pixelData.dataOffset, pixelData.length / 2);
        return;
    }

    public convert():void {

        const pixelBuffer = Buffer.alloc(this._width * this._height * 3);

        for (let i = 0; i < this._width * this._height; i++) {
            const value = (this._pixels[i] / (1 << 12)) * 255; // 12 est pas 16 car l'image est sous 12 bit mais 16 sont alloue
            pixelBuffer[i * 3] = value;
            pixelBuffer[i * 3 + 1] = value;
            pixelBuffer[i * 3 + 2] = value;
        }

        let img_out: Sharp = sharp(pixelBuffer, {raw: {width: this._width, height: this._height, channels: 3}})

        switch (this._type) {
            case 'jpeg':
                img_out.toFormat('jpeg');
                break;
            // case 'jp2':
            //     img_out.toFormat('jp2');
            //     break;
            // case 'jph':
            //     img_out.toFormat('jph') //Soon besoin de OpenJPEG
            default:
                throw new Error(`Unsupported type "${this._type}"`);
        }
        img_out.toFile('dist/tmp.jpeg').then(() => console.log('Image converted'));
        return;
    }
}

export default ImageConverter;