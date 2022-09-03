import { createContext, useContext } from "react";
import { getInitialState } from "../reducers/ViewReducer.js";

const initialState = getInitialState();
export const ViewContext = createContext(initialState);

export const useView = () => {
  const context = useContext(ViewContext);

  if (context === undefined) {
    throw new Error("useView must be used within ViewContext");
  }

  return context;
};
