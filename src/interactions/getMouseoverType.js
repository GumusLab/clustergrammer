import { TOOLTIP_TYPES } from "../tooltip/tooltip.const";
import { CANVAS_CONTAINER_CLASSNAME } from "../ui/ui.const";

const LABEL_SIZE = 125;
const DENDRO_WIDTH = 15;

export default (function getMouseoverType(store, catArgsManager) {
  // return vars
  let in_bounds_tooltip = false;
  let tooltip_type = TOOLTIP_TYPES.OOB;

  const canvas = document.querySelector(
    `${
      store.select("visualization").rootElementId
    } .${CANVAS_CONTAINER_CLASSNAME} canvas`
  );
  const canvasWidth = parseFloat(canvas.style.width.replace("px", ""));
  const canvasHeight = parseFloat(canvas.style.height.replace("px", ""));

  const vizDim = store.select("visualization").viz_dim;
  const heatSizeX = vizDim.heat_size.x;
  const heatSizeY = vizDim.heat_size.y;

  // size of categories, equal to one pixel padding from label, the height of a category
  // times the number of categories, plus a pixel of padding below/to the right of each category
  const catArgs = catArgsManager.getCatArgs();
  const catSizeX = catArgs?.row?.length
    ? catArgs?.row?.[0]?.uniforms.cat_width * catArgs?.row?.length +
      catArgs?.row?.length +
      1
    : 0;
  const catSizeY = catArgs?.col?.length
    ? catArgs?.col?.[0]?.uniforms.cat_width * catArgs?.col?.length +
      catArgs?.col?.length +
      1
    : 0;

  const edim = {};
  edim.x = {};
  const heatmapWidth = heatSizeX * canvasWidth;
  edim.x.heat_min = LABEL_SIZE + catSizeX;
  edim.x.dendro_start = edim.x.heat_min + heatmapWidth - 1;
  edim.x.dendro_end = edim.x.dendro_start + DENDRO_WIDTH + 1;
  edim.y = {};
  const heatmapHeight = heatSizeY * canvasHeight;
  edim.y.heat_min = LABEL_SIZE + catSizeY;
  edim.y.dendro_start = edim.y.heat_min + heatmapHeight - 1;
  edim.y.dendro_end = edim.y.dendro_start + DENDRO_WIDTH + 1;
  const inst_pix = {};
  inst_pix.x = store.select("visualization").zoom_data.x.cursor_position;
  inst_pix.y = store.select("visualization").zoom_data.y.cursor_position;
  let cat_index;
  if (
    inst_pix.x > edim.x.heat_min &&
    inst_pix.x < edim.x.dendro_start &&
    inst_pix.y > edim.y.heat_min &&
    inst_pix.y < edim.y.dendro_start
  ) {
    in_bounds_tooltip = true;
    tooltip_type = TOOLTIP_TYPES.MATRIX_CELL;
  } else if (
    inst_pix.x <= edim.x.heat_min &&
    inst_pix.y > edim.y.heat_min &&
    inst_pix.y < edim.y.dendro_start
  ) {
    in_bounds_tooltip = true;
    if (store.select("cat_data").row.length > 0) {
      cat_index = Math.floor((edim.x.heat_min - inst_pix.x) / catSizeX);
      if (cat_index + 1 <= store.select("cat_data").row.length) {
        tooltip_type =
          "row-cat-" +
          String(store.select("cat_data").row.length - cat_index - 1);
      } else {
        tooltip_type = TOOLTIP_TYPES.ROW_LABEL;
      }
    } else {
      tooltip_type = TOOLTIP_TYPES.ROW_LABEL;
    }
  } else if (
    inst_pix.y <= edim.y.heat_min &&
    inst_pix.x > edim.x.heat_min &&
    inst_pix.x < edim.x.dendro_start
  ) {
    in_bounds_tooltip = true;
    if (store.select("cat_data").col.length > 0) {
      cat_index = Math.floor((edim.y.heat_min - inst_pix.y) / catSizeY);
      if (cat_index + 1 <= store.select("cat_data").col.length) {
        tooltip_type =
          "col-cat-" +
          String(store.select("cat_data").col.length - cat_index - 1);
      } else {
        tooltip_type = TOOLTIP_TYPES.COL_LABEL;
      }
    } else {
      tooltip_type = TOOLTIP_TYPES.COL_LABEL;
    }
  } else if (
    inst_pix.x >= edim.x.dendro_start &&
    inst_pix.x < edim.x.dendro_end &&
    inst_pix.y > edim.y.heat_min &&
    inst_pix.y < edim.y.dendro_start
  ) {
    if (store.select("order").inst.row === "clust") {
      tooltip_type = TOOLTIP_TYPES.ROW_DENDRO;
      in_bounds_tooltip = true;
    }
  } else if (
    inst_pix.y >= edim.y.dendro_start &&
    inst_pix.y < edim.y.dendro_end &&
    inst_pix.x > edim.x.heat_min &&
    inst_pix.x < edim.x.dendro_start
  ) {
    if (store.select("order").inst.col === "clust") {
      tooltip_type = TOOLTIP_TYPES.COL_DENDRO;
      in_bounds_tooltip = true;
    }
  }
  store.dispatch(
    store.actions.mutateTooltipState({
      in_bounds_tooltip,
      tooltip_type,
    })
  );
});
