import { select } from "d3-selection";
import { Regl } from "regl";
import { CamerasManager } from "./cameras/camerasManager";
import { CatArgsManager } from "./cats/manager/catArgsManager";
import draw_webgl_layers from "./draws/drawWebglLayers";
import recluster from "./recluster/recluster";
import runReorder from "./reorders/runReorder";
import initializeRegl from "./state/initialize/functions/initializeRegl";
import initializeStore from "./state/initialize/initializeStore";
import { NetworkState } from "./state/reducers/networkSlice";
import { TooltipState } from "./state/reducers/tooltip/tooltipSlice";
import { createStore, NamespacedStore } from "./state/store/store";
import { createCanvasContainer } from "./ui/functions/createCanvasContainer";
import { UI } from "./ui/ui";
import { CANVAS_CONTAINER_CLASSNAME } from "./ui/ui.const";
import zoom_rules_high_mat from "./zoom/zoomRulesHighMat";

export type ClustergrammerInstance = {};

export type OnClickCallbackProps = {
  row: string | null;
  col: string | null;
  clickType: TooltipState["tooltip_type"];
};

export type OnClickCallback =
  | (({ row, col, clickType }: OnClickCallbackProps) => void)
  | undefined;

export type ClustergrammerProps = {
  use_hzome?: boolean;
  container: HTMLElement;
  network: NetworkState;
  width: number | string;
  height: number | string;
  showControls?: boolean;
  showDendroSliders?: boolean;
  onClick?: OnClickCallback;
  disableTooltip?: boolean;
  enabledTooltips?: Array<"dendro" | "cat" | "cell" | "label" | string>;
  labelLength?: number;
};

const updateSearchedRows = 
  (
    regl: Regl,
    store: NamespacedStore,
    catArgsManager: CatArgsManager,
    camerasManager: CamerasManager
  )  => 
  (rows: string[]) => {
    store.dispatch(store.actions.setSearchedRows(rows));
    draw_webgl_layers(regl, store, catArgsManager, camerasManager);
}

const adjustOpacity =
  (
    regl: Regl,
    store: NamespacedStore,
    catArgsManager: CatArgsManager,
    camerasManager: CamerasManager
  ) =>
  (opacity: number) => {
    store.dispatch(store.actions.setOpacityScale(opacity));
    draw_webgl_layers(regl, store, catArgsManager, camerasManager);
  };

function clustergrammer_gl(
  args: ClustergrammerProps
): ClustergrammerInstance | null {
  const {
    container,
    showControls = true,
    showDendroSliders = true,
    width,
    height,
    onClick,
  } = args;

  // check if container is defined
  if (
    container !== null &&
    select(container).select(`.${CANVAS_CONTAINER_CLASSNAME}`).empty()
  ) {
    // create a container for the webGL canvas
    const canvas_container = createCanvasContainer(container, width, height);

    // initialize REGL manager
    // NOTE: this must be done before anything else,
    // all renders and the store initialization depends on it
    const regl = initializeRegl(canvas_container);

    // create store instance (to be passed to all functions)
    const store = createStore();

    // initialize store defaults now that we have a REGL instance
    // NOTE: do this before any components, as the components access
    // the state
    initializeStore(regl, args, store);

    // initialize components
    const camerasManager = new CamerasManager(regl, store);
    const catArgsManager = new CatArgsManager(regl, store);

    // set up the UI
    const ui = new UI({
      regl,
      store,
      camerasManager,
      catArgsManager,
      container,
      vizWidth: width,
      vizHeight: height,
      showControls,
      showDendroSliders,
    });

    // zoom rules
    zoom_rules_high_mat(regl, store, catArgsManager, camerasManager, onClick);

    // get snapshot of state to return
    return {
      cameras: camerasManager,
      ui, // should we actually return this? (should it even be a class or just a function?)
      adjust_opacity: adjustOpacity(
        regl,
        store,
        catArgsManager,
        camerasManager
      ),
      params: {
        network: {
          row_node_names: store.select("network.row_node_names"),
        },
      },
      utils: {
        highlight: updateSearchedRows(regl, store, catArgsManager, camerasManager),
      },
      functions: {
        recluster: (distance_metric: string, linkage_type: string) => {
          const matrixState = store.select("matrix");
          if (
            distance_metric !== matrixState.distance_metric ||
            linkage_type !== matrixState.linkage_type
          ) {
            store.dispatch(
              store.actions.mutateMatrixState({
                potential_recluster: {
                  distance_metric,
                  linkage_type,
                },
                distance_metric,
                linkage_type,
              })
            );
            recluster(regl, store, catArgsManager, camerasManager);
          }
        },
        reorder: (
          axis: "row" | "col" | string,
          order: "clust" | "sum" | "var" | "ini" | string
        ) => {
          const reorderState = store.select("order");
          const clean_order = order
            .replace("sum", "rank")
            .replace("var", "rankvar");
          if (reorderState.inst[axis] !== clean_order) {
            runReorder(
              regl,
              store,
              catArgsManager,
              camerasManager,
              axis,
              order
            );
          }
        },
      },
    };
  }
  return null;
}
export default clustergrammer_gl;
