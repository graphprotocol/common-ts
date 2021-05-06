// Writes bytes to a fixed size buffer with a capacity that is known upfront.
export class BytesWriter {
    private offset: number = 0;
    private data: Uint8Array;

    constructor(capacity: number) {
        this.data = new Uint8Array(capacity)
    }

    // Write a hex string to this buffer
    // The hex should start with 0x and have an even number of hexadecimal characters. 
    // This does no validation at all. Make sure the input is correct and that the 
    // writer has capacity.
    writeHex(hex: string) {
        // Help the optimizer maybe by lifting local variables
        let offset = this.offset;
        let data = this.data;

        // TODO: Performance
        // There are no great answers in JS,
        // but individual characters might be better. Need to profile.
        let iRead = 2; // Skips 0x
        while (iRead < hex.length) {
            let num = hex.slice(iRead, iRead + 2);
            data[offset++] = parseInt(num, 16);
            iRead += 2;
        }
        this.offset = offset;
    }


    unwrap(): Uint8Array {
        if (this.offset !== this.data.length) {
            throw new Error("Did not write correct number of bytes");
        }
        return this.data
    }
}