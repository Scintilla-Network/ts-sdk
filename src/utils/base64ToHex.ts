export default function base64ToHex(str: string) {
    const buffer = Buffer.from(str, 'base64');
    const bufString = buffer.toString('hex');
    return bufString;
}
