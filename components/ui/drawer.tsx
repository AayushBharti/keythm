"use client";

import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer";
import { type ComponentProps, createContext, use } from "react";
import { RemoveScroll } from "react-remove-scroll";
import { cn } from "@/lib/utils";

function resolveClassName<S>(
  className: string | ((state: S) => string | undefined) | undefined,
  state: S
): string | undefined {
  return typeof className === "function" ? className(state) : className;
}

const DrawerContext =
  createContext<DrawerPrimitive.Root.Props["swipeDirection"]>("down");

function Drawer({
  swipeDirection = "down",
  ...props
}: DrawerPrimitive.Root.Props) {
  return (
    <DrawerContext value={swipeDirection}>
      <DrawerPrimitive.Root
        data-slot="drawer"
        modal="trap-focus"
        swipeDirection={swipeDirection}
        {...props}
      />
    </DrawerContext>
  );
}

function DrawerTrigger({ ...props }: DrawerPrimitive.Trigger.Props) {
  return <DrawerPrimitive.Trigger {...props} data-slot="drawer-trigger" />;
}

function DrawerPortal({ className, ...props }: DrawerPrimitive.Portal.Props) {
  return (
    <DrawerPrimitive.Portal
      className={(state) => cn("z-100", resolveClassName(className, state))}
      data-slot="drawer-portal"
      {...props}
    />
  );
}

function DrawerClose({ ...props }: DrawerPrimitive.Close.Props) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />;
}

function DrawerContent({ className, ...props }: DrawerPrimitive.Content.Props) {
  return (
    <DrawerPrimitive.Content
      className={(state) =>
        cn(
          "transition-opacity duration-300 ease-[cubic-bezier(0.45,1.005,0,1.005)] group-data-nested-drawer-open/popup:opacity-0 group-data-nested-drawer-swiping/popup:opacity-100",
          resolveClassName(className, state)
        )
      }
      data-slot="drawer-content"
      {...props}
    />
  );
}

const drawerPopupClassName = ({
  swipeDirection,
}: DrawerPrimitive.Popup.State) => {
  return cn(
    "group/popup relative",
    "touch-auto overflow-y-auto overscroll-contain bg-background text-foreground outline-1 outline-foreground/5 [--bleed:3rem] data-swiping:select-none dark:bg-[oklch(0.23_0.005_286)]",
    "data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)]",
    // Nested drawer stacking variables
    "[--height:max(0px,calc(var(--drawer-frontmost-height,var(--drawer-height))-var(--bleed)))] [--peek:1rem] [--scale-base:calc(max(0,1-(var(--nested-drawers)*var(--stack-step))))] [--scale:clamp(0,calc(var(--scale-base)+(var(--stack-step)*var(--stack-progress))),1)] [--shrink:calc(1-var(--scale))] [--stack-peek-offset:max(0px,calc((var(--nested-drawers)-var(--stack-progress))*var(--peek)))] [--stack-progress:clamp(0,var(--drawer-swipe-progress),1)] [--stack-step:0.05]",
    // Nested drawer overlay
    "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:bg-transparent after:transition-[background-color] after:duration-450 after:ease-[cubic-bezier(0.32,0.72,0,1)] after:content-['']",
    "data-nested-drawer-open:overflow-hidden data-nested-drawer-swiping:duration-0 data-nested-drawer-open:after:bg-black/5",
    {
      // Shared horizontal (left & right)
      "h-full w-[calc(22rem+var(--bleed))] max-w-[calc(100vw-3rem+var(--bleed))] p-6 supports-[-webkit-touch-callout:none]:w-[20rem] supports-[-webkit-touch-callout:none]:max-w-[calc(100vw-20px)] supports-[-webkit-touch-callout:none]:rounded-[10px] supports-[-webkit-touch-callout:none]:[--bleed:0px]":
        swipeDirection === "left" || swipeDirection === "right",
      // Right-only (with stacking transform)
      "transform-[translateX(calc(var(--drawer-snap-point-offset,0px)+var(--drawer-swipe-movement-x)-var(--stack-peek-offset)-(var(--shrink)*100%)))_scale(var(--scale))] -mr-(--bleed) origin-[calc(100%-var(--bleed))_50%] rounded-l-2xl pr-[calc(1.5rem+var(--bleed))] shadow-[-2px_0_10px_rgb(0_0_0/0.1)] [transition:transform_450ms_cubic-bezier(0.32,0.72,0,1),box-shadow_450ms_cubic-bezier(0.32,0.72,0,1)] data-ending-style:shadow-[-2px_0_10px_rgb(0_0_0/0)] data-swiping:duration-0 supports-[-webkit-touch-callout:none]:mr-0 supports-[-webkit-touch-callout:none]:pr-6":
        swipeDirection === "right",
      // Right enter/exit
      "data-ending-style:transform-[translateX(calc(100%-var(--bleed)+var(--viewport-padding)))] data-starting-style:transform-[translateX(calc(100%-var(--bleed)+var(--viewport-padding)))]":
        swipeDirection === "right",
      // Shared vertical (up & down)
      "max-h-[calc(85dvh+var(--bleed))] w-full px-6":
        swipeDirection === "up" || swipeDirection === "down",
      // Down-only (with stacking transform)
      "transform-[translateY(calc(var(--drawer-snap-point-offset,0px)+var(--drawer-swipe-movement-y)-var(--stack-peek-offset)-(var(--shrink)*var(--height))))_scale(var(--scale))] -mb-(--bleed) h-(--drawer-height,auto) origin-[50%_calc(100%-var(--bleed))] rounded-t-2xl pt-4 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px)+var(--bleed))] shadow-[0_2px_10px_rgb(0_0_0/0.1)] [transition:transform_450ms_cubic-bezier(0.32,0.72,0,1),height_450ms_cubic-bezier(0.32,0.72,0,1),box-shadow_450ms_cubic-bezier(0.32,0.72,0,1)] data-nested-drawer-open:h-[calc(var(--height)+var(--bleed))] data-ending-style:shadow-[0_2px_10px_rgb(0_0_0/0)] data-swiping:duration-0":
        swipeDirection === "down",
      // Down enter/exit
      "data-ending-style:transform-[translateY(calc(100%-var(--bleed)))] data-starting-style:transform-[translateY(calc(100%-var(--bleed)))]":
        swipeDirection === "down",
    }
  );
};

