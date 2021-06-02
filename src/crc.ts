import { crc32 } from 'crc';

class CRC {
    public static crc32(data: string): number {
        const buffer = Buffer.from(data, 'utf16le');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
        return crc32(buffer);
    }
}

export default CRC;
