# Sidebar Implementation Guide

This document explains the sidebar implementation for game pages and how to use it across the application.

## Overview

The sidebar provides quick access to key platform features:

- Leaderboard
- History
- Advertise
- Whitepaper
- Tournaments (Coming Soon)
- Rewards (Coming Soon)

## Components Created

### 1. `Sidebar.tsx` (`src/components/organisms/Sidebar.tsx`)

The main sidebar component with navigation links and icons.

### 2. `GamesPageLayout.tsx` (`src/components/templates/GamesPageLayout.tsx`)

A reusable layout wrapper that includes the sidebar and properly positions content.

### 3. Styling Files

- `Sidebar.css` - Sidebar component styles
- `GamesPageLayout.css` - Layout wrapper styles

## Usage

### For New Game Pages

Simply wrap your page content with `GamesPageLayout`:

```tsx
import MainLayout from "../components/templates/MainLayout";
import GamesPageLayout from "../components/templates/GamesPageLayout";

const YourGamePage = () => (
  <MainLayout>
    <GamesPageLayout>
      {/* Your page content here */}
      <div className="your-page-content">
        <h1>Your Game Page Title</h1>
        {/* Rest of your content */}
      </div>
    </GamesPageLayout>
  </MainLayout>
);

export default YourGamePage;
```

### For Existing Game Pages

Update the import and wrap content:

**Before:**

```tsx
import MainLayout from "../components/templates/MainLayout";

const GamePage = () => (
  <MainLayout>
    <div className="content">...</div>
  </MainLayout>
);
```

**After:**

```tsx
import MainLayout from "../components/templates/MainLayout";
import GamesPageLayout from "../components/templates/GamesPageLayout";

const GamePage = () => (
  <MainLayout>
    <GamesPageLayout>
      <div className="content">...</div>
    </GamesPageLayout>
  </MainLayout>
);
```

## Features

### Responsive Behavior

- **Mobile/Tablet (< 1024px):** Sidebar is hidden
- **Desktop (>= 1024px):** Sidebar is fixed on the left side

### Automatic Layout Adjustment

- Content automatically shifts right on desktop to accommodate the 156px sidebar
- No manual margin adjustments needed in your page CSS

### Active State

- Current page is automatically highlighted in the sidebar navigation

## Styling Guidelines

### Page Content Padding

Your page content should NOT include left margin for the sidebar - `GamesPageLayout` handles this automatically.

### Example Page Styles

```css
.your-page-content {
  padding: 2rem 1.5rem; /* No left margin needed */
}

@media (min-width: 1024px) {
  .your-page-content {
    padding: 3rem 4rem; /* Still no left margin needed */
  }
}
```

## Implementation Examples

### Pages Already Updated

- ✅ GamesFree.tsx
- ✅ GamesPvE.tsx
- ✅ GamesPvP.tsx

These pages serve as reference implementations.

## Technical Details

### Sidebar Specifications

- Width: 156px
- Position: Fixed (left side)
- Top offset: 64px (below navbar)
- Border: 1px solid rgba(149, 150, 152, 0.49)
- Background: Transparent

### Icons

Icons are inline SVGs for optimal performance and styling flexibility. They inherit color from their parent element.

## Future Enhancements

To add new sidebar items:

1. Add icon SVG component in `Sidebar.tsx`
2. Add route constant in `constants/index.ts`
3. Add new Link or div element in the sidebar nav
4. Style as needed in `Sidebar.css`
