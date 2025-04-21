# Retro Digital Clock

A Next.js project featuring a customizable retro-style digital clock with 7-segment display digits inspired by classic LED displays.


## Features

- **7-Segment Display** - Authentic retro digital display
- **Multiple Color Themes** - Toggle between red, green, cyan, amber, and magenta
- **Time Format Toggle** - Switch between 12-hour and 24-hour time formats
- **Date Display** - Optional date display in MM/DD/YYYY format
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
- `src/app/components/Containter/Digit.tsx` - 7-segment digit component
- `src/app/components/Hexagon/Hexagon.tsx` - Individual segments
- `src/app/components/Containter/style/Digit.module.css` - Styling for components

## Technologies

This project uses:

- [Next.js](https://nextjs.org) - React framework
- TypeScript - Type-safe JavaScript
- CSS Modules - Component styling
- React Hooks - State management

## Sample

![Screenshot 2025-04-21 at 3 26 27 PM](https://github.com/user-attachments/assets/827486ce-46b9-4fc1-9451-a1e1a69660ca)
*Clicker


![Screenshot 2025-04-21 at 3 26 02 PM](https://github.com/user-attachments/assets/54df727d-6f41-4fe5-9053-dc9028113cc8)
*Clock Regular


![Screenshot 2025-04-21 at 3 25 56 PM](https://github.com/user-attachments/assets/5e86603f-f069-4808-9451-878d0a8c2ba7)
*Clock Military


![Screenshot 2025-04-21 at 3 25 36 PM](https://github.com/user-attachments/assets/f608b475-5170-4d23-a63d-ed77b699778e)
*Sample of all numbers

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

## Deploy on Vercel

The easiest way to deploy your clock app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
