import { Regl } from "regl";
import { CamerasManager } from "../cameras/camerasManager";
import makePositionArr from "../matrixCells/makePositionArr";
import { NamespacedStore } from "../state/store/store";

export default (function reorderMatrixArgs(
  regl: Regl,
  store: NamespacedStore,
  camerasManager: CamerasManager
) {
  // calculate new ordering
  const newPositionArray = makePositionArr(
    store,
    store.select("order").new.row,
    store.select("order").new.col
  );
  camerasManager.mutateReglProps({
    attributes: {
      pos_att_new: {
        buffer: regl.buffer(Object.values(newPositionArray.pos_dict)),
        divisor: 1,
      },
    },
  });
  camerasManager.remakeMatrixArgs(store);
});
