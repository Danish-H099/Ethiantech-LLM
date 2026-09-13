import * as TooltipPrimitive from "@radix-ui/react-tooltip";

export default function Tooltip({ children, content, side = "top", sideOffset = 6, delayDuration = 300 }) {
  if (!content) return children;

  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration} skipDelayDuration={100}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            sideOffset={sideOffset}
            className="tooltip-content z-50 rounded-lg bg-ink px-3 py-1.5 font-outfit text-sm-fluid font-medium text-white shadow-dropdown"
          >
            {content}
            <TooltipPrimitive.Arrow className="fill-ink" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
