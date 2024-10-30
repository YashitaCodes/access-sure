# Accessibility Auditor 🛠️

[![Next.js](https://img.shields.io/badge/Next.js-v13.4.10-blue?style=flat-square&logo=nextdotjs)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.0.4-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000?style=flat-square&logo=vercel)](https://vercel.com)
[![WCAG Compliant](https://img.shields.io/badge/WCAG%202.1-Compliant-brightgreen?style=flat-square)](https://www.w3.org/WAI/standards-guidelines/wcag/)
[![License](https://img.shields.io/github/license/YashitaCodes/access-sure?style=flat-square)](LICENSE)
[![Issues](https://img.shields.io/github/issues/YashitaCodes/access-sure?style=flat-square)](https://github.com/YashitaCodes/access-sure/issues)
[![Stars](https://img.shields.io/github/stars/YashitaCodes/access-sure?style=social)](https://github.com/YashitaCodes/access-sure/stargazers)

A lightweight, TypeScript-based **accessibility auditing tool** built on Next.js to assess web content for WCAG compliance and other accessibility standards.

## Key Features

- **ARIA Attributes**: Ensures all roles match their ARIA attributes.
- **Button Accessibility**: Checks that all buttons have accessible names.
- **Image Alt Text**: Verifies that all images have descriptive `alt` attributes.
- **Form Labels**: Confirms that all form inputs have associated labels.
- **Color Contrast**: Meets WCAG contrast guidelines for readability.
- **Keyboard Accessibility**: Guarantees all interactive elements are fully keyboard accessible.
- **Logical Headings**: Ensures headings follow a structured order.
- **No Auto-Playing Media**: Enforces no autoplay for any media elements.

## Quick Demo

The home page provides a streamlined search bar for easy page access:

![Search Bar Home Page Screenshot](public/assets/home.png)

Upon searching a page URL, Accessibility Auditor displays the results of the audit, as shown below:

![Results Screenshot](public/assets/audit-results.png)

### Get Started
To clone and run this locally, follow these steps:

```bash
git clone https://github.com/YashitaCodes/access-sure.git
cd access-sure
npm install
npm run dev
```
