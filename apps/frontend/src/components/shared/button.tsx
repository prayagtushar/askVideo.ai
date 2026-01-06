import * as React from 'react';
import { cn } from '../../lib/utils';

// Since I didn't install class-variance-authority or radix-ui, I should install them or mock them.
// "Shadcn UI components" usually implies having these deps.
// I will simplify and remove the deps requirement by implementing simple variants manually or installing them.
// Installing them is better for "Standard".
// But to save time and potential errors with mixed package managers, I will implement a robust manually styled component without `cva` dependency if I can avoid it, OR just install `class-variance-authority clsx tailwind-merge` (I have clsx and tailwind-merge).

// Let's implement a simple version without CVA to avoid extra installs unless I decide to install it.
// Actually, `cva` is very standard. I'll stick to manual clsx for now to ensure speed, but keep the API.

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?:
		| 'default'
		| 'destructive'
		| 'outline'
		| 'secondary'
		| 'ghost'
		| 'link';
	size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant = 'default', size = 'default', ...props }, ref) => {
		// asChild prop is ignored for now to avoid dependency

		// Manual variant resolution
		const variants = {
			default:
				'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm',
			destructive:
				'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm',
			outline:
				'border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-sm',
			secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
			ghost: 'hover:bg-accent hover:text-accent-foreground',
			link: 'text-primary underline-offset-4 hover:underline',
		};

		const sizes = {
			default: 'h-10 px-4 py-2',
			sm: 'h-9 rounded-md px-3',
			lg: 'h-11 rounded-md px-8',
			icon: 'h-10 w-10',
		};

		return (
			<button
				className={cn(
					'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
					variants[variant],
					sizes[size],
					className
				)}
				ref={ref}
				{...props}
			/>
		);
	}
);
Button.displayName = 'Button';

export { Button };
