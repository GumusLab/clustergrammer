export const hideTooltip = (tooltipId: string) => {
  const tooltip = document.getElementById(tooltipId);
  if (tooltip) {
    Object.assign(tooltip.style, {
      display: "none",
    });
  }
};
