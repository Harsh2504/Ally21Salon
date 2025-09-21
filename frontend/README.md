# Salon Management System - Frontend

A comprehensive React-based frontend for a salon management system with role-based dashboards for Managers and Employees.

## 🚀 Features

### Manager Dashboard
- **Employee Management**: Full CRUD operations for employee accounts
- **Leave Approvals**: Review and approve/reject employee leave requests
- **Service Management**: UI for managing salon services (UI-only)
- **Shift Management**: UI for scheduling and managing shifts (UI-only)
- **Dashboard Overview**: Key metrics and statistics

### Employee Dashboard
- **Profile Management**: Update personal information and password
- **Leave Requests**: Submit and track leave requests
- **My Shifts**: View assigned shifts (UI-only)
- **Service Catalog**: Browse available salon services (UI-only)
- **Dashboard Overview**: Personal stats and quick actions

### Shared Features
- **Role-based Authentication**: JWT-based login with automatic redirection
- **Responsive Design**: Mobile-first design with collapsible sidebar
- **Toast Notifications**: Real-time feedback for all actions
- **Protected Routes**: Route guards based on user roles
- **Modern UI**: Built with Tailwind CSS and ShadCN UI components

## 🛠️ Technology Stack

- **React 19.1.1** - Latest React with modern features
- **Vite 7.1.6** - Fast build tool and development server
- **Tailwind CSS 4.1.13** - Utility-first CSS framework
- **ShadCN UI** - Modern, accessible component library
- **React Router v6** - Client-side routing with nested routes
- **Axios** - HTTP client with interceptors for API calls
- **Lucide React** - Beautiful, customizable icons
- **Sonner** - Toast notifications

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Backend API server running on http://localhost:5000

### Quick Start

1. **Clone and navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open browser:**
   Navigate to `http://localhost:5173`

### Demo Credentials
- **Manager**: manager@salon.com / password123
- **Employee**: employee@salon.com / password123

## 🏗️ Project Structure

```
src/
├── components/
│   ├── layouts/          # Layout components
│   │   ├── ManagerLayout.jsx
│   │   └── EmployeeLayout.jsx
│   ├── shared/           # Shared components
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   └── Loader.jsx
│   └── ui/               # ShadCN UI components
├── context/
│   └── AuthContext.jsx   # Authentication state management
├── hooks/
│   └── useWindowSize.js  # Responsive design hooks
├── pages/
│   ├── manager/          # Manager-specific pages
│   └── employee/         # Employee-specific pages
├── services/
│   ├── api.js           # Axios configuration
│   └── apiService.js    # API service methods
├── lib/
│   └── utils.js         # Utility functions
├── App.jsx              # Main app component
├── Router.jsx           # Route configuration
└── main.jsx            # App entry point
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 UI Components

### ShadCN Components Used
- Button, Input, Label
- Card, Table, Badge
- DropdownMenu, Dialog
- Sonner (Toast notifications)
- Avatar, Tabs

### Responsive Features
- Mobile-first design approach
- Collapsible sidebar on mobile devices
- Responsive tables and forms
- Touch-friendly buttons and interactions

## 🔐 Authentication Flow

1. **Login**: User enters credentials
2. **JWT Processing**: Token stored in localStorage
3. **Role Extraction**: User role extracted from JWT payload
4. **Route Protection**: Automatic redirection based on role
5. **API Integration**: Token attached to all API requests
6. **Auto Logout**: Token validation and cleanup

## 📱 Responsive Design

### Breakpoints (Tailwind CSS)
- **Mobile**: < 768px (sidebar overlay)
- **Tablet**: 768px - 1024px (collapsed sidebar)
- **Desktop**: ≥ 1024px (full sidebar)

### Mobile Features
- Hamburger menu for navigation
- Overlay sidebar with backdrop
- Touch-optimized interactions
- Responsive typography and spacing

## 🔌 API Integration

### Base Configuration
- Base URL: `http://localhost:5000/api`
- Authentication: Bearer token in headers
- Request/Response interceptors for token management

### Endpoints Integrated
- **Auth**: POST /auth/login, POST /auth/register
- **Users**: GET /users/employees, PUT /users/:id, DELETE /users/:id
- **Leaves**: GET /leaves, POST /leaves, PUT /leaves/:id
- **Profile**: GET /users/profile, PUT /users/profile

## 🚨 Error Handling

- API error interceptors
- Toast notifications for all actions
- Form validation feedback
- Network error handling
- Authentication error handling

## 🔄 State Management

- **AuthContext**: Global authentication state
- **Local State**: Component-level state with hooks
- **URL State**: Route-based state management

## 🎯 Performance Optimizations

- Code splitting with React.lazy
- Image optimization
- Efficient re-renders with proper key props
- Axios request/response interceptors
- Local storage caching for auth state

## 📝 Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5000/api
```

## 🤝 Contributing

1. Fork the project
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the existing documentation
- Review the demo credentials for testing

---

**Built with ❤️ using React, Tailwind CSS, and ShadCN UI**
