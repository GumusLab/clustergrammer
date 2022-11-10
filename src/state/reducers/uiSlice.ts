import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UIState {}

const initialState: UIState = {};

export const uiSlice = (id: string) =>
  createSlice({
    name: `${id}_ui`,
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
      setUI: (state, action: PayloadAction<UIState>) => {
        return action.payload;
      },
    },
  });
