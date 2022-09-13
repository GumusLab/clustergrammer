import { merge } from "lodash";
import { Regl } from "regl";
import * as _ from "underscore";
import { ClustergrammerProps } from "../../index.types";
import calcTextOffsets from "../../matrixLabels/calcTextOffsets";
import makeLabelQueue from "../../matrixLabels/makeLabelQueue";
import { NetworkDataNode } from "../../types/network";
import { LabelsState } from "../reducers/labels/labelsSlice";
import { NetworkState } from "../reducers/networkSlice";
import { NodeCanvasPos } from "../reducers/nodeCanvasPosSlice";
import { NamespacedStore } from "../store/store";
import calcAlphaOrder from "./functions/calcAlphaOrder";
import calcMatArr from "./functions/calcMatArr";
import calcRowAndColCanvasPositions from "./functions/calcRowAndColCanvasPositions";
import calcVizDim from "./functions/calcVizDim";
import genCatPar from "./functions/genCatPar";
import generateCatVizInfo from "./functions/generateCatVizInfo";
import generateVisualizationParams from "./functions/generateVisualizationParams";
import getInitialOrderState from "./functions/getInitialOrderState";
import initializeDendrogramState from "./functions/initializeDendrogramState";
import initializeLabels from "./functions/initializeLabels";
import setCatVizMatrixColors from "./functions/setCatVizMatrixColors";

export default function initialize_params(
  regl: Regl,
  args: ClustergrammerProps,
  store: NamespacedStore
) {
  const rootElementId = "#" + args.container.id;
  store.dispatch(
    store.actions.mutateVisualizationState({
      rootElementId,
    })
  );

  // network setup
  const initialNetwork = args.network;
  // alpha ordering
  const networkWithAlphaOrdering = calcAlphaOrder(initialNetwork);
  // normalization state
  const norm: NetworkState["norm"] = {
    initial_status: "non-zscored",
    zscore_status: "non-zscored",
  };
  const baseNetwork = merge(initialNetwork, networkWithAlphaOrdering);
  if ("pre_zscore" in baseNetwork) {
    norm.initial_status = "zscored";
    norm.zscore_status = "zscored";
  }
  store.dispatch(
    store.actions.setNetworkState({
      ...baseNetwork,
      norm,
      // fix initial ordering indexing (will fix in Python on nex release)
      row_nodes: baseNetwork.row_nodes.map((x: NetworkDataNode) => ({
        ...x,
        ini: (x.ini || 0) - 1,
      })),
      col_nodes: baseNetwork.col_nodes.map((x: NetworkDataNode) => ({
        ...x,
        ini: (x.ini || 0) - 1,
      })),
    })
  );

  // cat_data setup
  genCatPar(store);

  // order setup
  getInitialOrderState(store);

  // labels setup
  initializeLabels(store, args.labelLength);

  // category viz data setup
  generateCatVizInfo(store);

  // visualization dimensions setup
  calcVizDim(regl, store);

  // tooltip setup
  store.dispatch(
    store.actions.setTooltipState({
      ...store.select("tooltip"),
      ...(args.enabledTooltips?.length
        ? { enabledTooltips: args.enabledTooltips }
        : {}),
      disable_tooltip: args.disableTooltip || false,
      use_hzome: args.use_hzome || false,
      tooltip_id: "#d3-tip_" + rootElementId.replace("#", ""),
    })
  );

  // row and col canvas positions setup
  calcRowAndColCanvasPositions(store);

  // labels offset dict setup
  const offset_dict: Record<string, any> = {};
  _.each(["row", "col"], function (inst_axis) {
    offset_dict[inst_axis] = calcTextOffsets(store, inst_axis);
  });
  store.dispatch(
    store.actions.setLabelsOffsetDict(offset_dict as LabelsState["offset_dict"])
  );

  // labels setup
  makeLabelQueue(store);

  // visualization setup
  generateVisualizationParams(store, rootElementId);

  // node canvas pos
  store.dispatch(
    store.actions.setNodeCanvasPos(calcMatArr(store) as NodeCanvasPos)
  );

  // matrix color parameters
  setCatVizMatrixColors(store, args);

  // dendrogram state
  initializeDendrogramState(store);
}
