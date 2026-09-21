import { useState } from 'react';
import { Image, LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import { INCIDENTS } from '../map/incidents';
import { TILE_SIZE, tileUrl, toWorld } from '../map/geo';
import { DEFAULT_COORDS } from '../theme';
import { IncidentMarker, UserLocationDot } from './MapMarkers';

const ZOOM = 15;
const WORLD_SIZE = TILE_SIZE * 2 ** ZOOM;

function project(latitude: number, longitude: number) {
  const w = toWorld(latitude, longitude);
  return { x: w.x * WORLD_SIZE, y: w.y * WORLD_SIZE };
}

/** Static (non-interactive) map preview for the home screen. */
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
          source={{ uri: tileUrl(ZOOM, t.x, t.y) }}
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
          <UserLocationDot x={size.width / 2} y={size.height / 2} />
          {INCIDENTS.map((incident) => {
            const p = project(incident.latitude, incident.longitude);
            return <IncidentMarker key={incident.id} incident={incident} x={p.x - originX} y={p.y - originY} />;
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
