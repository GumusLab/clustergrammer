import { Regl } from "regl";
import { CamerasManager } from "../cameras/camerasManager";
import { CatArgsManager } from "../cats/manager/catArgsManager";
import { ClustergrammerProps } from "../index.types";
import { NamespacedStore } from "../state/store/store";
import run_viz from "./functions/animation/runViz";
import build_dendrogram_sliders from "./functions/buildDendrogramSliders";
import { buildLegend } from "./functions/buildLegend";
import build_control_panel from "./functions/controlPanel/buildControlPanel";
import ini_canvas_mouseover from "./functions/mouseover/iniCanvasMouseover";

export type UIProps = {
  regl: Regl;
  store: NamespacedStore;
  camerasManager: CamerasManager;
  catArgsManager: CatArgsManager;
  args: ClustergrammerProps;
};

export class UI {
  constructor(props: UIProps) {
    const { regl, store, camerasManager, catArgsManager, args } = props;

    const { container, showControls, showDendroSliders, hideLegend } = args;

    if (showControls) {
      build_control_panel(
        regl,
        store,
        container,
        catArgsManager,
        camerasManager
      );
    }
    if (showDendroSliders) {
      build_dendrogram_sliders(regl, store);
    }
    if (!hideLegend) {
      buildLegend(store);
    }
    ini_canvas_mouseover(store);
    run_viz(regl, store, catArgsManager, camerasManager);
  }
}
