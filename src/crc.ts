import { crc32 } from 'crc';

class CRC {
    public static crc32(data: string): number {
        // The NI DataPlugins checksum is generated from a utf16le string with LF only
        const lfData = data.replace(/\r\n/g, '\n');
        const buffer = Buffer.from(lfData, 'utf16le');
        return crc32(buffer);
    }
}

export default CRC;
