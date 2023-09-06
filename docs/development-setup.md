# Development Setup

This document outlines the steps required to set up your Osmo-Notify for development. By following these steps, you'll be able to run your application locally with the necessary environment variables and database configuration.

Certainly! Here's the list of prerequisites with version numbers for Osmo-Notify's development setup:

## Prerequisites

Before setting up Osmo-Notify for development, ensure you have the following prerequisites with the specified versions:

- **NVM (Node Version Manager):** Use NVM to manage Node.js versions.
- **Node.js** Node.js v18.x or higher.
- **Git:** Git v2.x or higher.
- **MariaDB:** MariaDB v10.x or higher.
- **Redis:** Redis v6.x or higher

These prerequisites are essential for deploying and running Osmo-Notify in a environment.

Please make sure to have these versions installed on your development server before proceeding with the setup.

Make sure Redis and MariaDB server are up and running.

## Getting Started

1. Clone the repository to your local machine:

   ```sh
   git clone https://github.com/OsmosysSoftware/osmo-notify.git
   cd osmo-notify
   ```

2. Install project dependencies:

   ```sh
   npm install
   ```

3. Create a `.env` file in the project root and add the required environment variables:

   ```env
   # Server
   SERVER_PORT=3000

   # Database configuration
   DB_TYPE=mysql
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=root
   DB_PASSWORD=your-password
   DB_NAME=your-database

   # Redis configuration
   REDIS_HOST=127.0.0.1
   REDIS_PORT=6379

   # SMTP
   SMTP_HOST=smtp.example.com
   SMTP_PORT=587
   SMTP_USERNAME=your-smtp-username
   SMTP_PASSWORD=your-smtp-password

   # Mailgun
   MAILGUN_API_KEY=your-mailgun-api-key
   MAILGUN_HOST=api.mailgun.net
   MAILGUN_DOMAIN=your.mailgun.domain

   # TEMP
   APP_NAME=osmo_notify
   ```

Make sure to replace the above example values with appropriate values as per your setup and configuration. Server Port is `3000`, you can update it if you want to use a different port of your choice.

4. Set up the database:

   - Ensure your database server (e.g., MariaDB) is running.
   - Run database migrations to create tables:

     ```sh
     npm run typeorm:migrate
     ```

5. Start the development server:

   ```sh
   npm run start:dev
   ```

Osmo-Notify will now be running locally at `http://localhost:3000`.