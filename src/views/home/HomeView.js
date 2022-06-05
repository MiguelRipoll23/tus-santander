import { Fragment, useState } from "react";

import { useView } from "../../contexts/ViewContext.js";
import * as ViewConstants from "../../constants/ViewConstants.js";

import Nav from "../../components/Nav.js";
import HomeSearchSubview from "./subviews/HomeSearchSubview.js";
import HomeFavoritesSubview from "./subviews/HomeFavoritesSubview.js";

import HomeMenu from "../../components/home/HomeMenu.js";

const HomeView = (props) => {
  const { subViewId } = useView();

  const [titleText, setTitleText] = useState(
    ViewConstants.SUB_VIEW_TITLE_FAVORITES
  );

  const updateTitleText = (newTitleText) => {
    setTitleText(newTitleText);
  };

  const Content = (props) => {
    switch (subViewId) {
      case ViewConstants.SUB_VIEW_ID_FAVORITES:
        return <HomeFavoritesSubview updateTitleText={props.updateTitleText} />;

      case ViewConstants.SUB_VIEW_ID_MAP:
        return null;

      case ViewConstants.SUB_VIEW_ID_SEARCH:
        return <HomeSearchSubview updateTitleText={props.updateTitleText} />;

      default:
        throw new Error(
          `No case for subview identifier ${subViewId} found in HomeView`
        );
    }
  };

  return (
    <Fragment>
      <Nav isHeader={true} titleText={titleText} />
      <Content updateTitleText={updateTitleText} />
      <HomeMenu />
    </Fragment>
  );
};

export default HomeView;
