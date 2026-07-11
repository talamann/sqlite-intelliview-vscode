import Module = require('module');

const moduleWithLoader = Module as unknown as {
    _load: (request: string, parent: unknown, isMain: boolean) => unknown;
};
const originalLoad = moduleWithLoader._load;

moduleWithLoader._load = function loadWithVscodeMock(request: string, parent: unknown, isMain: boolean): unknown {
    if (request === 'vscode') {
        return {
            workspace: {
                getConfiguration: () => ({
                    get: (_name: string, defaultValue: unknown) => defaultValue
                })
            },
            window: {
                showWarningMessage: () => undefined,
                showErrorMessage: () => undefined,
                showInformationMessage: () => undefined
            },
            env: {
                appName: 'SQLite IntelliView Test'
            }
        };
    }
    return originalLoad.call(this, request, parent, isMain);
};
