import { Buffer } from 'buffer';
// Magic number for the Scintilla Chain
export const CHAIN_SCINTILLA_1_MAGIC = Buffer.from(0xa1d691a8.toString(16), 'hex');
// Coin types for Scintilla, adhering to SLIP-0044
export const SCINTILLA_COIN_TYPE_MAINNET = 4369;
export const SCINTILLA_COIN_TYPE_TESTNET = 4370;
// HD wallet paths for Scintilla
export const SCINTILLA_COIN_HDPATH_MAINNET = `m/44'/${SCINTILLA_COIN_TYPE_MAINNET}'`;
export const SCINTILLA_COIN_HDPATH_TESTNET = `m/44'/${SCINTILLA_COIN_TYPE_TESTNET}'`;
// Bech32 prefix for Scintilla addresses
export const BECH32_PREFIX = 'sct';
//# sourceMappingURL=CONSTANTS.js.map