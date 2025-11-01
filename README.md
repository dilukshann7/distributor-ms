# Distribution Management System

A comprehensive web-based distribution management system for ADP Namasinghe Distribution, built with modern JavaScript, Webpack, and Tailwind CSS. This application provides role-based access control for managing various aspects of distribution operations including inventory, sales, suppliers, and logistics.

## 📋 Table of Contents

- [Features](#features)
- [User Roles](#user-roles)
- [Technologies](#technologies)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Development](#development)
- [Build](#build)
- [Configuration](#configuration)
- [Demo Credentials](#demo-credentials)
- [License](#license)
- [Author](#author)

## ✨ Features

- **Role-Based Access Control**: Nine distinct user roles with customized dashboards
- **Responsive Design**: Built with Tailwind CSS for mobile-first responsive layouts
- **Modern Build System**: Webpack-powered bundling with hot module replacement
- **Modular Architecture**: Dynamic imports for efficient code splitting
- **Authentication System**: Secure login with role-based routing
- **Asset Management**: Optimized handling of images and static resources
- **Development Server**: Live reload development environment

## 👥 User Roles

The system supports nine different user roles, each with specific permissions and dashboard views:

1. **Owner** - Full system access and oversight
2. **Manager** - Overall operations management
3. **Assistant Manager** - Supporting management operations
4. **Stock Keeper** - Inventory and stock management
5. **Cashier** - Point of sale and transactions
6. **Supplier** - Supplier portal and order management
7. **Distributor** - Distribution oversight and logistics
8. **Salesman** - Sales operations and customer management
9. **Driver** - Delivery and transportation management

## 🛠 Technologies

- **Frontend Framework**: Vanilla JavaScript (ES6+)
- **Build Tool**: Webpack 5
- **Styling**: Tailwind CSS 3.4
- **HTTP Client**: Axios
- **CSS Processing**: PostCSS with preset-env
- **Development Server**: Webpack Dev Server

## 📦 Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (v14.0.0 or higher recommended)
- **npm** (v6.0.0 or higher)

## 🚀 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd distributor-ms
```

2. Install dependencies:
```bash
npm install
```

## 💻 Usage

### Development Mode

Start the development server with hot reload:

```bash
npm run dev
```

The application will automatically open in your default browser at `http://localhost:8080`.

### Production Build

Build the project for production:

```bash
npm run build
```

The optimized files will be generated in the `dist/` directory.

## 📁 Project Structure

```
distributor-ms/
├── src/
│   ├── assets/          # Static assets (images, icons, etc.)
│   ├── css/             # Stylesheets
│   │   └── style.css    # Main stylesheet (Tailwind imports)
│   ├── js/              # JavaScript modules
│   │   ├── classes/     # Role-specific dashboard modules
│   │   │   ├── owner.js
│   │   │   ├── manager.js
│   │   │   ├── assistant-manager.js
│   │   │   ├── stock-keeper.js
│   │   │   ├── cashier.js
│   │   │   ├── supplier.js
│   │   │   ├── distributor.js
│   │   │   ├── salesman.js
│   │   │   └── driver.js
│   │   └── login.js     # Authentication logic
│   ├── index.html       # HTML template
│   └── index.js         # Application entry point
├── dist/                # Production build output
├── webpack.config.js    # Webpack configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── postcss.config.js    # PostCSS configuration
├── package.json         # Project dependencies
└── README.md           # Project documentation
```

## 🔧 Development

### Code Structure

The application uses a modular architecture with dynamic imports for code splitting:

- **Entry Point**: `src/index.js` initializes the app and renders the login screen
- **Authentication**: `src/js/login.js` handles user authentication and role-based routing
- **Role Dashboards**: Each role has a dedicated module in `src/js/classes/`
- **Styling**: Tailwind CSS utility classes with custom configurations

### Adding New Features

1. Create new modules in the appropriate directory
2. Import and integrate into the main application flow
3. Update routing in `login.js` if adding new roles
4. Test in development mode before building

### Webpack Configuration

The project includes a comprehensive Webpack setup:

- **Entry**: `./src/index.js`
- **Output**: `dist/bundle.js`
- **Dev Server**: Port 8080 with hot reload
- **Loaders**: CSS, PostCSS, Asset handling
- **Plugins**: HTML generation, CSS extraction

## 🏗 Build

The build process includes:

- JavaScript bundling and minification
- CSS extraction and optimization
- Asset optimization and copying
- HTML template generation

Build artifacts are placed in the `dist/` directory and are ready for deployment.

## ⚙️ Configuration

### Tailwind CSS

Configure Tailwind in `tailwind.config.js`:
- Content paths for class detection
- Theme customization
- Plugin configuration

### PostCSS

PostCSS processes CSS with:
- Tailwind CSS directives
- Modern CSS feature support via preset-env

### Webpack Dev Server

Development server settings in `webpack.config.js`:
- Port: 8080
- Hot reload enabled
- Automatic browser opening
- History API fallback for SPA routing

## 🔐 Demo Credentials

The system includes demo credentials for testing all user roles:

| Role | Email | Password |
|------|-------|----------|
| Owner | owner@dbms.com | owner |
| Manager | manager@dbms.com | manager |
| Assistant Manager | asst@dbms.com | assistant |
| Stock Keeper | stock@dbms.com | stock |
| Cashier | cashier@dbms.com | cashier |
| Supplier | supplier@dbms.com | supplier |
| Distributor | distributor@dbms.com | distributor |
| Salesman | salesman@dbms.com | salesman |
| Driver | driver@dbms.com | driver |

⚠️ **Note**: These are demo credentials for development/testing purposes only. Replace with proper authentication in production.

## 📝 License

This project is licensed under the MIT License. See the LICENSE file for details.

## 👨‍💻 Author

**Dilukshan Niranjan**

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📞 Support

For support or questions, please contact the development team or open an issue in the repository.

---

**Built with ❤️ for ADP Namasinghe Distribution**
