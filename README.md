# TechNest.app 🚀

A central hub for technology events in São Paulo.

## Overview

TechNest.app is a web application that centralizes all technology-related events taking place in São Paulo. The main goal is to create a hub where users can easily discover upcoming tech events and show their interest in attending. The platform is community-focused, lightweight, and built to be fast and accessible.

## Technologies

- **Frontend & Backend**: Next.js 13+ with App Router and TypeScript
- **Styling**: TailwindCSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Deployment**: Vercel

## Features

- 📅 Browse upcoming tech events
- 🔍 Search and filter events by category, date, and format
- 👥 Show interest in events
- 📝 Create and publish your own events
- 👤 User profiles and authentication
- 📱 Responsive design for all devices

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/technest.git
cd technest
```

2. Install dependencies:
```
npm install
```

3. Copy the environment variables file and configure it:
```
cp .env.example .env
```

4. Set up your DATABASE_URL in the .env file.

5. Run the database migrations:
```
npx prisma migrate dev
```

6. Start the development server:
```
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
TechNest/
├── prisma/          # Database schema and migrations
├── public/          # Static assets
├── src/
│   ├── app/         # App router pages and API routes
│   ├── components/  # Reusable UI components
│   └── lib/         # Utility functions and shared code
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Deployment

The application is designed to be deployed on Vercel using the custom domain technest.app.

---

Built with ❤️ for the tech community in São Paulo 🇧🇷