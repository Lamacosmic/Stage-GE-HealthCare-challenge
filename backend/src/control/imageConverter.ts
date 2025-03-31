import fs from 'fs';
import dicomParser, {DataSet, Element} from 'dicom-parser';
import sharp from 'sharp';
import {execSync} from "node:child_process";
import {Buffer} from "node:buffer";

class ImageConverter {
    get type(): string {
        return this._type;
    }

    private readonly _pixels;
    private readonly _type: string;
    private readonly _width: number;
    private readonly _height: number;

    public constructor(path: string, type: string) {
        this._type = type.toLowerCase();
        const dataset: DataSet = dicomParser.parseDicom(fs.readFileSync(path)); // lecture et parsing de l'image

        const pixelData: Element = dataset.elements.x7fe00010; //recuperation des valeurs des pixels sans les metadata
        this._width = dataset.uint16("x00280011") || 0;
        this._height = dataset.uint16("x00280010") || 0;

        if (!pixelData || !this._width && !this._height) {
            throw new Error("Could not parse image data.");
        }

        this._pixels = new Uint16Array(dataset.byteArray.buffer, pixelData.dataOffset, pixelData.length / 2);
        return;
    }

    public async convert(): Promise<void> {

        const pixelBuffer = Buffer.alloc(this._width * this._height * 3);

        for (let i = 0; i < this._width * this._height; i++) {
            const value = (this._pixels[i] / (1 << 12)) * 255; // 12 est pas 16 car l'image est sous 12 bit mais 16 sont alloue
            pixelBuffer[i * 3] = value;
            pixelBuffer[i * 3 + 1] = value;
            pixelBuffer[i * 3 + 2] = value;
        }

        switch (this._type) {
            case 'jpeg':
                await sharp(pixelBuffer, {raw: {width: this._width, height: this._height, channels: 3}})
                    .toFormat('jpeg')
                    .toFile('dist/out.jpeg');
                break;
            case 'jp2':
            case 'jph':
                const ppmFile = 'dist/tmp.ppm';
                this.toPPM(ppmFile, pixelBuffer);
                const cmd = `ojph_compress -i ${ppmFile} -o dist/out.${this._type}`;
                execSync(cmd);
                fs.unlinkSync(ppmFile);
                break;
            default:
                throw new Error(`Unsupported type "${this._type}"`);
        }
        return;
    }

    private toPPM(ppmpath: string, buffer: Buffer): void {
        const header = `P6\n${this._width} ${this._height}\n255\n`;
        fs.writeFileSync(ppmpath, Buffer.concat([Buffer.from(header), buffer]));
    }
}

export default ImageConverter;