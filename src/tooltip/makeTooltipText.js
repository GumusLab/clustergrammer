import { select } from "d3-selection";
import * as _ from "underscore";
import { getHzomeGeneInfo } from "./getHzomeGeneInfo";
import make_dendro_tooltip from "./makeDendroTooltip";
import { TOOLTIP_TYPES } from "./tooltip.const";

export default (function makeTooltipText(
  regl,
  store,
  catArgsManager,
  camerasManager,
  tooltip_fun,
  mouseover
) {
  let inst_axis;
  let tooltip_text;
  if (store.select("tooltip").tooltip_type === TOOLTIP_TYPES.MATRIX_CELL) {
    // Matrix-Cell Tooltip
    // //////////////////////
    // row name
    tooltip_text = mouseover.row.name;
    tooltip_text = tooltip_text + " and ";
    // col name
    tooltip_text = tooltip_text + mouseover.col.name;
    tooltip_text = tooltip_text + " <br>Value: " + mouseover.value.toFixed(3);
    if ("value_iz" in store.select("interaction").mouseover) {
      tooltip_text =
        tooltip_text + " <br>Original value: " + mouseover.value_iz.toFixed(3);
    }
    tooltip_fun.show("tooltip");
    select(store.select("tooltip").tooltip_id)
      .style("text-align", "left")
      .html(tooltip_text);
  } else if (store.select("tooltip?").tooltip_type.indexOf("-label") > 0) {
    // Label Tooltip
    // ////////////////
    inst_axis = store.select("tooltip?").tooltip_type.split("-")[0];
    tooltip_text = mouseover[inst_axis].name;
    _.each(mouseover[inst_axis].cats, function (inst_cat) {
      tooltip_text = tooltip_text + "<br>" + inst_cat;
    });
    tooltip_fun.show("tooltip");
    select(store.select("tooltip").tooltip_id)
      .style("text-align", "left")
      .html(tooltip_text);
    if (store.select("tooltip").use_hzome === true) {
      getHzomeGeneInfo(store, mouseover[inst_axis].name);
    }
  } else if (store.select("tooltip?").tooltip_type.indexOf("-dendro") > 0) {
    // Dendro Tooltip
    // ////////////////
    inst_axis = store.select("tooltip").tooltip_type.split("-")[0];
    make_dendro_tooltip(
      regl,
      store,
      catArgsManager,
      camerasManager,
      tooltip_fun,
      mouseover,
      inst_axis
    );
  } else if (store.select("tooltip?").tooltip_type.indexOf("-cat-") > 0) {
    // Category Tooltip
    // ///////////////////
    inst_axis = store.select("tooltip").tooltip_type.split("-")[0];
    const inst_index = store.select("tooltip").tooltip_type.split("-")[2];
    tooltip_text = mouseover[inst_axis].cats[inst_index];
    tooltip_fun.show("tooltip");
    select(store.select("tooltip").tooltip_id)
      .style("text-align", "left")
      .html(tooltip_text);
  }
});
