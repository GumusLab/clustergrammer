import colorToRgba from "../../../colors/colorToRgba";
import type { ClustergrammerProps } from "../../../index.types";
import { MatColors } from "../../reducers/catVizSlice";
import { NamespacedStore } from "../../store/store";

export default function setCatVizMatrixColors(
  store: NamespacedStore,
  args: Partial<ClustergrammerProps>
) {
  const network = store.select("network");
  // by default just use blue and red
  const matColors: MatColors = {
    pos_rgb: colorToRgba("red").slice(0, 3),
    neg_rgb: colorToRgba("blue").slice(0, 3),
  };
  // prioritize matrix colors passed in by args
  if (args.matrixColors) {
    matColors.pos_rgb =
      typeof args.matrixColors.pos === "object"
        ? args.matrixColors.pos
        : colorToRgba(args.matrixColors.pos);
    matColors.neg_rgb =
      typeof args.matrixColors.neg === "object"
        ? args.matrixColors.neg
        : colorToRgba(args.matrixColors.neg);
  } else if ("matrix_colors" in network) {
    // secondarily prioritize matrix colors defined by the network
    const pos_color = network?.matrix_colors?.pos;
    const neg_color = network?.matrix_colors?.neg;
    matColors.pos_rgb = colorToRgba(pos_color).slice(0, 3);
    matColors.neg_rgb = colorToRgba(neg_color).slice(0, 3);
  }

  store.dispatch(
    store.actions.mutateCatVizState({
      mat_colors: matColors,
    })
  );
}
