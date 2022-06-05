import { createContext, useContext } from "react";
import { initialState } from "../reducers/ViewReducer.js";

export const ViewContext = createContext(initialState);

export const useView = () => {
  const context = useContext(ViewContext);

  if (context === undefined) {
    throw new Error("useView must be used within ViewContext");
  }

  return context;
};
