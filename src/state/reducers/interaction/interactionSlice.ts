import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { merge } from "lodash";
import getInitialInteractionState from "./getInitialInteractionState";

export interface InteractionState {
  total: number;
  still_interacting: boolean;
  need_reset_cat_opacity: boolean;
  mouseover: {
    [x: string]: any;
    value: any;
    row: {
      name: string;
      cats: any[];
    };
    col: {
      name: string;
      cats: any[];
    };
  };
  enable_viz_interact: boolean;
  manual_update_cats: boolean;
}

const initialState: InteractionState =
  getInitialInteractionState() as unknown as InteractionState;

export const interactionSlice = (id: string) =>
  createSlice({
    name: `${id}_interaction`,
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
      setInteractionState: (state, action: PayloadAction<InteractionState>) => {
        return action.payload;
      },
      mutateInteractionState: (
        state,
        action: PayloadAction<Partial<InteractionState>>
      ) => {
        return merge(state, action.payload);
      },
      setMouseoverInteraction: (
        state,
        action: PayloadAction<InteractionState["mouseover"]>
      ) => {
        state.mouseover = action.payload;
      },
      incrementInteractionTotal: (state, action: PayloadAction<number>) => {
        state.total = state.total + action.payload;
      },
    },
  });
