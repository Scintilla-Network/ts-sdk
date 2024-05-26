// [{publicKey: string, signature: string}] or [{signature: string}] or [{identity: string, signature: string}] or [{identity: string, publicKey: string, signature: string}]
export interface ITransactionAuthorization {
    publicKey?: string;
    signature: string;
    moniker?: string;
}
