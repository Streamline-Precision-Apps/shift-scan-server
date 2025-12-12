---
applyTo: "**/*.ts"
---

# Best Practices for Using Prisma ORM

## 1. Data Modeling

- **Keep your Prisma schema (`schema.prisma`) clean and well-organized.**
- **Use clear, descriptive model and field names.**
- **Leverage relations and referential actions** (e.g., `onDelete: Cascade`) for integrity.
- **Add comments to your models** for future maintainability.

## 2. Migrations & Database Management

- **Always use `prisma migrate`** to apply changes to your database schema.
- **Never edit your database schema directly**—make changes in `schema.prisma` and migrate.
- **Review migration SQL before applying in production.**
- **Use `prisma db pull`** to sync your Prisma schema with an existing database if needed.

## 3. Querying Data

- **Use the generated Prisma Client for all database access.**
- **Prefer `findUnique` over `findFirst` for fetching by unique fields.**
- **Use `select` and `include` to fetch only what you need**—avoid overfetching.
- **Paginate large result sets** (e.g., with `cursor`, `take`, and `skip`).

## 4. Handling Relationships

- **Model relations in your schema** (`@relation` attributes) and use nested queries for related data.
- **Update related records using nested writes** (create, update, connect, disconnect).

## 5. Error Handling & Transactions

- **Handle errors gracefully**; catch and log errors from Prisma Client.
- **Use transactions (`$transaction`)** for multi-step operations that must succeed or fail together.

## 6. Performance

- **Avoid N+1 query problems** by using `include`/`select` and batching.
- **Use connection pooling** in production environments.
- **Profile and optimize slow queries** using Prisma’s query logging.

## 7. Security

- **Never trust user input**—validate and sanitize before passing to Prisma.
- **Restrict query fields** to prevent leaking sensitive data.
- **Use environment variables for credentials** and connection strings.

## 8. Development Workflow

- **Keep schema and generated client in sync** (`prisma generate` after schema changes).
- **Version control your migrations** and schema file.
- **Use seeding scripts** (`prisma db seed`) to populate development/test data.

## 9. Upgrading and Maintenance

- **Keep Prisma CLI and client up to date** for new features and security patches.
- **Read release notes** before upgrading, especially for breaking changes.

## 10. Documentation & Learning

- **Reference the [Prisma documentation](https://www.prisma.io/docs/orm) regularly.**
- **Explore embedded links** for advanced guides (e.g., on [relations](https://www.prisma.io/docs/orm/prisma-schema/relations), [migrations](https://www.prisma.io/docs/orm/migrate), and [client API](https://www.prisma.io/docs/orm/client)).
- **Check the [Prisma GitHub Discussions](https://github.com/prisma/prisma/discussions)** and [community forums](https://www.prisma.io/community) for help or examples.

---

_Adhering to these best practices ensures robust, maintainable, and performant applications using Prisma ORM._
