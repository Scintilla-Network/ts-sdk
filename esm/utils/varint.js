export function encodeVarInt(num) {
    let buffer = [];
    // Ensure the input is a BigInt for consistency
    if (typeof num !== 'bigint') {
        num = BigInt(num);
    }
    do {
        let byte = Number(num & BigInt(0x7F)); // Extract 7 bits from the number
        num >>= BigInt(7); // Right-shift by 7 bits
        // If there are more bits, set the MSB of this byte
        if (num > BigInt(0)) {
            byte |= 0x80;
        }
        buffer.push(byte);
    } while (num > 0);
    return Buffer.from(buffer);
}
export function decodeVarInt(buffer) {
    let num = BigInt(0); // Start with BigInt for unified operations
    let offset = 0;
    while (true) {
        const byte = buffer[offset++];
        num += BigInt(byte & 0x7F) << BigInt(7 * (offset - 1)); // Always use BigInt for operations
        // Stop when the MSB is not set
        if ((byte & 0x80) === 0)
            break;
    }
    // Convert to Number if within the safe range, otherwise keep as BigInt
    if (num <= BigInt(Number.MAX_SAFE_INTEGER)) {
        return { value: Number(num), length: offset }; // Return both the value and the length
    }
    return { value: num, length: offset }; // Return both the value but as BigInt and the length
}
//# sourceMappingURL=varint.js.map