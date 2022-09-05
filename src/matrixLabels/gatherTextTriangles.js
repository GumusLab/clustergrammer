import { cloneDeep } from "lodash";
import * as _ from "underscore";
import WebworkerPromise from 'webworker-promise';
import { dropFromLabelQueue, pushHighQueueLabel } from "../state/reducers/labels/labelsSlice";
import { mutateVisualizationState } from "../state/reducers/visualization/visualizationSlice";
import { MAX_LABEL_LENGTH } from "./labels.const";

const vectorizeWorker = new WebworkerPromise(new Worker(new URL("./vectorizeWorker.js", import.meta.url), { type: "module" }));

export default function gather_text_triangles(store, viz_area, inst_axis) {
  const {
    visualization: { text_triangles: oldTextTriangles },
    labels: oldLabels,
    network,
  } = store.getState();

  const tasks = [];
  const labels = cloneDeep(oldLabels);
  const fontDetail = labels.font_detail;
  const text_triangles = cloneDeep(oldTextTriangles);
  text_triangles.draw[inst_axis] = [];

  let inst_dim;
  if (inst_axis === "col") {
    inst_dim = "x";
  } else {
    inst_dim = "y";
  }
  // generating array with text triangles and y-offsets
  const min_viz = viz_area[inst_dim + "_min"];
  const max_viz = viz_area[inst_dim + "_max"];
  _.each(network[inst_axis + "_nodes"], function (inst_label) {
    if (
      inst_label.offsets.inst > min_viz &&
      inst_label.offsets.inst < max_viz
    ) {
      let inst_name = inst_label.name;
      if (inst_name.indexOf(": ") >= 0) {
        inst_name = inst_label.name.split(": ")[1];
      }
      // truncate label if needed
      if (inst_name.length > MAX_LABEL_LENGTH) {
        inst_name = `${inst_name.substring(0, MAX_LABEL_LENGTH)}...`;
      }
      let inst_text_vect;
      if (inst_name in text_triangles[inst_axis]) {
        // add to text_triangles.draw if pre-calculated
        inst_text_vect = {
          ...text_triangles[inst_axis][inst_name],
          inst_offset: [0, inst_label.offsets.inst],
          new_offset: [0, inst_label.offsets.new],
        };
        text_triangles.draw[inst_axis].push(inst_text_vect);
      } else {
        store.dispatch(
          pushHighQueueLabel({ axis: inst_axis, label: inst_name })
        );

        /*
          moved text triangle calculations to background, unless pre-calc
        */
        if (labels.precalc[inst_axis]) {
          // calculate text vector
          // vectorize the label so we can draw it at any scale
          tasks.push(vectorizeWorker.postMessage({
            fontDetail, 
            name: inst_name, 
            axis: inst_axis,
            offsetInst: inst_label.offsets.inst,
            offsetNew: inst_label.offsets.new,
          }));
          store.dispatch(
            dropFromLabelQueue({ queue: "low", axis: inst_axis, label: inst_name })
          );
        }
      }
    }
  });
  Promise.all(tasks).then((results) => {
    results.forEach((result) => {
      text_triangles[result.axis][result.name] = result.shader;
      result.shader.inst_offset = [0, result.offsetInst];
      result.shader.new_offset = [0, result.offsetNew];
      text_triangles.draw[inst_axis].push(result.shader);
    });
    store.dispatch(
      mutateVisualizationState({
        text_triangles,
      })
    );
  });

  store.dispatch(
    mutateVisualizationState({
      text_triangles,
    })
  );
}
