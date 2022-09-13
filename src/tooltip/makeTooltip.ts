import { NamespacedStore } from "../state/store/store";
import { CANVAS_CONTAINER_CLASSNAME } from "../ui/ui.const";
import { TOOLTIP_ID } from "./tooltip.const";

export function makeTooltip(store: NamespacedStore) {
  const baseContainerId = store
    .select("visualization")
    .rootElementId.replace("#", "");

  const tooltipId = `${baseContainerId}-${TOOLTIP_ID}`;
  const tooltip = document.createElement("div");
  const tooltipText = document.createElement("p");
  tooltipText.style.overflowWrap = "anywhere";
  tooltip.appendChild(tooltipText);
  tooltip.id = tooltipId;

  document
    .getElementById(baseContainerId)
    ?.getElementsByClassName(CANVAS_CONTAINER_CLASSNAME)?.[0]
    .append(tooltip);

  if (tooltip) {
    Object.assign(tooltip.style, {
      position: "absolute",
      background: "gray",
      padding: "0.5rem",
      color: "white",
      "box-sizing": "border-box",
      display: "none",
      "pointer-events": "none",
      top: "0",
      left: "0",
    });
  }
  return tooltipId;
}
