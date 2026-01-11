import { Fragment, useState } from "react";
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

import { useView } from "../../../contexts/ViewContext.jsx";
import { getFavorites, saveFavorites } from "../../../utils/FavoriteUtils.jsx";
import {
  VIEW_ID_ESTIMATIONS_STOP,
  VIEW_ID_MAP,
} from "../../../constants/ViewConstants.jsx";
import { sendTelemetryEvent } from "../../../utils/TelemetryUtils.jsx";

import Nav from "../../../components/Nav.jsx";
import Error from "../../../components/Error.jsx";
import HomeDesktop from "../../../components/home/HomeDesktop.jsx";
import { useI18n } from "../../../contexts/I18nContext.jsx";
import styles from "./HomeFavoritesSubview.module.css";
import DonationBubble from "../../../components/home/DonationBubble.jsx";

const SortableFavorite = ({ favorite, editMode, loadEstimationsStopView }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: favorite.stop_id });

  const transformString = CSS.Transform.toString(transform);
  const style = {
    transform: transformString
      ? `${transformString} ${isDragging ? "scale(1.05)" : ""}`
      : undefined,
    transition,
    zIndex: isDragging ? 1 : "auto",
    position: "relative", // Ensure z-index works
    touchAction: "none", // Prevent scrolling while dragging
    // Visual lift effect on the wrapper so the whole thing pops
    boxShadow: isDragging ? "0px 10px 20px rgba(0,0,0,0.3)" : "none",
    opacity: isDragging ? 0.9 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={styles.SortableWrapper}
      {...attributes}
      {...(editMode ? listeners : {})}
    >
      <button
        type="button"
        className={`${styles.Favorite} ${editMode && !isDragging ? styles.Wiggle : ""}`}
        onClick={() => loadEstimationsStopView(favorite)}
      >
        {favorite.stop_name}
      </button>
    </div>
  );
};

const HomeFavoritesSubview = () => {
  const { getText } = useI18n();
  const { setViewId, setViewIdWithData } = useView();

  // Initialize state directly to avoid useEffect setState warning
  const [favorites, setFavorites] = useState(() => getFavorites());
  
  // Derived state
  const error = favorites.length === 0;
  const sortIconHidden = favorites.length === 0;
  
  // Edit mode
  const [editMode, setEditMode] = useState(false);

  const toggleEditMode = () => {
    setEditMode(editMode ? false : true);
  };

  // Drag & Drop Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require movement of 8px to start drag (prevents accidental clicks)
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setFavorites((items) => {
        const oldIndex = items.findIndex((item) => item.stop_id === active.id);
        const newIndex = items.findIndex((item) => item.stop_id === over.id);

        const newFavorites = arrayMove(items, oldIndex, newIndex);
        saveFavorites(newFavorites);

        // Track favorite reorder
        sendTelemetryEvent("favorite_reorder", {
          from_pos: oldIndex,
          to_pos: newIndex,
        });

        return newFavorites;
      });
    }
  };

  // View handlers
  const loadMapSubview = () => {
    setViewId(VIEW_ID_MAP);
  };

  const loadEstimationsStopView = (favorite) => {
    if (editMode) {
      return;
    }

    // Track favorite selection
    sendTelemetryEvent("favorite_select", {
      stop_id: favorite.stop_id,
    });

    setViewIdWithData(VIEW_ID_ESTIMATIONS_STOP, {
      stopId: favorite.stop_id,
      stopName: favorite.stop_name,
    });
  };

  // Content
  const isDesktop = globalThis.innerWidth >= 1000;
  const fontFamily = editMode ? "revert" : "icons";
  const fontSize = editMode ? "inherit" : "24px";

  if (isDesktop) {
    return <HomeDesktop />;
  }

  return (
    <Fragment>
      <Nav isHeader titleText={getText("favorites")}>
        <button
          type="button"
          className={styles.SortIconAndDoneLink}
          style={{ fontFamily, fontSize }}
          hidden={sortIconHidden}
          onClick={toggleEditMode}
        >
          {editMode ? getText("done") : ""}
        </button>
      </Nav>
      <div className={styles.Content}>
        {!error && <DonationBubble favoritesCount={favorites.length} />}
        {error && (
          <Error
            errorText={getText("use_map_or_search")}
            retryText={getText("see_nearby_stops")}
            retryAction={loadMapSubview}
            animation="none"
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
};

export default HomeFavoritesSubview;
