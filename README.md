# SnipShare

<p align="center">
  <img src="public/snipshare-logo.svg" alt="SnipShare Logo" width="120" />
</p>

A beautiful code snippet editor and sharing tool built with Next.js 14.2.30. SnipShare allows developers to create, customize, and share code snippets with syntax highlighting and various themes.

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14.2.30-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.4-blue)](https://www.typescriptlang.org/)

This project is built with [Next.js](https://nextjs.org/) and was bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- npm or yarn
- PostgreSQL database
- GitHub account (for OAuth)

### Local Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/snipshare.git
   cd snipshare
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Set up your environment variables:
   ```bash
   cp .env.example .env
   ```
   Then edit the `.env` file with your configuration.

4. Set up the database:
   ```bash
   npx prisma migrate dev --name init
   ```

5. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## GitHub App Setup

To enable GitHub integration, you'll need to create a GitHub OAuth App:

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the following details:
   - **Application name**: SnipShare
   - **Homepage URL**: `http://localhost:3000` (for development) or your production URL
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github` (for development) or your production URL

4. After registering the app, you'll get a Client ID. Generate a new client secret.
5. Update your `.env` file with these values:
   ```
   GITHUB_ID=your_client_id_here
   GITHUB_SECRET=your_client_secret_here
   ```

## Development

To start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Features

- **Syntax Highlighting**: Support for multiple programming languages
- **Customizable Themes**: Choose from various editor themes
- **Responsive Design**: Works on desktop and mobile devices
- **Share Snippets**: Easily share your code snippets with others
- **User Authentication**: Save and manage your snippets
- **Keyboard Shortcuts**: Improve your workflow efficiency

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## About Me

Hi, I'm Mintah Andrews, a passionate developer focused on creating beautiful and functional web applications. I specialize in modern JavaScript frameworks, particularly Next.js and React, and enjoy building tools that help other developers be more productive.

Connect with me:
- GitHub: [mintahandrews](https://github.com/mintahandrews)
- Twitter: [@codemintah](https://x.com/codemintah)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Environment Variables

This project uses environment variables for configuration. Copy the `.env.example` file to create your own `.env` file:

```bash
cp .env.example .env
```

Then update the values in your `.env` file with your actual credentials:

```
# Database connection
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require

# Authentication (for NextAuth.js)
NEXTAUTH_URL=http://localhost:3000/api/auth/callback/github
NEXTAUTH_SECRET=your-secret-key

# GitHub OAuth
GITHUB_ID=your-github-oauth-app-id
GITHUB_SECRET=your-github-oauth-app-secret
```

**Important:** Never commit your `.env` file or any file containing secrets to GitHub. The `.gitignore` file is configured to exclude these files, but always double-check before committing.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.
