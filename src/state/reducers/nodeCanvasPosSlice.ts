import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type NodeCanvasPos = {
  x_arr: number[];
  y_arr: number[];
};

const initialState: NodeCanvasPos = {} as NodeCanvasPos;

export const nodeCanvasPosSlice = (id: string) =>
  createSlice({
    name: `${id}_node_canvas_pos`,
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
      setNodeCanvasPos: (state, action: PayloadAction<NodeCanvasPos>) => {
        return action.payload;
      },
    },
  });
