import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-md font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-orange-600",
        destructive:
          "bg-orange-600 text-destructive-foreground hover:bg-orange-600",
        outline:
          "border border-input bg-orange-600 hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-orange-600 text-secondary-foreground hover:bg-orange-600",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10 ",
        view: 'h-5 w-5',
        export: 'h-8 w-8 text-[16px] font-bold'
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  buttonName?: string;
  dynamicSize?: string;
  onClick?: () => void;
  maxLength?: number;
  color?: string;
  backgroundColor?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      // buttonName,
      dynamicSize,
      onClick,
      // maxLength,
      color,
      backgroundColor,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    // const truncatedName = maxLength ? buttonName.slice(0, maxLength) : buttonName;

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }), dynamicSize)}
        ref={ref}
        onClick={onClick}
        style={{
          color: color,
          backgroundColor: backgroundColor,
        }}
        {...props}
      >
        {/* {truncatedName} */}
      </Comp>
    );
  }
);
Button.displayName = "Button..";

export { Button, buttonVariants };

