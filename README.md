# Retro Digital Clock (https://retro-clock.vercel.app/)

A Next.js project featuring a customizable retro-style digital clock with 7-segment display digits inspired by classic LED displays.

## Features

- **7-Segment Display** - Authentic retro digital display
- **Multiple Color Themes** - Toggle between red, green, cyan, amber, and magenta
- **Time Format Toggle** - Switch between 12-hour and 24-hour time formats
- **Date Display** - Optional date display in MM/DD/YYYY format
- **Interactive Elements** - Styled hover effects for links and buttons
- **Fully Responsive** - Adapts to different screen sizes and devices
- **Customizable Components** - Reusable components for creating your own digital displays

## Components

### Digit Component

The `Digit` component renders a single 7-segment display digit (0-9):

```jsx
<Digit value={8} color="#ff0000" />
```

### Clock Component

The `Clock` component shows the current time with configurable options:

```jsx
<Clock
  initialColor="#ff0000"
  showSeconds={true}
  showDate={true}
  initialFormat="24h"
/>
```

### ClockButton Component

Reusable button component with retro styling that matches the clock:

```jsx
<ClockButton
  color="#ff0000"
  onClick={handleClick}
  variant="default" // or "small" or "large"
>
  Button Text
</ClockButton>
```

### Clicker Demo

A simple counter example using the digit and button components:

```jsx
<Clicker />
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the clock in action.

## Customization

You can customize the clock and digits by modifying the following files:

- `src/app/components/Containter/Clock.tsx` - Main clock component
- `src/app/components/Containter/style/Clock.module.css` - Styling for clock component
- `src/app/components/Containter/Digit.tsx` - 7-segment digit component
- `src/app/components/Containter/style/Digit.module.css` - Styling for digit component
- `src/app/components/Containter/ClockButton.tsx` - Interactive button component
- `src/app/components/Hexagon/Hexagon.tsx` - Individual segments

## Styling

This project uses CSS Modules for component-specific styling:

- Each component has its own `.module.css` file for scoped styling
- The clock components feature glow effects using CSS shadows
- Interactive elements have hover effects that match the digital retro theme
- Responsive design is implemented using media queries

## Technologies

This project uses:

- [Next.js](https://nextjs.org) - React framework
- TypeScript - Type-safe JavaScript
- CSS Modules - Component styling
- React Hooks - State management

## Screenshots

### Interactive Clicker Component

![Interactive Clicker Component](https://github.com/user-attachments/assets/827486ce-46b9-4fc1-9451-a1e1a69660ca)
_A simple counter implementation using the digit and button components_

### Standard Clock (12-hour format)

![Standard Clock with 12-hour format](https://github.com/user-attachments/assets/54df727d-6f41-4fe5-9053-dc9028113cc8)
_The clock component showing time in 12-hour format with AM/PM indicator_

### Military Clock (24-hour format)

![Military Clock with 24-hour format](https://github.com/user-attachments/assets/5e86603f-f069-4808-9451-878d0a8c2ba7)
_The clock component showing time in 24-hour format_

### Digit Display Sample

![Sample of all digits 0-9](https://github.com/user-attachments/assets/f608b475-5170-4d23-a63d-ed77b699778e)
_Complete showcase of all possible digit states (0-9) in the 7-segment display_

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

## Deploy on Vercel

The easiest way to deploy your clock app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
