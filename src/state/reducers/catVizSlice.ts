import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { merge } from "lodash";

export type CurrentPanel = "reorder" | "recluster";

export type MatColors = {
  pos_rgb: number[];
  neg_rgb: number[];
};

export interface CatVizState {
  show_categories: Record<string, boolean>;
  all_cats: Record<string, any[]>;
  cat_names: Record<string, Record<string, any>>;
  cat_info: Record<string, Record<string, any>>;
  cat_bar_width: number;
  cat_bar_height: number;
  cat_value_colors: string[];
  current_panel: CurrentPanel;
  cat_colors: {
    value_opacity?: {
      row?: any;
      col?: any;
    };
    row?: Record<string, Record<string, any>>;
    col?: Record<string, Record<string, any>>;
    opacity?: number;
    active_opacity?: number;
  };
  global_cat_colors: Record<string, string>;
  mat_colors: MatColors;
}

const initialState: CatVizState = {
  cat_bar_width: 180,
  cat_bar_height: 15,
  cat_value_colors: ["#2F4F4F", "#9370DB"],
  current_panel: "reorder",
  show_categories: {},
} as CatVizState;

export const catVizSlice = (id: string) =>
  createSlice({
    name: `${id}_cat_viz`,
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
      setCatVizState: (state, action: PayloadAction<CatVizState>) => {
        return action.payload;
      },
      mutateCatVizState: (
        state,
        action: PayloadAction<Partial<CatVizState>>
      ) => {
        return merge(state, action.payload);
      },
    },
  });
