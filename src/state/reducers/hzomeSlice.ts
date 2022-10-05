import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { merge } from "lodash";
import {produce} from "Immer"

export type GeneDatum = {
  name: string;
  description: string;
};

export interface HzomeState {
  gene_data: Record<string, GeneDatum>;
}

const initialState: HzomeState = {
  gene_data: {},
};

export const hzomeSlice = (id: string) =>
  createSlice({
    name: `${id}_hzome`,
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
      mutateHzomeGeneData: (state, action: PayloadAction<HzomeState>) => {
        state.gene_data = produce(state.gene_data, (draftState) => {
          merge(draftState.gene_data, action.payload);
        });
      },
    },
  });
