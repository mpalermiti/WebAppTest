# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a vanilla JavaScript web application built with Vite as the build tool and development server. The project uses modern ES modules and provides a fast development experience with hot module replacement (HMR).

## Development Commands

### Start Development Server
```bash
npm run dev
```
Starts the Vite dev server with HMR. The app will be available at `http://localhost:5173` (or next available port).

### Build for Production
```bash
npm run build
```
Creates an optimized production build in the `dist/` directory. Vite automatically:
- Minifies JavaScript and CSS
- Optimizes assets
- Generates source maps
- Bundles code for optimal delivery

### Preview Production Build
```bash
npm run preview
```
Serves the production build locally for testing before deployment. Runs on `http://localhost:4173` by default.

## Project Architecture

### Entry Points
- **`index.html`**: The main HTML entry point. Vite uses this as the root of the application. Contains a `<div id="app">` mount point and loads `src/main.js` as a module.
- **`src/main.js`**: The JavaScript entry point. Handles initial DOM rendering and imports all necessary modules (CSS, components, assets).

### Code Organization
- **`src/`**: All source code lives here
  - JavaScript files are ES modules using `import`/`export`
  - `style.css`: Global styles for the application
  - Component files (like `counter.js`) export functions that encapsulate behavior

- **`public/`**: Static assets served as-is without processing
  - Files here are copied directly to the build output
  - Use for assets that don't need optimization or hashing

### Module System
The project uses ES modules throughout:
- Use `import` for dependencies, components, styles, and assets
- Use `export` to expose functions and values from modules
- Vite handles all bundling and transforms automatically

### Component Pattern
Components follow a simple functional pattern:
- Export functions that accept DOM elements as parameters
- Encapsulate state and behavior within closures
- Attach event listeners directly to passed elements
- Example: `setupCounter()` in `counter.js`

## Key Points

- Vite automatically injects imported assets (images, SVGs) into the HTML as optimized URLs
- CSS imported in JavaScript is automatically injected into the page as `<style>` tags during development and bundled for production
- The dev server provides instant HMR - changes appear immediately without full page reloads
- Build output is optimized and ready for deployment to any static hosting service
