import type { Favorite } from "../interfaces/favorite";

export function getFavorites(): Favorite[] {
  let list: Favorite[] = [];

  const favoritesItemStorage = localStorage.getItem("favorites");

  if (favoritesItemStorage === null) {
    return list;
  }

  try {
    list = JSON.parse(favoritesItemStorage) as Favorite[];
    fixStopNameTypos(list);

    localStorage.setItem("favorites", JSON.stringify(list));
  } catch (error) {
    console.error("Error parsing favorites data.", error);
  }

  return list;
}

export function getFavorite(stopId: number): Favorite | null {
  let result: Favorite | null = null;
  const favorites = getFavorites();

  for (const favorite of favorites) {
    if (favorite.stop_id !== stopId) {
      continue;
    }

    result = favorite;
    break;
  }

  return result;
}

export function toggleFavorite(stopId: number, stopName: string): boolean {
  const favorites = getFavorites();

  let result = false;
  const existingFavorite = getFavorite(stopId);

  if (existingFavorite === null) {
    const favorite: Favorite = { stop_id: stopId, stop_name: stopName };
    favorites.push(favorite);
    result = true;
  } else {
    const index = favorites.findIndex((f) => f.stop_id === stopId);

    if (index > -1) {
      favorites.splice(index, 1);
    }
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));

  return result;
}

export function saveFavorites(favorites: Favorite[]): void {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

export function fixStopNameTypos(favorites: Favorite[]): void {
  favorites.forEach((favorite) => {
    favorite.stop_name = favorite.stop_name.replaceAll("Jesus", "Jesús");
    favorite.stop_name = favorite.stop_name.replaceAll("Pctcan", "PCTCAN");
  });
}
