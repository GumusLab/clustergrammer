import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { merge, without } from "lodash";
import { MAX_LABEL_LENGTH } from "../../../matrixLabels/labels.const";

export interface LabelQueue {
  [x: string]: string[];
  row: string[];
  col: string[];
}

export interface LabelsState {
  [x: string]: any;
  num_row: number;
  num_col: number;
  offset_dict: {
    [x: string]: Record<string, any> | undefined;
    row?: Record<string, any>;
    col?: Record<string, any>;
  };
  draw_labels: boolean;
  font_detail: number;
  titles: {
    row?: string;
    col?: string;
  };
  precalc: {
    row?: boolean;
    col?: boolean;
  };
  ordered_labels: {
    [x: string]: any;
    rows?: string[];
    cols?: string[];
    row_indices?: number[];
    col_indices?: number[];
  };
  labels_queue: {
    high: LabelQueue;
    low: LabelQueue;
  };
  max_label_queue: number;
}

const initialState: LabelsState = {
  num_row: 0,
  num_col: 0,
  offset_dict: {} as LabelsState["offset_dict"],
  draw_labels: false,
  // font_detail range: min ~12 max ~200
  // usable range: 14-30 (was using 25)
  font_detail: 40,
  titles: {},
  precalc: {},
  ordered_labels: {},
  labels_queue: {
    high: { row: [], col: [] },
    low: { row: [], col: [] },
  },
  max_label_queue: 2000,
  labelLength: MAX_LABEL_LENGTH,
};

export const labelsSlice = (id: string) =>
  createSlice({
    name: `${id}_labels`,
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
      setLabelsState: (state, action: PayloadAction<LabelsState>) => {
        return action.payload;
      },
      mutateLabelsState: (
        state,
        action: PayloadAction<Partial<LabelsState>>
      ) => {
        return merge(state, action.payload);
      },
      setLabelsOffsetDict: (
        state,
        action: PayloadAction<LabelsState["offset_dict"]>
      ) => {
        state.offset_dict = action.payload;
      },
      setLabelsQueue: (
        state,
        action: PayloadAction<LabelsState["labels_queue"]>
      ) => {
        state.labels_queue = action.payload;
      },
      pushHighQueueLabel: (
        state,
        action: PayloadAction<{ axis: string; label: string }>
      ) => {
        const { axis, label } = action.payload;
        state?.labels_queue?.high?.[axis].push(label);
        return state;
      },
      dropFromLabelQueue: (
        state,
        action: PayloadAction<{
          queue: "high" | "low";
          axis: "col" | "row";
          label: string;
        }>
      ) => {
        const { queue, label, axis } = action.payload;
        state.labels_queue[queue][axis] = without(
          state?.labels_queue?.[queue][axis],
          label
        );
      },
    },
  });
