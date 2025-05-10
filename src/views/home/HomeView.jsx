import { Fragment } from "react";

import { useView } from "../../contexts/ViewContext.jsx";
import {
  SUB_VIEW_ID_FAVORITES,
  SUB_VIEW_ID_MAP,
  SUB_VIEW_ID_SEARCH,
} from "../../constants/ViewConstants.jsx";

import Main from "../../components/Main.jsx";
import HomeMenu from "../../components/home/HomeMenu.jsx";
import HomeSearchSubview from "./subviews/HomeSearchSubview.jsx";
import HomeFavoritesSubview from "./subviews/HomeFavoritesSubview.jsx";

const HomeView = (props) => {
  const { subViewId } = useView();

  const SelectedContent = (props) => {
    switch (subViewId) {
      case SUB_VIEW_ID_FAVORITES:
        return <HomeFavoritesSubview />;

      case SUB_VIEW_ID_MAP:
        return null;

      case SUB_VIEW_ID_SEARCH:
        return <HomeSearchSubview />;

      default:
        throw new Error(
          `No case for subview identifier ${subViewId} found in HomeView`
        );
    }
  };

  return (
    <Fragment>
      <Main>
        <SelectedContent />
        <HomeMenu />
      </Main>
    </Fragment>
  );
};

export default HomeView;
