# Data Structures and File System

This document describes the data models, file structure, and relationships in the Next.js Product Site backend.

## File-Based Storage

The application uses JSON files for data persistence, providing simplicity and easy version control.

### File Structure

```
src/data/
├── products.json               # Product catalog
├── learning-resources.json     # Training materials and tutorials
└── product-assignments.json    # Product-resource mappings
```
