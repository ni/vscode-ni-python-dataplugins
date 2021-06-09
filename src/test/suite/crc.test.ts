import * as assert from 'assert';
import CRC from '../../crc';

suite('CRC Test Suite', () => {
    test('should create the correct crc of a simple string', () => {
        const expectedResult = 1698750118;
        const crc = CRC.crc32('class Plugin:');
        assert.ok(expectedResult === crc);
    });

    test('should create the correct crc of a more complex string', () => {
        const expectedResult = 337652373;
        const crc = CRC.crc32('class Plugin: コピ ✔❌😊');
        assert.ok(expectedResult === crc);
    });

    test('should create the correct crc for a string with CRLF', () => {
        const expectedResult = 102738629;
        const crlfString = CRC.crc32(
            '# A simple "hello world" example for CSV-like files\r\nimport os\r\nfrom pathlib import Path\r\n\r\n\r\nclass Plugin:'
        );
        assert.ok(expectedResult === crlfString);
        const lfString = CRC.crc32(
            '# A simple "hello world" example for CSV-like files\nimport os\nfrom pathlib import Path\n\n\nclass Plugin:'
        );
        assert.ok(expectedResult === lfString);
    });
});
