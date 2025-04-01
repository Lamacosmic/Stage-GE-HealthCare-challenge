import { useState } from 'react';

const API_URL: string = import.meta.env.VITE_API_URL;// || 'http://localhost:8000';

function App() {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [type, setType] = useState<string | null>(null);
    const [convertedFileUrl, setConvertedFileUrl] = useState<string | null>(null);
    const [extension, setExtension] = useState<string | null>(null);

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);
        const droppedFile = event.dataTransfer.files[0];
        if (droppedFile && droppedFile.name.endsWith(".dcm")) {
            setFile(droppedFile);
        } else {
            alert("Select a .dcm file");
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setType(event.target.id);
    }

    const handleUpload = async() => {
        if (!file) {
            alert("Please select a .dcm file");
            return;
        }

        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await fetch(`${API_URL}/convert?type=${type}`, {
                method: "POST",
                body: formData,
            });

            const blob = await response.blob();
            const fileUrl = URL.createObjectURL(blob);
            setConvertedFileUrl(fileUrl);
            setExtension(type);
        } catch (error) {
            console.error("Upload Error:", error);
            alert("Upload Error.");
        }
    };


    return (
        <div style={{textAlign: 'center'}}>
            <div
                className={`${isDragging ? 'border-blue-500' : 'border-gray-400'}`}
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
            >
                {file ? file.name : "Drag and drop a .dcm file here"}
            </div>

            <fieldset style={{marginTop: '5%'}}>
                <legend>
                    Type de convertion
                </legend>
                <div>
                    <input type={'radio'} id={'JPEG'} name={'type'} onChange={handleChange} />
                    <label htmlFor="JPEG">JPEG</label>
                </div>
                <div>
                    <input type={'radio'} id={'JP2'} name={'type'} onChange={handleChange}/>
                    <label htmlFor="JPEG">JP2</label>
                </div>
                <div>
                    <input type={'radio'} id={'JPH'} name={'type'} onChange={handleChange}/>
                    <label htmlFor="JPEG">JPH</label>
                </div>
            </fieldset>

            <button
                style={{marginTop: '5%'}}
                onClick={handleUpload}
            >
                Upload file
            </button>

            {convertedFileUrl && (
                <div style={{marginTop: '5%'}}>
                    <a
                        href={convertedFileUrl}
                       download={`convert-file.${extension}`}
                    >
                        Download converted file
                    </a>
                </div>
            )}

            {convertedFileUrl && type==='JPEG' && (
                <div style={{marginTop: '5%'}}>
                    <img src={convertedFileUrl} alt="Image convertie" className="w-96 h-auto" />
                </div>
            )}

        </div>
    );
}

export default App;