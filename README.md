# ADP Namasinghe Distribution Management System

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)
![Express](https://img.shields.io/badge/express-v5.1-blue)
![Prisma](https://img.shields.io/badge/prisma-v6.19-indigo)
![Electron](https://img.shields.io/badge/electron-33.0-9FEAF9)

Academic project for the BSc (Hons) in Software Engineering at NIBM. A full-stack distribution management system with role-based dashboards, inventory, orders, deliveries, payments, and analytics.

## Highlights

- Role-based access for management, operations, logistics, and suppliers
- End-to-end order and delivery workflows
- Inventory, payments, and reporting with PDF exports
- REST API with session-based auth

## Tech Stack

- Frontend: Vanilla JS, Lit, Tailwind CSS, Webpack
- Backend: Node.js, Express, Prisma
- Database: PostgreSQL
- Desktop shell: Electron

## Project Structure

- [api/](api/) REST API and session handling
- [src/](src/) SPA UI and assets
- [prisma/](prisma/) database schema and seed
- [docs/](docs/) diagrams and detailed documentation

## Quick Start

1. Install dependencies

```bash
npm install
```

2. Configure environment

Create a `.env` file at the project root:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DBNAME"
PORT=3000
```

3. Generate Prisma client and migrate your database

```bash
npx prisma generate
npx prisma migrate dev
```

4. Run the API server

```bash
npm run server
```

5. Run the frontend dev server

```bash
npm run dev
```

6. (Optional) Run Electron

```bash
npm run electron:dev
```

## Scripts

- `npm run dev` - Webpack dev server
- `npm run build` - Production build
- `npm run server` - API server
- `npm run electron:dev` - Electron app (build + run)
- `npm run electron:build` - Electron build

## Docs

- Overview: [docs/DOCUMENTATION.md](docs/DOCUMENTATION.md)
- Class diagram: [docs/CLASS_DIAGRAM.md](docs/CLASS_DIAGRAM.md)
- API routes: [api/README.md](api/README.md)

## License

MIT. See [package.json](package.json) for details.
