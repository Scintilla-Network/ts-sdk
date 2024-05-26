/**
 * Calculates a target hash based on the given difficulty.
 * @param {number} difficulty - The current mining difficulty.
 * @returns {string} The target hash as a hexadecimal string.
 */
export default function getTargetHash(difficulty: bigint) {
    const maxHash = BigInt("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF");

    const target = difficulty === BigInt(0) ? maxHash
        : maxHash / BigInt(difficulty)

    return target.toString(16).padStart(64, '0');
}
