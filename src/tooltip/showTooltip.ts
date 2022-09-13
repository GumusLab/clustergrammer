import { computePosition, flip, offset, shift } from "@floating-ui/dom";

export const showTooltip = (
  {
    clientX,
    clientY,
  }: {
    clientX: number;
    clientY: number;
  },
  tooltipId: string
) => {
  const tooltip = document.getElementById(tooltipId);
  if (tooltip) {
    const virtualEl = {
      getBoundingClientRect() {
        return {
          width: 0,
          height: 0,
          x: clientX,
          y: clientY,
          left: clientX,
          right: clientX,
          top: clientY,
          bottom: clientY,
        };
      },
    };

    computePosition(virtualEl, tooltip, {
      placement: "left",
      middleware: [
        offset(10),
        flip({ fallbackStrategy: "initialPlacement" }),
        shift(),
      ],
    }).then(({ x, y }) => {
      Object.assign(tooltip.style, {
        display: "block",
        top: `${y}px`,
        left: `${x}px`,
      });
    });
  }
};
