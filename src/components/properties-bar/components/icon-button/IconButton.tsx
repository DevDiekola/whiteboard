import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isActive?: boolean;
};

const IconButton = React.forwardRef<HTMLButtonElement, Props>((props, ref) => {
  return (
    <Button
      ref={ref}
      size="icon"
      variant={"secondary"}
      className={cn(
        "cursor-pointer hover:bg-purple-100 transition-opacity ease-in-out duration-300",
        props.isActive === true ? "bg-purple-100" : ""
      )}
      onClick={props.onClick}
    >
      {props.children}
    </Button>
  );
});

IconButton.displayName = "IconButton";

export default IconButton;
