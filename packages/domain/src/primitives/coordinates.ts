export type Coordinates = { latitude: number; longitude: number };

export function assertCoordinates(value: Coordinates): Coordinates {
  if (
    value.latitude < -90 ||
    value.latitude > 90 ||
    value.longitude < -180 ||
    value.longitude > 180
  ) {
    throw new Error('coordinates are outside valid bounds');
  }
  return value;
}
