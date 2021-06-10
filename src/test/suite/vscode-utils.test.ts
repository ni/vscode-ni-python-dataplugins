import * as assert from 'assert';
import * as vscu from '../../vscode-utils';

suite('VSCode-Utils Test Suite', () => {
    test('should correctly return validity for a file extension input string', () => {
        assert.ok(vscu.isValidFileExtensionInput('*.csv'));
        assert.ok(vscu.isValidFileExtensionInput('*.csv;'));
        assert.ok(vscu.isValidFileExtensionInput('*.csv;*.txt'));
        assert.ok(vscu.isValidFileExtensionInput('*.csv;*.txt;'));
        assert.ok(vscu.isValidFileExtensionInput('*.csv; *.txt;'));

        assert.ok(vscu.isValidFileExtensionInput('csv') === false);
        assert.ok(vscu.isValidFileExtensionInput('csv;') === false);
        assert.ok(vscu.isValidFileExtensionInput('.csv') === false);
        assert.ok(vscu.isValidFileExtensionInput('.csv;') === false);
        assert.ok(vscu.isValidFileExtensionInput('*.csv;;') === false);
        assert.ok(vscu.isValidFileExtensionInput('*.csv*.txt') === false);
        assert.ok(vscu.isValidFileExtensionInput('*.csv;.txt;') === false);
        assert.ok(vscu.isValidFileExtensionInput('*.csv;txt;') === false);
    });
});
