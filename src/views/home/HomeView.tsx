import React from "react";
import { Fragment } from "react";

import { useView } from "../../contexts/ViewContext";
import {
  SUB_VIEW_ID_FAVORITES,
  SUB_VIEW_ID_MAP,
  SUB_VIEW_ID_SEARCH,
  SUB_VIEW_ID_TRIP,
} from "../../constants/ViewConstants";
import type { SubViewId } from "../../types/view";

import Main from "../../components/Main";
import HomeMenu from "../../components/home/HomeMenu";
import HomeSearchSubview from "./subviews/HomeSearchSubview";
import HomeFavoritesSubview from "./subviews/HomeFavoritesSubview";
import HomeTripSubview from "./subviews/HomeTripSubview";

interface SelectedContentProps {
  subViewId: SubViewId;
}

function SelectedContent({ subViewId }: SelectedContentProps): React.JSX.Element | null {
  switch (subViewId) {
    case SUB_VIEW_ID_FAVORITES:
      return <HomeFavoritesSubview />;

    case SUB_VIEW_ID_MAP:
      return null;

    case SUB_VIEW_ID_SEARCH:
      return <HomeSearchSubview />;

    case SUB_VIEW_ID_TRIP:
      return <HomeTripSubview />;

    default:
      throw new Error(
        `No case for subview identifier ${subViewId} found in HomeView`
      );
  }
}

function HomeView(): React.JSX.Element {
  const { subViewId } = useView();

  return (
    <Fragment>
      <Main paddingBottom="100px">
        <SelectedContent subViewId={subViewId} />
        <HomeMenu />
      </Main>
    </Fragment>
  );
}

export default HomeView;
