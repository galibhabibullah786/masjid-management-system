# Amanat-E-Nazirpara Masjid Management System

A comprehensive full-stack web application for managing mosque committee information, contributions, land donations, gallery, and administrative operations for Amanat-E-Nazirpara Masjid.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-9.1.1-green)](https://www.mongodb.com/)

## 📚 Documentation

For complete documentation, please refer to the root directory:

- **[Deployment Guide](../DEPLOYMENT.md)** - Step-by-step deployment to Render
- **[Contributing](../CONTRIBUTING.md)** - Contribution guidelines
- **[Security](../SECURITY.md)** - Security policies

## 🚀 Features

### Public Portal
- **📱 Responsive Design**: Mobile-first, fully responsive design with Islamic-themed UI
- **🏛️ Home Page**: Hero section with mosque information, statistics, and mission
- **📊 Statistics Dashboard**: Real-time display of total contributions, land donations, and contributors
- **👥 Committee Information**: Current and historical committee member profiles with timeline view
- **💰 Contributions**: Transparent display of donations with filtering and search capabilities
- **🏞️ Gallery**: Image gallery with categories (Foundation, Construction, Events, Final Look, Ceremony)
- **📧 Contact Form**: Integrated contact system with email notifications
- **ℹ️ About Page**: Detailed information about the mosque and its mission
- **📜 Legal Pages**: Terms of Service and Privacy Policy pages

### Admin Dashboard
- **🔐 Secure Authentication**: JWT-based authentication with role-based access control
- **👤 User Management**: Manage administrators and photographers with different permission levels
- **💳 Contribution Management**: 
  - Add, edit, delete contributions
  - Receipt generation with unique numbers
  - PDF receipt download functionality
  - Cash and material contribution tracking
  - Verification and status management
- **🏗️ Committee Management**: 
  - Create and manage current and past committees
  - Member profiles with photos, contact info, and bios
  - Hierarchical designation system
  - Timeline visualization
- **🌳 Land Donor Management**: 
  - Track land donations with custom units
  - Location and date information
  - Verification system
  - Photo uploads for donors
- **🖼️ Gallery Management**: 
  - Upload images to Cloudinary
  - Categorization and tagging
  - Featured image selection
  - Order management
  - Bulk operations support
- **📈 Analytics Dashboard**: 
  - Real-time statistics
  - Monthly contribution trends
  - Growth metrics
  - Activity monitoring
- **🔔 Activity Logs**: Track all administrative actions
- **⚙️ Settings Management**: Configure site-wide settings
- **📤 Export Functionality**: Export data to CSV/Excel
- **📄 Pagination**: Efficient data loading with pagination

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16.1.1 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: Custom components with Lucide React icons
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js with Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with jose library
- **Password Hashing**: bcryptjs
- **Image Storage**: Cloudinary
- **Email**: Nodemailer
- **Validation**: Zod schemas

### Development Tools
- **Package Manager**: pnpm
- **Code Quality**: ESLint
- **TypeScript**: Strict type checking
- **React Compiler**: Enabled for performance optimization

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js**: v18.0.0 or higher
- **pnpm**: v8.0.0 or higher (install with `npm install -g pnpm`)
- **MongoDB**: v6.0 or higher (local or cloud instance)
- **Git**: For version control

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/amanat-e-nazirpara.git
cd amanat-e-nazirpara/frontend-combined
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Environment Configuration

- Copy `.env.example` file and rename it into `.env` or `.env.local`.
- Change the variable values inside the new renamed file.

### 4. Database Seeding (Optional)

Seed initial admin user and sample data:

```bash
pnpm seed
```

This will create:
- Default admin user (email: admin@example.com, password: admin123)
- Sample committee data
- Sample statistics

### 5. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Production Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## 🎯 Project Structure

```
frontend-combined/
├── public/                    # Static assets
│   └── images/               # Public images
├── scripts/                   # Utility scripts
│   └── seed.ts               # Database seeding script
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── (public)/        # Public-facing pages
│   │   │   ├── about/
│   │   │   ├── committees/
│   │   │   ├── contributions/
│   │   │   ├── gallery/
│   │   │   ├── privacy/
│   │   │   └── terms/
│   │   ├── admin/           # Admin dashboard
│   │   │   ├── dashboard/
│   │   │   └── login/
│   │   ├── api/             # API routes
│   │   │   ├── auth/        # Authentication endpoints
│   │   │   ├── committees/  # Committee CRUD
│   │   │   ├── contributions/
│   │   │   ├── gallery/
│   │   │   ├── land-donors/
│   │   │   └── users/
│   │   ├── maintenance/     # Maintenance mode page
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Home page
│   ├── components/          # React components
│   │   ├── admin/          # Admin-specific components
│   │   ├── committees/     # Committee components
│   │   ├── contributions/  # Contribution components
│   │   ├── gallery/        # Gallery components
│   │   ├── home/           # Home page sections
│   │   └── ui/             # Reusable UI components
│   ├── hooks/              # Custom React hooks
│   │   └── useSession.ts   # Authentication hook
│   ├── lib/                # Utility libraries
│   │   ├── db/            # Database configuration
│   │   │   ├── connection.ts
│   │   │   ├── models.ts
│   │   │   └── index.ts
│   │   ├── api.ts         # API client
│   │   ├── auth.ts        # Authentication utilities
│   │   ├── cloudinary.ts  # Cloudinary integration
│   │   ├── constants.ts   # App constants
│   │   ├── permissions.ts # Permission checks
│   │   ├── types.ts       # TypeScript types
│   │   ├── utils.ts       # Helper functions
│   │   └── validations.ts # Zod schemas
│   └── middleware.ts       # Next.js middleware for auth
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

## 🔐 Authentication & Authorization

### User Roles
- **Super Admin**: Full system access
- **Admin**: Manage content and users (limited permissions)
- **Photographer**: Upload and manage gallery images only

### Protected Routes
All admin routes are protected by middleware that validates JWT tokens and user roles.

### Default Credentials (After Seeding)
- **Email**: admin@amanat.com
- **Password**: admin123

⚠️ **Important**: Change these credentials immediately in production!

## 🔍 API Endpoints

### Public Endpoints
- `GET /api/public/committees` - Get current committee
- `GET /api/public/contributions` - Get verified contributions
- `GET /api/public/gallery` - Get gallery images
- `GET /api/public/statistics` - Get public statistics
- `POST /api/contact` - Submit contact form

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/change-password` - Change password

### Admin Endpoints (Protected)
- `GET/POST /api/committees` - Committee management
- `GET/POST /api/contributions` - Contribution management
- `GET/POST /api/gallery` - Gallery management
- `GET/POST /api/land-donors` - Land donor management
- `GET/POST /api/users` - User management
- `GET /api/statistics` - Dashboard statistics
- `GET /api/activity` - Activity logs

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check MongoDB is running
mongod --version

# Test connection
mongosh "your-connection-string"
```

### Cloudinary Upload Fails
- Verify API credentials in .env.local
- Check file size limits (10MB default)
- Ensure proper network connection

### Build Errors
```bash
# Clear cache
pnpm clean
rm -rf .next

# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## 📝 Environment Variables Reference

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `MONGODB_URI` | MongoDB connection string | Yes | - |
| `JWT_SECRET` | Secret key for JWT tokens | Yes | - |
| `ACCESS_TOKEN_EXPIRY` | Access token duration | No | 15m |
| `REFRESH_TOKEN_EXPIRY` | Refresh token duration | No | 7d |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes | - |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes | - |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes | - |
| `SMTP_HOST` | Email SMTP host | No* | - |
| `SMTP_PORT` | Email SMTP port | No* | 587 |
| `SMTP_USER` | Email username | No* | - |
| `SMTP_PASS` | Email password | No* | - |
| `SMTP_FROM` | Email from address | No* | - |
| `NODE_ENV` | Environment mode | No | development |

*Required if using contact form email functionality

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Development Team** - Amanat-E-Nazirpara Masjid Committee

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- MongoDB for the robust database
- Cloudinary for image hosting
- Tailwind CSS for the utility-first CSS framework
- The open-source community

## 📞 Support

For support and queries:
- **Email**: support@amanat-nazirpara.com
- **Website**: https://amanat-nazirpara.com
- **Issues**: GitHub Issues page

---

Made with ❤️ for Amanat-E-Nazirpara Masjid Community
