import { Fragment, useReducer, useState, useEffect } from "react";

import Nav from "./Nav.js";
import Main from "./Main.js";

const initialView = {
  id: "home",
  nav: {
    title: "Favoritos",
    header: true,
    refresh: false,
    heart: 0,
  },
  data: {
    refresh: 0,
    heart: 0,
    push: false,
    subview: "favorites",
  },
};

const updateView = (view, newView) => {
  newView = { ...view, ...newView };
  newView.nav = { ...view.nav, ...newView.nav };
  newView.data = { ...view.data, ...newView.data };

  console.log("View", newView);

  return newView;
};

const App = () => {
  const [view, setView] = useReducer(updateView, initialView);
  const [visible, setVisible] = useState(false);

  // History
  window.onpopstate = (event) => {
    const state = event.state;

    if (state === null) {
      setView(initialView);
      return;
    }

    state.data.push = false;
    state.data.heart = 0;
    state.data.refresh = 0;

    console.log("History", state);

    setView(state);
  };

  // Auto-refresh
  useEffect(() => {
    if (visible === false || view.id.includes("estimations") === false) {
      return;
    }

    const newView = {
      data: {
        push: false,
        refresh: Date.now(),
        heart: 0,
      },
    };

    setView(newView);
  }, [visible, view.id]);

  // Init
  useEffect(() => {
    document.onvisibilitychange = () => {
      let visible = true;

      if (document["hidden"]) {
        visible = false;
      }

      setVisible(visible);
    };
  }, []);

  return (
    <Fragment>
      <Nav view={view} setView={setView} />
      <Main view={view} setView={setView} />
    </Fragment>
  );
};

export default App;
