import * as fileutils from './file-utils';

class Example {
    private readonly _folder: string;
    private readonly _name: string;

    public constructor(folder: string, name: string) {
        this._folder = folder;
        this._name = name;
    }

    public get folder(): string {
        return this._folder;
    }

    public get name(): string {
        return this._name;
    }

    public getScriptPath(): string {
        return `${this._folder}\\${this._name}\\${this._name}.py`;
    }

    public async getDetails(): Promise<string> {
        return (await fileutils.readFirstLineOfFile(this.getScriptPath())).substring(2);
    }
}

export default Example;
