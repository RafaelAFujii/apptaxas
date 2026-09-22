export type AvailabilityStatus = 'online' | 'offline';
export type LocationPermission = 'granted' | 'denied' | 'unknown';

export type FreelancerAvailability = {
  freelancerId: string;
  status: AvailabilityStatus;
  locationPermission: LocationPermission;
  lastLocation?: { latitude: number; longitude: number; accuracyMeters: number; recordedAt: Date };
};

export function setAvailability(
  current: FreelancerAvailability,
  status: AvailabilityStatus,
): FreelancerAvailability {
  if (status === 'online' && (current.locationPermission !== 'granted' || !current.lastLocation)) {
    throw new Error('location permission and current location are required to go online');
  }
  return { ...current, status };
}

export function updateLocation(
  current: FreelancerAvailability,
  location: NonNullable<FreelancerAvailability['lastLocation']>,
): FreelancerAvailability {
  return { ...current, lastLocation: location };
}
