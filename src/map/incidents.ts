import type { MaterialCommunityIcons } from '@expo/vector-icons';
import { DEFAULT_COORDS, colors } from '../theme';
import { distanceKm } from './geo';

export type IncidentType = 'Vehicle Collision' | 'Vehicle and Pedestrian Collision' | 'Hit-and-Run';
export type Severity = 'high' | 'medium' | 'low';
type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

export type Incident = {
  id: string;
  type: IncidentType;
  severity: Severity;
  /** Street or road the incident is on. */
  street: string;
  /** Landmark or area, shown next to the street. */
  area: string;
  latitude: number;
  longitude: number;
  description: string;
  reportedAt: Date;
};

const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60_000);

// Placeholder incidents on real roads around the map centre; replace with live data once the API exists.
export const INCIDENTS: Incident[] = [
  {
    id: 'inc-1',
    type: 'Vehicle and Pedestrian Collision',
    severity: 'high',
    street: 'Sekwati Street',
    area: 'Near Dr George Mukhari Hospital',
    latitude: DEFAULT_COORDS.latitude + 0.0022,
    longitude: DEFAULT_COORDS.longitude - 0.0055,
    description: 'Pedestrian struck by a vehicle. Paramedics requested.',
    reportedAt: minutesAgo(4),
  },
  {
    id: 'inc-2',
    type: 'Vehicle Collision',
    severity: 'high',
    street: 'Molotlegi Road',
    area: 'Near the railway crossing',
    latitude: DEFAULT_COORDS.latitude - 0.0034,
    longitude: DEFAULT_COORDS.longitude - 0.0068,
    description: 'Two vehicles involved. One lane blocked.',
    reportedAt: minutesAgo(11),
  },
  {
    id: 'inc-3',
    type: 'Hit-and-Run',
    severity: 'medium',
    street: 'R566',
    area: 'Towards Wildebeesthoek',
    latitude: -25.62509,
    longitude: 28.02204,
    description: 'Vehicle left the scene after a collision. No serious injuries reported.',
    reportedAt: minutesAgo(23),
  },
];

const SEVERITY_COLOR: Record<Severity, string> = {
  high: colors.emergency,
  medium: colors.watchAndAct,
  low: colors.advice,
};

const SEVERITY_LABEL: Record<Severity, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

const SEVERITY_RANK: Record<Severity, number> = { high: 0, medium: 1, low: 2 };

const TYPE_ICON: Record<IncidentType, IconName> = {
  'Vehicle Collision': 'car-emergency',
  'Vehicle and Pedestrian Collision': 'walk',
  'Hit-and-Run': 'car-brake-alert',
};

const MARKER_SIZE: Record<Severity, number> = { high: 34, medium: 30, low: 26 };

export const severityColor = (severity: Severity) => SEVERITY_COLOR[severity];
export const severityLabel = (severity: Severity) => SEVERITY_LABEL[severity];
export const incidentIcon = (incident: Incident) => TYPE_ICON[incident.type];
export const markerSize = (incident: Incident) => MARKER_SIZE[incident.severity];

/** Most severe first, then most recent first. */
export function sortIncidents(incidents: Incident[]) {
  return [...incidents].sort(
    (a, b) =>
      SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity] || b.reportedAt.getTime() - a.reportedAt.getTime(),
  );
}

/** Distance from the user's current location, e.g. "0.6 km away". */
export function distanceAway(incident: Incident) {
  const km = distanceKm(DEFAULT_COORDS.latitude, DEFAULT_COORDS.longitude, incident.latitude, incident.longitude);
  return km < 1 ? `${Math.round(km * 10) * 100} m away` : `${km.toFixed(1)} km away`;
}

/** Relative time such as "just now", "4 min ago" or "2 h ago". */
export function timeAgo(date: Date, now: number = Date.now()) {
  const minutes = Math.max(0, Math.floor((now - date.getTime()) / 60_000));
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  return hours < 24 ? `${hours} h ago` : `${Math.floor(hours / 24)} d ago`;
}

export type RoadWarning = {
  street: string;
  severity: Severity;
  incidents: Incident[];
};

/** One warning per street, taking the highest severity of the incidents currently on it. */
export function roadWarnings(incidents: Incident[]): RoadWarning[] {
  const byStreet = new Map<string, Incident[]>();
  for (const incident of sortIncidents(incidents)) {
    byStreet.set(incident.street, [...(byStreet.get(incident.street) ?? []), incident]);
  }
  return [...byStreet.entries()].map(([street, list]) => ({ street, severity: list[0].severity, incidents: list }));
}

/** What drivers should do, based on the kind of incident on the road. */
export function warningAdvice(incident: Incident) {
  switch (incident.type) {
    case 'Vehicle and Pedestrian Collision':
      return 'Slow down, watch for people on the road and give emergency crews room. Expect a closure.';
    case 'Vehicle Collision':
      return 'Expect delays and lane closures. Use another route if you can.';
    case 'Hit-and-Run':
      return 'Emergency services may be on scene. Avoid the area and do not stop to follow other vehicles.';
  }
}
