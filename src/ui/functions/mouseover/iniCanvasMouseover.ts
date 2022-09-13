import { NamespacedStore } from "../../../state/store/store";
import { hideTooltip } from "../../../tooltip/hideTooltip";
import { makeTooltip } from "../../../tooltip/makeTooltip";
import { tooltipMouseMove } from "./tooltipMouseMove";

export default function ini_canvas_mouseover(store: NamespacedStore) {
  const baseContainerId = store
    .select("visualization")
    .rootElementId.replace("#", "");

  const tooltipId = makeTooltip(store);

  const canvas = document
    .getElementById(baseContainerId)
    ?.getElementsByTagName("canvas")?.[0];

  canvas?.addEventListener("mousemove", (e) => {
    // show a tooltip if we're on a matrix cell
    tooltipMouseMove(tooltipId, store, e);
  });
  canvas?.addEventListener("mouseleave", () => {
    store.dispatch(store.actions.mutateTooltipState({ show_tooltip: false }));
    hideTooltip(tooltipId);
  });
  canvas?.addEventListener("mouseenter", () => {
    store.dispatch(store.actions.mutateTooltipState({ show_tooltip: true }));
    hideTooltip(tooltipId);
  });
}
