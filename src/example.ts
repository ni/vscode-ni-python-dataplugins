import * as path from 'path';
import * as fileutils from './file-utils';

class Example {
    public readonly folder: string;
    public readonly name: string;

    public constructor(folder: string, name: string) {
        this.folder = folder;
        this.name = name;
    }

    public getScriptPath(): string {
        return path.join(this.folder, `${this.name}.py`);
    }

    public async getDetails(): Promise<string> {
        return (await fileutils.readFirstLineOfFile(this.getScriptPath())).substring(2);
    }
}

export default Example;
