export interface ISigner {
    moniker: string;
    sign: (data: string) => string; // Adjust the return type as per the actual sign function
}
