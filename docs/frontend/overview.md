# Frontend Overview

This document provides a comprehensive overview of the Next.js Product Site frontend architecture, components, and features.

## Architecture

The frontend is built using **Next.js 15** with the App Router, providing a modern, scalable architecture for the chemical products catalog and learning management system.

### Technology Stack

- **Framework**: Next.js 15.5.4 with App Router
- **React**: 19.1.1 (Latest with React 19 features)
- **TypeScript**: 5.9.2 (Full type safety)
- **Styling**: Tailwind CSS 4.1.13 (Utility-first CSS)
- **Icons**: Lucide React 0.544.0 (Modern icon library)
- **Utilities**: clsx, tailwind-merge (Conditional styling)

### Project Structure

```
app/                      # Next.js App Router
├── globals.css          # Global styles and Tailwind imports
├── layout.tsx           # Root layout with header/footer
├── page.tsx             # Homepage route
├── view.tsx             # Homepage view component
├── error.tsx            # Global error boundary
├── not-found.tsx        # 404 page
├── global-error.tsx     # Global error fallback
├── products/            # Product catalog routes
│   └── [productId]/     # Dynamic product detail pages
├── lms/                 # Learning Management System
│   ├── page.tsx         # LMS dashboard
│   ├── view.tsx         # LMS dashboard view
│   └── products/        # LMS product-specific routes
└── api/                 # API routes (covered in backend docs)

src/
├── components/          # Reusable UI components
│   ├── ui/              # Generic UI components
│   ├── layout/          # Layout-specific components
│   ├── products/        # Product-related components
│   └── learning/        # Learning resource components
├── type/                # TypeScript type definitions
└── data/                # Static data files (JSON)
```

## Core Features

### 1. Product Catalog System

**Purpose**: Display and browse chemical products with detailed information

**Key Components**:

- Product listing with search and filtering
- Product detail pages with comprehensive information
- Product cards with ratings and stock information
- Category-based organization

**User Journey**:

1. Browse products on homepage
2. Search/filter by name or category
3. View detailed product information
4. Access learning resources for specific products

### 2. Learning Management System (LMS)

**Purpose**: Manage training materials and assign them to products

**Key Features**:

- Create and manage learning resources (videos, PDFs)
- Assign resources to specific products
- Track training materials and tutorials
- Custom product-specific guidance

**User Journey**:

1. Access LMS dashboard
2. Create training materials
3. Assign resources to products
4. Manage custom guides for products

### 3. Resource Assignment System

**Purpose**: Connect learning materials with specific products

**Key Features**:

- Many-to-many relationship between products and resources
- Custom guidance for each product-resource assignment
- Automatic file management (cyclical assignment)
- Cascade delete operations

## Component Architecture

### Layout Components

#### Header (`src/components/layout/Header.tsx`)

- Global navigation
- LearnHub branding
- Home/LMS navigation links
- Responsive design

#### Footer (`src/components/layout/Footer.tsx`)

- Company information
- Copyright and branding
- Consistent across all pages

### UI Components

#### Button (`src/components/ui/Button.tsx`)

- Reusable button component
- Multiple variants (primary, secondary, danger)
- Size variations (small, medium, large)
- Loading states and disabled states

#### Card (`src/components/ui/Card.tsx`)

- Container component for content blocks
- Consistent shadow and border styling
- Responsive design

#### Badge (`src/components/ui/Badge.tsx`)

- Status indicators
- Category labels
- Color variants for different contexts

#### InputField (`src/components/ui/InputField.tsx`)

- Form input component
- Label and error state support
- Consistent styling across forms

#### Loading (`src/components/ui/Loading.tsx`)

- Loading spinner component
- Used during async operations
- Consistent animation and styling

#### ProgressBar (`src/components/ui/ProgressBar.tsx`)

- Visual progress indicator
- Used in multi-step processes
- Animated transitions

### Product Components

#### ProductCard (`src/components/products/ProductCard.tsx`)

- Product display in grid/list format
- Shows image, name, price, rating
- Category and stock information
- Click-through to product details

**Features**:

- Responsive image handling
- Star rating display
- Stock status indicators
- Price formatting

### Learning Components

#### ResourceCard (`src/components/learning/ResourceCard.tsx`)

- Learning resource display component
- Shows title, description, duration
- File type indicators (video/PDF)
- Download links for materials

**Features**:

- File type icons (Video, PDF)
- Duration display
- Resource type badges
- Download functionality

## Page Architecture

### Homepage (`app/page.tsx` + `app/view.tsx`)

**Purpose**: Product catalog browsing and search

**Features**:

- Product grid display
- Real-time search functionality
- Category filtering
- Responsive design for all devices
- Empty state handling

**Data Flow**:

1. Fetch products from `/api/products`
2. Client-side filtering and search
3. Render ProductCard components
4. Handle loading and error states

### Product Detail Pages (`app/products/[productId]/page.tsx`)

**Purpose**: Detailed product information and learning resources

**Features**:

- Hero image section
- Expandable product details
- Assigned learning resources
- Custom product guides
- Resource management links

**Data Flow**:

1. Fetch product data from `/api/products/[id]`
2. Fetch assigned resources from `/api/products/[id]/assignments`
3. Fetch all resources from `/api/learning-resources`
4. Filter and display assigned resources
5. Group resources by type (training, tutorial, guide)

### LMS Dashboard (`app/lms/page.tsx` + `app/lms/view.tsx`)

**Purpose**: Learning resource management interface

**Features**:

- Resource creation forms
- Resource listing and management
- Delete operations with confirmation
- Empty state handling
- Modal interfaces for forms

**Data Flow**:

1. Fetch all learning resources
2. Display in categorized sections
3. Handle CRUD operations via API
4. Real-time UI updates

### LMS Assignment Page (`app/lms/products/[productId]/assign/page.tsx`)

**Purpose**: Assign learning resources to specific products

**Features**:

- Product information display
- Available resources selection
- Custom guide text editing
- Save/cancel operations
- Success/error feedback

**Data Flow**:

1. Fetch product details
2. Fetch current assignments
3. Fetch all available resources
4. Allow multi-selection of resources
5. Save assignments via PUT API

## Styling System

### Tailwind CSS Configuration

The project uses Tailwind CSS 4.x with custom configuration
