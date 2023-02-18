import { Fragment } from "react";

import { useView } from "../../contexts/ViewContext.js";
import * as ViewConstants from "../../constants/ViewConstants.js";

import Content from "../../components/Content.js";
import HomeMenu from "../../components/home/HomeMenu.js";
import HomeSearchSubview from "./subviews/HomeSearchSubview.js";
import HomeFavoritesSubview from "./subviews/HomeFavoritesSubview.js";

const HomeView = (props) => {
  const { subViewId } = useView();

  const SelectedContent = (props) => {
    switch (subViewId) {
      case ViewConstants.SUB_VIEW_ID_FAVORITES:
        return <HomeFavoritesSubview />;

      case ViewConstants.SUB_VIEW_ID_MAP:
        return null;

      case ViewConstants.SUB_VIEW_ID_SEARCH:
        return <HomeSearchSubview />;

      default:
        throw new Error(
          `No case for subview identifier ${subViewId} found in HomeView`
        );
    }
  };

  return (
    <Fragment>
      <Content>
        <SelectedContent />
        <HomeMenu />
      </Content>
    </Fragment>
  );
};

export default HomeView;
