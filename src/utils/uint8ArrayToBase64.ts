export default function uint8ArrayToBase64(uInt8Array: Uint8Array): string {
    // return Buffer.from(uint8Array).toString('base64');
    let binaryString = '';
    const len = uInt8Array.length;
    for (let i = 0; i < len; i++) {
        binaryString += String.fromCharCode(uInt8Array[i]);
    }
    return btoa(binaryString);
}
