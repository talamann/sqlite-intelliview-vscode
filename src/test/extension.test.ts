import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import {
	BUILT_IN_SQLITE_FILE_EXTENSIONS,
	getSQLiteFileExtensions,
	isSQLiteFilePath,
	normalizeSQLiteFileExtension,
} from '../fileExtensions';
// import * as myExtension from '../../extension';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Sample test', () => {
		assert.strictEqual(-1, [1, 2, 3].indexOf(5));
		assert.strictEqual(-1, [1, 2, 3].indexOf(0));
	});

	test('recognizes every built-in SQLite extension', () => {
		const expectedExtensions = ['sqlite', 'sqlite3', 'db', 'db3', 's3db', 'sl3'];
		assert.deepStrictEqual([...BUILT_IN_SQLITE_FILE_EXTENSIONS], expectedExtensions);

		for (const extension of expectedExtensions) {
			assert.strictEqual(isSQLiteFilePath(`/tmp/database.${extension}`), true, extension);
		}
		assert.strictEqual(isSQLiteFilePath('/tmp/existing.db'), true);
	});

	test('matches built-in extensions case-insensitively', () => {
		assert.strictEqual(isSQLiteFilePath('/tmp/database.DB3'), true);
		assert.strictEqual(isSQLiteFilePath('/tmp/database.SqlItE3'), true);
		assert.strictEqual(isSQLiteFilePath('/tmp/database.S3Db'), true);
		assert.strictEqual(isSQLiteFilePath('/tmp/database.sL3'), true);
	});

	test('normalizes custom extensions with and without a leading dot', () => {
		const configured = ['.database', 'sqlite-backup'];
		assert.strictEqual(isSQLiteFilePath('/tmp/example.DATABASE', configured), true);
		assert.strictEqual(isSQLiteFilePath('/tmp/example.SQLite-Backup', configured), true);
	});

	test('ignores duplicate and invalid custom extensions', () => {
		const configured: unknown[] = [
			'.database',
			'DATABASE',
			' database ',
			'.DB',
			'',
			'   ',
			'.',
			'*.db',
			'foo.bar',
			'/tmp/db',
			42,
			null,
		];
		const extensions = getSQLiteFileExtensions(configured);

		assert.strictEqual(extensions.filter(extension => extension === 'database').length, 1);
		assert.deepStrictEqual(
			extensions,
			[...BUILT_IN_SQLITE_FILE_EXTENSIONS, 'database']
		);
	});

	test('does not recognize unrelated or malformed filenames', () => {
		assert.strictEqual(isSQLiteFilePath('/tmp/database.txt'), false);
		assert.strictEqual(isSQLiteFilePath('/tmp/database.db.backup'), false);
		assert.strictEqual(isSQLiteFilePath('/tmp/database'), false);
		assert.strictEqual(isSQLiteFilePath('/tmp/.db'), false);
	});

	test('normalizes extension values safely', () => {
		assert.strictEqual(normalizeSQLiteFileExtension(' .DaTaBase '), 'database');
		assert.strictEqual(normalizeSQLiteFileExtension('sqlite-backup'), 'sqlite-backup');
		assert.strictEqual(normalizeSQLiteFileExtension('foo.bar'), undefined);
		assert.strictEqual(normalizeSQLiteFileExtension(undefined), undefined);
	});
});
