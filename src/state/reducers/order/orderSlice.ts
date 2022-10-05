import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { merge } from "lodash";
import { produce } from "immer";
import { Ordering } from "../../../types/network";

type AxisOrdering = {
  [x: string]: Ordering;
  row: Ordering;
  col: Ordering;
};

export interface OrderState {
  inst: AxisOrdering;
  new: AxisOrdering;
}

const initialState: OrderState = {} as OrderState;

export const orderSlice = (id: string) =>
  createSlice({
    name: `${id}_order`,
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
      setOrderState: (state, action: PayloadAction<OrderState>) => {
        return action.payload;
      },
      mutateOrderState: (state, action: PayloadAction<Partial<OrderState>>) => {
        return produce(state, (draftState) => {
          merge(draftState, action.payload);
        });
      },
    },
  });
