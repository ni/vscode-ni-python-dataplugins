import { crc32 } from 'crc';

class CRC {
    public static crc32(data: string): number {
        // The NI DataPlugins checksum is generated from a utf16le string
        const buffer = Buffer.from(data, 'utf16le');
        return crc32(buffer);
    }
}

export default CRC;
