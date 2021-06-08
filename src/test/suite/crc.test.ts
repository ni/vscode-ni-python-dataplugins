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
});
