import {bech32} from "./bech32.js";
import {ripemd160} from "@noble/hashes/ripemd160";
import {sha256} from "@noble/hashes/sha256";
import {Buffer} from "buffer";
import uint8ArrayToBase64 from "./uint8ArrayToBase64.js";
import * as console from "console";

export default function makeADR36Doc(message: any, publicKey: string | undefined){
    if(!publicKey){
        throw new Error('Public key is required for ADR36.');
    }
    let data = message;
    if(data.toUInt8Array){
        data = data.toUInt8Array({excludeAuthorization: true});
    }

    // expect publicKey to be a hex string, throw error if not
    if(typeof publicKey !== 'string'){
        throw new Error(`Public key must be a hex string. Received: ${typeof publicKey} - ${JSON.stringify(publicKey)}`);
    }


    // console.log('ts.message', message)
    // console.log('ts.message as data', data, data.toString('hex'));
    // data = Buffer.from(data, 'hex');
    // const signer = message._publicKey;

    console.log(`publicKey: ${publicKey}`,publicKey)
    //@ts-ignore
    console.log(`signer: ${bech32.encode('sct', bech32.toWords(ripemd160(sha256(Buffer.from(publicKey, 'hex')))))}`)

    const madeDoc =  {
        "chain_id": "",
        "account_number": "0",
        "sequence": "0",
        "fee": {
            "gas": "0",
            "amount": []
        },
        "msgs": [
            {
                "type": "sign/MsgSignData",
                "value": {
                    //@ts-ignore
                    "signer": bech32.encode('sct', bech32.toWords(ripemd160(sha256(Buffer.from(publicKey, 'hex'))))),
                    "data": uint8ArrayToBase64(data),
                }
            }
        ],
        "memo": ""
    };

    // console.dir(madeDoc, {depth: null});
    return madeDoc;
}
