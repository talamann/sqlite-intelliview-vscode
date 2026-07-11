import * as path from 'path';

export const BUILT_IN_SQLITE_FILE_EXTENSIONS = Object.freeze([
    'sqlite',
    'sqlite3',
    'db',
    'db3',
    's3db',
    'sl3',
]);

const VALID_EXTENSION_PATTERN = /^[a-z0-9][a-z0-9_-]*$/i;

export function normalizeSQLiteFileExtension(value: unknown): string | undefined {
    if (typeof value !== 'string') {
        return undefined;
    }

    const trimmed = value.trim();
    const withoutLeadingDot = trimmed.startsWith('.') ? trimmed.slice(1) : trimmed;
    if (!VALID_EXTENSION_PATTERN.test(withoutLeadingDot)) {
        return undefined;
    }

    return withoutLeadingDot.toLowerCase();
}

export function getSQLiteFileExtensions(additionalExtensions: readonly unknown[] = []): string[] {
    const extensions = new Set<string>(BUILT_IN_SQLITE_FILE_EXTENSIONS);

    for (const value of additionalExtensions) {
        const normalized = normalizeSQLiteFileExtension(value);
        if (normalized) {
            extensions.add(normalized);
        }
    }

    return Array.from(extensions);
}

export function isSQLiteFilePath(filePath: string, additionalExtensions: readonly unknown[] = []): boolean {
    const extension = normalizeSQLiteFileExtension(path.extname(filePath));
    return extension !== undefined && getSQLiteFileExtensions(additionalExtensions).includes(extension);
}
