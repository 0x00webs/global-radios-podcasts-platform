import dataSource from './data-source';

async function run() {
	try {
		const ds = await dataSource.initialize();
		console.log('DataSource initialized. Running pending migrations...');
		const migrations = await ds.runMigrations();
		console.log(`Applied ${migrations.length} migration(s).`);
		await ds.destroy();
		process.exit(0);
	} catch (err) {
		console.error('Migration run failed:', err);
		process.exit(1);
	}
}

run();
