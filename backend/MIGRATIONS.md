# Migrations

This project uses TypeORM migrations instead of `synchronize` to manage schema changes.

Guidelines

- We disable `synchronize` (always `false`) and run migrations in development automatically (`migrationsRun: true` in dev).
- Use the `data-source.ts` at the repository root for CLI or programmatic migration use.

Commands

- Generate a migration (via TypeORM CLI):

  ```bash
  # Example, replace <Name> with a descriptive name
  npx typeorm migration:generate -d ./data-source.ts src/migrations/<Name>
  ```

- Run migrations locally (programmatic runner):

  ```bash
  # From the backend/ folder
   run migrate:run
  ```

Notes

- The `data-source.ts` is configured to detect `.ts` sources during development and `.js` files in `dist` for production.
- Avoid enabling `synchronize: true` in development to prevent race-conditions and intermittent errors such as `duplicate key value violates unique constraint`.
