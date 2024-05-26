export default function uint8ArrayToBase64(uInt8Array) {
    // return Buffer.from(uint8Array).toString('base64');
    let binaryString = '';
    const len = uInt8Array.length;
    for (let i = 0; i < len; i++) {
        binaryString += String.fromCharCode(uInt8Array[i]);
    }
    return btoa(binaryString);
}
//# sourceMappingURL=uint8ArrayToBase64.js.map