export default function base64ToHex(str) {
    const buffer = Buffer.from(str, 'base64');
    const bufString = buffer.toString('hex');
    return bufString;
}
//# sourceMappingURL=base64ToHex.js.map