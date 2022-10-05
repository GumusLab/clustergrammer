import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type RowAndColCanvasPositions = {
  x_arr: number[];
  y_arr: number[];
};

const initialState: RowAndColCanvasPositions = {} as RowAndColCanvasPositions;

export const rowAndColCanvasPositionsSlice = (id: string) =>
  createSlice({
    name: `${id}_rowAndColCanvasPositions`,
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
      setRowAndColCanvasPositions: (
        state,
        action: PayloadAction<RowAndColCanvasPositions>
      ) => {
        return action.payload;
      },
    },
  });
