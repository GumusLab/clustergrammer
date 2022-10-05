import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { merge } from "lodash";
import { produce } from "immer";
import genIntPar from "../animation/getInitialAnimationState";

export interface AnimationState {
  time_remain: number;
  running: boolean;
  run_animation: boolean;
  last_switch_time: number;
  ani_duration: number;
  duration_end: number;
  time: number;
  first_frame: boolean;
  ini_viz: boolean;
  last_click: number;
  dblclick_duration: number;
  update_viz: boolean;
}

const initialState: AnimationState = genIntPar();

export const animationSlice = (id: string) =>
  createSlice({
    name: `${id}_animation`,
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
      setAnimationState: (state, action: PayloadAction<AnimationState>) => {
        return action.payload;
      },
      mutateAnimationState: (
        state,
        action: PayloadAction<Partial<AnimationState>>
      ) => {
        return produce(state, (draftState) => {
          merge(draftState, action.payload);
        });
      },
    },
  });
