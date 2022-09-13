import { NamespacedStore } from "../../../state/store/store";
import { hideTooltip } from "../../../tooltip/hideTooltip";
import { showTooltip } from "../../../tooltip/showTooltip";
import { TOOLTIP_TYPES } from "../../../tooltip/tooltip.const";

export function tooltipMouseMove(
  tooltipId: string,
  store: NamespacedStore,
  e: MouseEvent
) {
  const tooltip = document.getElementById(tooltipId);
  if (
    tooltip &&
    store.select("tooltip").show_tooltip &&
    !store.select("tooltip").disable_tooltip
  ) {
    if (
      store.select("tooltip").tooltip_type &&
      store.select("tooltip").tooltip_type !== TOOLTIP_TYPES.OOB &&
      store
        .select("tooltip")
        .enabledTooltips.some((x: any) =>
          store.select("tooltip").tooltip_type?.includes(x)
        )
    ) {
      if (tooltip.children[0].innerHTML != store.select("tooltip").text) {
        tooltip.children[0].innerHTML = store.select("tooltip").text;
      }
      showTooltip(e, tooltipId);
    } else {
      hideTooltip(tooltipId);
    }
  }
}
