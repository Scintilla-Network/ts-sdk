const LUT_HEX_4b = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
// Initialize a lookup table for 8-bit values to hexadecimal (0x00 to 0xFF)
const LUT_HEX_8b = new Array(256);
for (let i = 0; i < 256; i++) {
    LUT_HEX_8b[i] = `${LUT_HEX_4b[(i >>> 4) & 0xF]}${LUT_HEX_4b[i & 0xF]}`;
}
export default function uInt8ArrayToHex(uInt8Array: Uint8Array): string {
    // return Buffer.from(uInt8Array).toString('hex');
    // return uInt8Array.reduce((t, byte) => t + byte.toString(16).padStart(2, '0'), '')
    // 3x faster than the above line
    let hexString = '';
    for (let i = 0; i < uInt8Array.length; i++) {
        hexString += LUT_HEX_8b[uInt8Array[i]];
    }
    return hexString;
}
