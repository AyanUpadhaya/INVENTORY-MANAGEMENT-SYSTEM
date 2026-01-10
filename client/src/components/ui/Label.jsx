import { cn } from "../../lib/utils";

const Label = ({ children, className, ...props }, ref) => {
  return (
    <label
      {...props}
      ref={ref}
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
    >
      {children}
    </label>
  );
};

export default Label;
