import fs from 'fs';
import dicomParser, {DataSet, Element} from "dicom-parser";

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
        switch (this._type) {
            case "jpeg":
                this.toJpeg();
                break;
            default:
                throw new Error("Unsupported type " + this._type);
        }
        return;
    }

    private toJpeg():void {
        return;
    }
}

export default ImageConverter;