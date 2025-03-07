
# Timetable Generator

An AI-powered scheduling app that helps create optimized school and college timetables.

## Features

- AI-Generated Timetable Options
- Drag & Drop Editing
- Smart Constraints Management
- Export Options (Excel, PDF)
- Two-hour block support for longer lectures
- Responsive design

## Deployment on Vercel

This application is ready to deploy on Vercel. Follow these steps:

1. Push your code to a GitHub repository
2. Sign up for a Vercel account at [vercel.com](https://vercel.com)
3. Create a new project and import your GitHub repository
4. Use the following settings:
   - Framework Preset: Vite
   - Build Command: `vite build`
   - Output Directory: `dist`
   - Install Command: `npm install`
5. Deploy!

## Development

To run the application locally:

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Environment Variables

This application doesn't currently require environment variables, but you can configure them in Vercel if needed for future functionality.

## Tech Stack

- React with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- shadcn/ui component library
- React Query for data management
- React Router for routing
