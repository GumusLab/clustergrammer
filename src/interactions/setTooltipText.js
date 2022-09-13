import calcCatClusterBreakdown from "../cats/functions/calcCatClusterBreakdown";
import { TOOLTIP_TYPES } from "../tooltip/tooltip.const";

export function setTooltipText(store, mouseover) {
  const {
    tooltip: { tooltip_type },
  } = store.selectAll();
  let tooltip_text = "";
  if (tooltip_type === TOOLTIP_TYPES.MATRIX_CELL) {
    tooltip_text = `<b>Row:</b> ${mouseover.row.name}<br /><b>Col:</b> ${
      mouseover.col.name
    }<br /><b>Value:</b> ${mouseover.value?.toFixed(3) || "NaN"}${
      mouseover.value_iz
        ? `Original value: ${mouseover.value_iz.toFixed(3)}`
        : ""
    }`;
  } else if (tooltip_type === TOOLTIP_TYPES.ROW_LABEL) {
    tooltip_text = mouseover.row.name;
  } else if (tooltip_type === TOOLTIP_TYPES.COL_LABEL) {
    tooltip_text = mouseover.col.name;
    // TODO: fix dendro tooltips
  } else if (tooltip_type === TOOLTIP_TYPES.COL_DENDRO) {
    // tooltip_text = JSON.stringify(mouseover.col.dendro);
    const { selected_clust_names } = calcCatClusterBreakdown(
      store,
      mouseover.col.dendro,
      "col"
    );
    tooltip_text = selected_clust_names;
  } else if (tooltip_type === TOOLTIP_TYPES.ROW_DENDRO) {
    // tooltip_text = JSON.stringify(mouseover.row.dendro);
    const { selected_clust_names } = calcCatClusterBreakdown(
      store,
      mouseover.row.dendro,
      "row"
    );
    tooltip_text = selected_clust_names;
  } else if (tooltip_type.indexOf("-cat-") > 0) {
    // Category Tooltip
    // ///////////////////
    const inst_axis = tooltip_type.split("-")[0];
    const inst_index = tooltip_type.split("-")[2];
    tooltip_text = mouseover[inst_axis].cats[inst_index];
  }
  store.dispatch(store.actions.mutateTooltipState({ text: tooltip_text }));
}
