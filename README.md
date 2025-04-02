# Stage-GE-HealthCare-challenge
Exercise on image compression and the display of Jpeg 2000 and Jpeg2000 HT formats in the browser

# Run :

### Manual :

##### Dependency :

- Install OpenJPH : https://github.com/aous72/OpenJPH

##### Backend :
```
cd backend
npm install
npm run build
npm run start
```

##### Frontend :
```
cd frontend
npm install
npm run build
npm run preview
```

### Docker :

```
docker-compose up --build
```

# Data comparison :

| Format | Parameter      | Time (ms) | Size (KB) |
|--------|----------------|-----------|-----------|
| JPEG   | 100%           | 12.448    | 112.81    |
| JPEG   | 50%            | 10.32     | 7.74      |
| JPEG   | 1%             | 9.615     | 1.95      |
| JP2    | qstep 0.00001  | 21.283    | 394.03    |
| JP2    | qstep 0.25000  | 18.626    | 1.16      |
| JP2    | qstep 0.5      | 21.306    | 0.729     |
| JPH    | qstep 0.00001  | 22.891    | 394.03    |
| JPH    | qstep 0.25000  | 19.376    | 1.16      |
| JPH    | qstep 0.5      | 20.943    | 0.729     |

Note(1) : Time is an average of 10 http requests.

Note(2) : Starting image is 527.9 KB.

---

### Data interpretation

- JPEG :
  Decreasing the quality level allows for stronger, faster compression. However, lowering the quality ratio will obviously degrade the compressed image.

- JP2 / JPH
  Increasing the quantization step size for lossy compression has a huge impact on the compression rate, without changing the processing time.

Unfortunately, in the current code, for all formats, no quality rate verification algorithm is implemented. When viewing the JPEG image, the drop in quality is represented by a drop in resolution/pixelation.

For JP2 / JPH, viewing is not available. But increasing the qstep should in turn reduce quality.

### Remains to be done / bug

JP2 / JPH images cannot be displayed directly in the frontend.

However, converting to .JP2 doesn't seem to work because the recovered image displays nothing even in .JP2 display software.

# Source :

### Image :
- [Circle of Willis](https://3dicomviewer.com/dicom-library/)
- [manifest-1743030850389](https://nbia.cancerimagingarchive.net/nbia-search/?saved-cart=nbia-79801734441181908)