function DrawerPopup({
  className,
  children,
  container,
  ...props
}: DrawerPrimitive.Popup.Props & {
  container?: DrawerPrimitive.Portal.Props["container"];
}) {
  const dir = use(DrawerContext);

  return (
    <DrawerPortal container={container}>
      <DrawerBackdrop />
      <RemoveScroll>
        <DrawerViewport>
          <DrawerPrimitive.Popup
            className={(state) =>
              cn(
                drawerPopupClassName(state),
                resolveClassName(className, state)
              )
            }
            data-slot="drawer-popup"
            {...props}
          >
            {dir === "down" && <DrawerHandle />}
            {children}
          </DrawerPrimitive.Popup>
        </DrawerViewport>
      </RemoveScroll>
    </DrawerPortal>
  );
}

function DrawerHandle({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mx-auto mb-5 h-1 w-12 shrink-0 rounded-full bg-muted",
        className
      )}
      {...props}
    />
  );
}

function DrawerViewport({
  className,
  ...props
}: DrawerPrimitive.Viewport.Props) {
  const dir = use(DrawerContext);
  return (
    <DrawerPrimitive.Viewport
      className={(state) =>
        cn(
          "fixed inset-0 z-100 flex",
          {
            "items-stretch p-(--viewport-padding) [--viewport-padding:0px] supports-[-webkit-touch-callout:none]:[--viewport-padding:0.625rem]":
              dir === "left" || dir === "right",
            "justify-end": dir === "right",
            "justify-start": dir === "left",
            "items-end justify-center": dir === "down",
            "items-start justify-center": dir === "up",
          },
          resolveClassName(className, state)
        )
      }
      data-slot="drawer-viewport"
      {...props}
    />
  );
}

function DrawerTitle({ className, ...props }: DrawerPrimitive.Title.Props) {
  return (
    <DrawerPrimitive.Title
      className={(state) =>
        cn(
          "font-medium text-base text-foreground",
          resolveClassName(className, state)
        )
      }
      data-slot="drawer-title"
      {...props}
    />
  );
}

function DrawerDescription({
  className,
  ...props
}: DrawerPrimitive.Description.Props) {
  return (
    <DrawerPrimitive.Description
      className={(state) =>
        cn(
          "mt-1.5 text-muted-foreground text-sm",
          resolveClassName(className, state)
        )
      }
      data-slot="drawer-description"
      {...props}
    />
  );
}

function DrawerBackdrop({
  className,
  ...props
}: DrawerPrimitive.Backdrop.Props) {
  return (
    <DrawerPrimitive.Backdrop
      className={(state) =>
        cn(
          "fixed inset-0 z-100 min-h-dvh bg-black opacity-[calc(var(--backdrop-opacity)*(1-var(--drawer-swipe-progress)))] transition-opacity duration-450 ease-[cubic-bezier(0.32,0.72,0,1)] [--backdrop-opacity:0.2] data-ending-style:opacity-0 data-starting-style:opacity-0 data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-swiping:duration-0 supports-backdrop-filter:backdrop-blur-sm",
          resolveClassName(className, state)
        )
      }
      data-slot="drawer-backdrop"
      {...props}
    />
  );
}

export {
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHandle,
  DrawerPopup,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
  DrawerViewport,
  drawerPopupClassName,
};
