import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import { DEFAULT_COORDS, colors } from '../theme';

const TILE_SIZE = 256;
const ZOOM = 15;

type Incident = {
  id: string;
  latitude: number;
  longitude: number;
  color: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  size: number;
};

// Placeholder incidents near the map centre; replace with live incident data once the API exists.
const INCIDENTS: Incident[] = [
  {
    id: 'fire',
    latitude: DEFAULT_COORDS.latitude + 0.0022,
    longitude: DEFAULT_COORDS.longitude - 0.0055,
    color: colors.emergency,
    icon: 'fire',
    size: 34,
  },
  {
    id: 'accident',
    latitude: DEFAULT_COORDS.latitude + 0.0032,
    longitude: DEFAULT_COORDS.longitude + 0.0048,
    color: colors.watchAndAct,
    icon: 'alert',
    size: 28,
  },
  {
    id: 'advice',
    latitude: DEFAULT_COORDS.latitude - 0.0034,
    longitude: DEFAULT_COORDS.longitude - 0.0068,
    color: colors.advice,
    icon: 'exclamation-thick',
    size: 26,
  },
];

/** Web-mercator projection: lat/lon to pixel position on the whole-world map at this zoom. */
function project(latitude: number, longitude: number) {
  const worldSize = TILE_SIZE * 2 ** ZOOM;
  const sin = Math.sin((latitude * Math.PI) / 180);
  return {
    x: ((longitude + 180) / 360) * worldSize,
    y: (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * worldSize,
  };
}

// Public OpenStreetMap tiles: fine for a prototype, but their usage policy forbids heavy production
// traffic. Swap this URL for a hosted tile provider (MapTiler, Mapbox, Stadia...) before release.
function tileUrl(x: number, y: number) {
  return `https://tile.openstreetmap.org/${ZOOM}/${x}/${y}.png`;
}

/** Real street map (OpenStreetMap data) with incident pins and the user's position. */
export function IncidentsMapPreview() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize({ width, height });
  };

  const center = project(DEFAULT_COORDS.latitude, DEFAULT_COORDS.longitude);
  // World-pixel position of the container's top-left corner.
  const originX = center.x - size.width / 2;
  const originY = center.y - size.height / 2;

  const tiles: { key: string; x: number; y: number }[] = [];
  if (size.width > 0) {
    const firstX = Math.floor(originX / TILE_SIZE);
    const lastX = Math.floor((originX + size.width) / TILE_SIZE);
    const firstY = Math.floor(originY / TILE_SIZE);
    const lastY = Math.floor((originY + size.height) / TILE_SIZE);
    for (let x = firstX; x <= lastX; x++) {
      for (let y = firstY; y <= lastY; y++) {
        tiles.push({ key: `${x}/${y}`, x, y });
      }
    }
  }

  return (
    <View style={styles.container} onLayout={onLayout}>
      {tiles.map((t) => (
        <Image
          key={t.key}
          source={{ uri: tileUrl(t.x, t.y) }}
          style={[
            styles.tile,
            {
              left: Math.round(t.x * TILE_SIZE - originX),
              top: Math.round(t.y * TILE_SIZE - originY),
            },
          ]}
        />
      ))}

      {size.width > 0 && (
        <>
          {/* user position */}
          <View style={[styles.userHalo, { left: size.width / 2 - 24, top: size.height / 2 - 24 }]} />
          <View style={[styles.userDot, { left: size.width / 2 - 8, top: size.height / 2 - 8 }]} />

          {INCIDENTS.map((incident) => {
            const p = project(incident.latitude, incident.longitude);
            return (
              <View
                key={incident.id}
                style={[
                  styles.marker,
                  {
                    left: p.x - originX - incident.size / 2,
                    top: p.y - originY - incident.size / 2,
                    width: incident.size,
                    height: incident.size,
                    borderRadius: incident.size / 2,
                    backgroundColor: incident.color,
                  },
                ]}
              >
                <MaterialCommunityIcons name={incident.icon} size={incident.size * 0.62} color="#FFFFFF" />
              </View>
            );
          })}
        </>
      )}

      <View style={styles.attribution} pointerEvents="none">
        <Text style={styles.attributionText}>© OpenStreetMap contributors</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 200,
    backgroundColor: '#E8E6DF',
    overflow: 'hidden',
  },
  tile: {
    position: 'absolute',
    width: TILE_SIZE,
    height: TILE_SIZE,
  },
  marker: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 3,
  },
  userHalo: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(47,125,225,0.18)',
  },
  userDot: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#2F7DE1',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 3,
  },
  attribution: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.75)',
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  attributionText: {
    fontSize: 8,
    color: '#444444',
  },
});
