# Math Facts Practice Generator

A clean, simple web application for generating multiplication practice worksheets. Perfect for teachers and parents to create customized math practice sheets that can be printed or used digitally.

## Features

- Generate multiplication practice problems (1-12 times tables)
- Choose specific times tables or mixed practice
- Adjustable number of problems per page (30, 50, or 60 problems)
- Print-optimized layout
- Optional name and date fields
- Clean, easy-to-read layout using Ubuntu Mono font
- Responsive design that works on any device

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd math_facts
```

2. Install dependencies:
```bash
npm install
```

### Development

To run the development server:
```bash
npm run dev
```

This will start the development server at `http://localhost:5173`

### Building for Production

To create a production build:
```bash
npm run build
```

This will create a `dist` directory with the production-ready files.

To preview the production build locally:
```bash
npm run preview
```

## Deployment

The built application is a static site that can be hosted on any web server or static hosting service. The contents of the `dist` directory after building contains everything needed to deploy the application.

Common deployment options:
- GitHub Pages
- Netlify
- Vercel
- Any standard web server (Apache, Nginx, etc.)

## Technology Stack

- React
- TypeScript
- Vite
- Tailwind CSS

## License

This project is open source and available under the MIT License.
