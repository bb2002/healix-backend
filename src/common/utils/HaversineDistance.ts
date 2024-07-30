import ILatLon from '../types/ILatLon';

export default function haversineDistance(
  pos1: ILatLon,
  pos2: ILatLon,
): number {
  const toRadians = (degree: number) => (degree * Math.PI) / 180;

  const R = 6371000;
  const dLat = toRadians(pos2.latitude - pos1.latitude);
  const dLon = toRadians(pos2.longitude - pos1.longitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(pos1.latitude)) *
      Math.cos(toRadians(pos2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
