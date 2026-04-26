import React from "react";
import type { CSSProperties } from "react";
import { Fragment, useState } from "react";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ArrowUpDown } from "lucide-react";

import type { Favorite } from "../../../interfaces/favorite";
import { useView } from "../../../contexts/ViewContext";
import { getFavorites, saveFavorites } from "../../../utils/FavoriteUtils";
import {
  VIEW_ID_ESTIMATIONS_STOP,
  VIEW_ID_MAP,
} from "../../../constants/ViewConstants";
import {
  EVENT_TYPE_FAVORITE_REORDER,
  EVENT_TYPE_FAVORITE_SELECT,
} from "../../../constants/TelemetryConstants";
import { sendTelemetryEvent } from "../../../utils/TelemetryUtils";

import Nav from "../../../components/Nav";
import ErrorDisplay from "../../../components/Error";
import HomeDesktop from "../../../components/home/HomeDesktop";
import { useI18n } from "../../../contexts/I18nContext";
import DonationBubble from "../../../components/home/DonationBubble";

interface SortableFavoriteProps {
  favorite: Favorite;
  editMode: boolean;
  loadEstimationsStopView: (favorite: Favorite) => void;
}

function SortableFavorite({
  favorite,
  editMode,
  loadEstimationsStopView,
}: SortableFavoriteProps): React.JSX.Element {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: favorite.stop_id });

  const transformString = CSS.Transform.toString(transform);
  const style: CSSProperties = {
    transform: transformString
      ? `${transformString} ${isDragging ? "scale(1.05)" : ""}`
      : undefined,
    transition: transition ?? undefined,
    zIndex: isDragging ? 1 : "auto",
    position: "relative",
    touchAction: "none",
    boxShadow: isDragging ? "0px 10px 20px rgba(0,0,0,0.3)" : "none",
    opacity: isDragging ? 0.9 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="mx-3.5 mb-2 w-[calc(100%-28px)] box-border relative"
      {...attributes}
      {...(editMode ? listeners : {})}
    >
      <button
        type="button"
        className={`py-3.25 px-5.5 bg-gradient-to-r from-pink-600 to-red-600 text-white text-base box-border leading-6.75 border-0 rounded-3.5 m-0 w-full block overflow-hidden font-bold min-h-53px text-left select-none dark:bg-gray-900 ${editMode && !isDragging ? "animate-wiggle cursor-move" : ""}`}
        onClick={() => loadEstimationsStopView(favorite)}
      >
        {favorite.stop_name}
      </button>
    </div>
  );
}

function HomeFavoritesSubview(): React.JSX.Element {
  const { getText } = useI18n();
  const { setViewId, setViewIdWithData } = useView();

  const [favorites, setFavorites] = useState<Favorite[]>(() => getFavorites());

  const error = favorites.length === 0;
  const sortIconHidden = favorites.length === 0;

  const [editMode, setEditMode] = useState(false);

  const toggleEditMode = (): void => {
    setEditMode(!editMode);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent): void => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setFavorites((items) => {
        const oldIndex = items.findIndex((item) => item.stop_id === active.id);
        const newIndex = items.findIndex((item) => item.stop_id === over.id);

        const newFavorites = arrayMove(items, oldIndex, newIndex);
        saveFavorites(newFavorites);

        sendTelemetryEvent(EVENT_TYPE_FAVORITE_REORDER, {
          from_pos: oldIndex,
          to_pos: newIndex,
        });

        return newFavorites;
      });
    }
  };

  const loadMapSubview = (): void => {
    setViewId(VIEW_ID_MAP);
  };

  const loadEstimationsStopView = (favorite: Favorite): void => {
    if (editMode) {
      return;
    }

    sendTelemetryEvent(EVENT_TYPE_FAVORITE_SELECT, {
      stop_id: favorite.stop_id,
    });

    setViewIdWithData(VIEW_ID_ESTIMATIONS_STOP, {
      stopId: favorite.stop_id,
      stopName: favorite.stop_name,
    });
  };

  const isDesktop = globalThis.innerWidth >= 1000;

  if (isDesktop) {
    return <HomeDesktop />;
  }

  return (
    <Fragment>
      <Nav isHeader titleText={getText("favorites")} />
      <button
        type="button"
        className={`text-blue-600 p-2 animate-fade-in flex items-center justify-center text-base fixed top-4.25 right-[var(--margin-lr)] z-2 ${editMode ? "" : "rounded-full border border-blue-500/15 liquid-glass"}`}
        hidden={sortIconHidden}
        onClick={toggleEditMode}
      >
        {editMode ? (
          getText("done")
        ) : (
          <ArrowUpDown size={20} aria-hidden="true" />
        )}
      </button>
      <div className="relative pt-1 pb-3.5 box-border">
        {!error && <DonationBubble favoritesCount={favorites.length} />}
        {error && (
          <ErrorDisplay
            errorText={getText("use_map_or_search")}
            retryText={getText("see_nearby_stops")}
            retryAction={loadMapSubview}
          />
        )}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={favorites.map((f) => f.stop_id)}
            strategy={verticalListSortingStrategy}
          >
            {favorites.map((favorite) => (
              <SortableFavorite
                key={favorite.stop_id}
                favorite={favorite}
                editMode={editMode}
                loadEstimationsStopView={loadEstimationsStopView}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </Fragment>
  );
}

export default HomeFavoritesSubview;
