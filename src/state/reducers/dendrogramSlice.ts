import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { merge } from "lodash";
import { produce } from "immer";

type TriangleInfo = {
  [x: string]: {
    name_top: string;
    name_bot: string;
    pos_top: number;
    pos_bot: number;
    pos_mid: number;
    name: string;
    all_names: string[];
    inst_axis: string; // Replace with "row" / "col"
  };
};

export interface DendrogramState {
  default_level: number;
  tri_height: number;
  trap_height: number;
  trap_float: number;
  update_dendro: boolean;
  default_link_level: number;
  output_label_format: string;
  min_dist: {
    row: number;
    col: number;
  };
  precalc_linkage: boolean;
  max_linkage_dist: {
    row: number;
    col: number;
  };
  increment_buttons: boolean;
  group_level: {
    row: number;
    col: number;
  };
  group_info: {
    row: TriangleInfo[];
    col: TriangleInfo[];
  };
}

const initialState: DendrogramState = {} as DendrogramState;

export const dendrogramSlice = (id: string) =>
  createSlice({
    name: `${id}_dendro`,
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
      setDendrogramState: (state, action: PayloadAction<DendrogramState>) => {
        return action.payload;
      },
      mutateDendrogramState: (
        state,
        action: PayloadAction<Partial<DendrogramState>>
      ) => {
        return produce(state, (draftState) => {
          merge(draftState, action.payload);
        });
      },
    },
  });
