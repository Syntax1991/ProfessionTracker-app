# SynTrack

SynTrack replaces the previous World of Warcraft crafting
spreadsheet with a modular web application.

## MVP features

- Character management
- Up to two primary professions per character
- Profession coverage overview
- Configurable minimum crafting level
- Battle.net configuration status
- SQLite database with Prisma ORM
- React frontend and Express backend

## Architecture

Backend dependency flow:

Route -> Controller -> Service -> Repository -> Prisma

Frontend structure:

- app: routing and application composition
- features: business modules
- shared: reusable components and infrastructure
- styles: separated visual responsibilities

Source files are limited to 350 lines by an automated architecture
check.

## Start

Run the following commands from PowerShell:

cd D:\Projects\ProfessionTracker
npm run dev

Frontend:

http://localhost:5173

Backend:

http://localhost:4000/api/health

## Battle.net configuration

Add the credentials only to backend/.env:

BATTLENET_CLIENT_ID=
BATTLENET_CLIENT_SECRET=

Never commit the real client secret.