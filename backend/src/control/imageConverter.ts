import fs from 'fs';

class ImageConverter {

    private _buffer: Buffer;
    private readonly _type: string;

    public constructor(path: string, type: string) {
        this._buffer = fs.readFileSync(path);
        this._type = type.toLowerCase();
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
        throw new Error("Not implemented."); //TODO
    }
}

export default ImageConverter;