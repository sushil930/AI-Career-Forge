# Loader Components

This document provides usage examples for the various loading animations available in our application.

## LineWobble Loader

The LineWobble loader is our primary loading animation, used for page transitions, API calls, and other loading states.

```tsx
import { Loader } from "@/components/ui/loader";

// Basic usage (inline)
<Loader />

// Full screen overlay (for page transitions/refreshes)
<Loader fullScreen />

// Custom color
<Loader color="#3B82F6" />

// Custom size
<Loader size="120" />

// All customizable props
<Loader 
  size="80"
  stroke="5"
  bgOpacity="0.1"
  speed="1.75"
  color="#3B82F6"
  fullScreen={false}
  className="my-4"
/>
```

## Usage Guidelines

- **Page refreshes**: Use `<PageRefresh />` component at the application root
- **Authentication checks**: Used automatically in `ProtectedRoute`
- **Form submissions**: Use in login, signup, and other form submission handlers
- **API calls**: Use for any extended data fetching operations

## Available Options from LDRS Library

For more loader options see the [LDRS Documentation](https://uiwjs.github.io/react-ldrs/)

Other loader styles can be implemented following the same pattern as LineWobble. 