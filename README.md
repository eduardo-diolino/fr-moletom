Technical and Functional System Documentation: FR Moletom

1. Project Overview
FR Moletom is a modern, high-performance platform designed to optimize operations, sales tracking, inventory, and financial metric monitoring. Combining an extremely fluid and intuitive user interface with a robust security administrative panel, the system acts as the digital command center for the strategic management of the business.

System Objectives

Total Control: Agile management of products, categories, variations (sizes/colors), orders, and customers.

Statistical Analysis: Graphical visualization of revenue, daily sales, top-selling products, and lead conversion rates.

Enterprise-Grade Security: Strict restriction of administrative access through multiple server-based security factors.

2. Architecture & Technologies Used
The application uses a Modern Full-Stack architecture based on the SPA (Single Page Application) model served by a secure intermediary API:

Frontend:

React (v18+) with TypeScript for building strongly typed, dynamic interfaces free of runtime errors.

Vite as a high-performance bundler.

Tailwind CSS for refined, responsive, and ultra-fast loading utility styling.

Motion (Framer Motion) for elegant micro-interactions and fluid screen transitions.

Lucide React as a unified modern icon library.

Recharts / D3.js for rendering charts and managerial reports in real-time.

Backend (Secure Proxy Server):

Node.js with Express.

Esbuild for optimized server bundling in production (dist/server.cjs).

Acts as a secure authentication gateway for administrative credentials and sensitive environment variable management.

Database & Infrastructure:

Firebase Authentication for user management.

Cloud Firestore for NoSQL data storage of products, sales, administrative logs, and system configurations.

3. Security Flow (Anti-Hacker Security)
One of the system's highest priorities was to shield the administrative panel against common cyberattacks, such as code inspection (DevTools) and reverse engineering attacks.

Secure Authentication Architecture

Plaintext
[Browser (Frontend)] 
      │ 
      │ 1. Sends entered Email and Password (Without exposing credentials in code)
      ▼
[Express Server (Backend)] 
      │ 
      │ 2. Compares locally using environment variables (ADMIN_EMAIL, ADMIN_PASSWORD)
      ▼
[Encrypted Response / Token Release]
Exclusion of Sensitive Data in the Frontend: Master administration emails and passwords are never stored or verified directly in the browser code.

Server Credential Proxy: The administrative login makes internal calls to the /api/admin/verify-credentials route. All password comparison logic occurs exclusively on the Server-Side, using secure keys configured in the environment (.env).

Generic Error Response: If any credential or email is entered incorrectly, the system displays a standardized message: "Incorrect login or password!!", preventing attackers from deducing whether the entered email exists in the database (technique against Username Enumeration).

Multi-Factor Authentication (2FA/MFA): After validating the email and password credentials on the server, the system requires a dynamically generated code from mobile authenticator apps (such as Google Authenticator or Microsoft Authenticator), preventing access even if the main password is compromised.

4. Main System Features
📊 General Metrics Panel (Dashboard)

Monthly Revenue Chart: Linear and bar tracking of actual billing.

Quick Statistics: Counter for new orders, active products, average revenue, and pending shipment items.

Inventory Status: Visual and automated alerts for products with low stock levels.

📦 Product and Inventory Control

Comprehensive Registration: Product creation with name, detailed description, pricing (cost, sale, and promotional), images, and SKUs.

Advanced Variations: Parameterized grid registration by Sizes (S, M, L, XL, XXL) and Colors.

Smart Filters: Quick search and organization by categories, brands, or stock availability.

🛒 Integrated Order Management

Dynamic Statuses: Transition of orders through stages: Pending, Paid, Preparing Shipment, Shipped, Delivered, and Canceled.

Customer History: Association of orders to specific customer profiles for repurchase and loyalty analysis.

🔒 Administrative Center and Logs

2-Factor Authentication (2FA): Focused, minimalist, and clean screen for quick insertion of the numeric token generated on the mobile device.

Protected Sessions: Use of secure and temporary browser caching (synchronized and validated localStorage).

5. Project Folder Structure
Below is the mapping of the files that make up the technical solution:

Plaintext
├── .env.example                  # Environment variables template (No exposed values)
├── package.json                  # Dependencies manifest and automation scripts
├── server.ts                     # Entry point for the Express backend server (Security Proxy)
├── vite.config.ts                # Frontend bundling and compilation configuration
├── index.html                    # Main HTML page
├── src/
│   ├── main.tsx                  # React initialization file
│   ├── index.css                 # Tailwind CSS import and theme definitions
│   ├── App.tsx                   # Central router and application layout
│   ├── types.ts                  # Central hub for TypeScript interfaces and data types
│   └── components/
│       └── Pages/
│           ├── AdminDashboard.tsx # The core of the Administrative Panel, charts, and security
│           └── [Other Auxiliary Components...]
6. Development Lifecycle (From Draft to Production)
The development of this software followed the most rigorous software engineering standards of today:

Phase 1: Drafting and Requirements Architecture: Definition of the scope focusing on an excellent user experience for apparel and hoodie retailers. Mapping of the ideal NoSQL structures for Firestore (aiming for the lowest possible read/write consumption).

Phase 2: User Interface Construction (UI/UX): Interface development using professional design standards: generous use of whitespace, clean typography (Inter for general interface elements and JetBrains Mono for logs and technical data), charcoal gray tones, and striking contrasts to prevent operator eye strain.

Phase 3: Security Layer and Server Proxy: Replacement of fragile client-side login rules with synchronous API calls to the Express server (/api/admin/verify-credentials). Refactoring of administrative bypass flows and complete concealment of any master email, ensuring security against local intrusions or JavaScript packet inspections.

Phase 4: Production Optimization: Build configuration to compile and bundle all Express server TypeScript code into a single CJS output file (dist/server.cjs), ensuring maximum performance in the cloud and reducing physical resource consumption of the hosting infrastructure.

7. Installation and Execution Instructions (Local Use or Staging)
Prerequisites

Have Node.js installed (version 18 or higher).

Dependency Installation
In the project's root directory, run the command below to install all packages:

Bash
npm install
Environment Configuration (.env)

Create a file named .env in the root of the project.

Copy the fields from .env.example and fill them with the desired administrative credentials:

Snippet de código
ADMIN_EMAIL="your_email_here"
ADMIN_PASSWORD="your_secure_password_here"
Execution in Development Mode
To run the project locally with fast reload, use:

Bash
npm run dev
The project will be available at the address: http://localhost:3000.

Compilation and Start in Production
To generate the optimized version ready for publication on cloud servers (like Cloud Run, AWS, VPS):

Bash
# Compiles the frontend and the secure backend server
npm run build

# Starts the application using the optimized production artifacts
npm run start
