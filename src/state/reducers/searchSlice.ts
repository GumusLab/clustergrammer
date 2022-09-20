import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SearchState {
  searched_rows: string[];
  highlighted_rows: string[];
  highlighted_cols: string[];
}

const initialState: SearchState = {
  searched_rows: [],
  highlighted_rows: [],
  highlighted_cols: [],
};

export const searchSlice = (id: string) =>
  createSlice({
    name: `${id}_search`,
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
      setSearchedRows: (
        state,
        action: PayloadAction<SearchState["searched_rows"]>
      ) => {
        state.searched_rows = action.payload;
        return state;
      },
      setHightlightedRowsAndCols: (
        state,
        action: PayloadAction<{
          hightlighted_rows: SearchState["highlighted_rows"];
          highlighted_cols: SearchState["highlighted_cols"];
        }>
      ) => {
        state.highlighted_rows = action.payload.hightlighted_rows;
        state.highlighted_cols = action.payload.highlighted_cols;
        return state;
      },
      setHighlightedRows: (
        state,
        action: PayloadAction<SearchState["highlighted_rows"]>
      ) => {
        state.highlighted_rows = action.payload;
        return state;
      },
      setHighlightedCols: (
        state,
        action: PayloadAction<SearchState["highlighted_cols"]>
      ) => {
        state.highlighted_cols = action.payload;
        return state;
      }
    },
  });
