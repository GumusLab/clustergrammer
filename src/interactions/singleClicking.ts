import { OnClickCallback } from "../index.types";
import { NamespacedStore } from "../state/store/store";
import { TOOLTIP_TYPES } from "../tooltip/tooltip.const";

export default function singleClicking(
  store: NamespacedStore,
  onClick: OnClickCallback
) {
  const dispatch = store.dispatch;
  dispatch(
    store.actions.mutateAnimationState({
      last_click: store.select("animation").time,
    })
  );
  dispatch(store.actions.mutateInteractionState({ manual_update_cats: false }));

  const tooltipType = store.select("tooltip").tooltip_type;

  // onClick callback
  if (onClick && tooltipType && tooltipType !== TOOLTIP_TYPES.OOB) {
    // TODO: replace tooltip type strings with enum
    const mouseover = store.select("interaction").mouseover;
    onClick({
      row: mouseover.row.name || null,
      col: mouseover.col.name || null,
      clickType: tooltipType,
    });
  }

  // dendrogram click
  if (tooltipType.includes("-dendro")) {
    if (store.select("tooltip").permanent_tooltip === false) {
      // TODO: do whatever we want to do when clicking the dendrogram
    }
  }
}
