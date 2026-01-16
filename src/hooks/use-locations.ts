import { locations, getLocation, type Location } from "@shared/data";

export function useLocations(): Location[] {
  return locations;
}

export function useLocation(id: number | null): Location | null {
  if (id === null) return null;
  return getLocation(id) ?? null;
}
