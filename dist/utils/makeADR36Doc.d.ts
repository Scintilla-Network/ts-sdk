export default function makeADR36Doc(message: any, publicKey: string | undefined): {
    chain_id: string;
    account_number: string;
    sequence: string;
    fee: {
        gas: string;
        amount: never[];
    };
    msgs: {
        type: string;
        value: {
            signer: string;
            data: string;
        };
    }[];
    memo: string;
};
//# sourceMappingURL=makeADR36Doc.d.ts.map