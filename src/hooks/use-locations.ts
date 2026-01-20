import { 
  locations, 
  getLocation, 
  spaceOperations,
  getSpaceOperation,
  type Location, 
  type SpaceOperation 
} from "@shared/data";

export function useLocations(): Location[] {
  return locations;
}

export function useLocation(id: number | null): Location | null {
  if (id === null) return null;
  return getLocation(id) ?? null;
}

export function useSpaceOperations(): SpaceOperation[] {
  return spaceOperations;
}

export function useSpaceOperation(id: number | null): SpaceOperation | null {
  if (id === null) return null;
  return getSpaceOperation(id) ?? null;
}
