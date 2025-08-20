import * as React from "react";
import { cn } from "@/lib/utils";

export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-xl shadow-sm transition duration-200",
      className
    )}
    {...props}
  />
));

Button.displayName = "Button";
