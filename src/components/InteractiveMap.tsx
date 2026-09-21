import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  GestureResponderEvent,
  Image,
  LayoutChangeEvent,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MAX_TILE_ZOOM, TILE_SIZE, tileUrl, toWorld } from '../map/geo';
import { INCIDENTS } from '../map/incidents';
import { DEFAULT_COORDS, colors } from '../theme';
import { IncidentMarker, UserLocationDot } from './MapMarkers';

const MIN_ZOOM = 4;
const MAX_ZOOM = MAX_TILE_ZOOM;
const START_ZOOM = 15;

/** Map position: centre in normalised world coordinates (0..1) plus a (fractional) zoom level. */
type Viewport = { cx: number; cy: number; zoom: number };

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function startViewport(): Viewport {
  const c = toWorld(DEFAULT_COORDS.latitude, DEFAULT_COORDS.longitude);
  return { cx: c.x, cy: c.y, zoom: START_ZOOM };
}

/** Distance between the first two touches, or 0 when fewer than two fingers are down. */
function touchDistance(e: GestureResponderEvent) {
  const touches = e.nativeEvent.touches;
  if (touches.length < 2) return 0;
  return Math.hypot(touches[0].pageX - touches[1].pageX, touches[0].pageY - touches[1].pageY);
}

/**
 * Drag to pan, pinch / mouse wheel / +/- buttons to zoom. Draws OpenStreetMap tiles itself,
 * so it needs no native map library or API key and works on Android, iOS and web.
 */
export function InteractiveMap() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [viewport, setViewport] = useState<Viewport>(startViewport);

  // Gesture handlers are created once, so they read the latest state through refs.
  const viewportRef = useRef(viewport);
  const sizeRef = useRef(size);
  sizeRef.current = size;
  const containerRef = useRef<View>(null);

  const update = (change: (v: Viewport) => Viewport) => {
    viewportRef.current = change(viewportRef.current);
    setViewport(viewportRef.current);
  };

  const panBy = (dx: number, dy: number) =>
    update((v) => {
      const worldSize = TILE_SIZE * 2 ** v.zoom;
      return { ...v, cx: clamp(v.cx - dx / worldSize, 0, 1), cy: clamp(v.cy - dy / worldSize, 0, 1) };
    });

  /** Zoom by `delta` levels, keeping the map point under (focalX, focalY) fixed; defaults to the centre. */
  const zoomBy = (delta: number, focalX?: number, focalY?: number) =>
    update((v) => {
      const { width, height } = sizeRef.current;
      const zoom = clamp(v.zoom + delta, MIN_ZOOM, MAX_ZOOM);
      const offsetX = (focalX ?? width / 2) - width / 2;
      const offsetY = (focalY ?? height / 2) - height / 2;
      const before = TILE_SIZE * 2 ** v.zoom;
      const after = TILE_SIZE * 2 ** zoom;
      return {
        zoom,
        cx: clamp(v.cx + offsetX / before - offsetX / after, 0, 1),
        cy: clamp(v.cy + offsetY / before - offsetY / after, 0, 1),
      };
    });

  const recenter = () => update(() => startViewport());

  const last = useRef({ dx: 0, dy: 0, distance: 0 });
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: (e) => {
          last.current = { dx: 0, dy: 0, distance: touchDistance(e) };
        },
        onPanResponderMove: (e, gesture) => {
          panBy(gesture.dx - last.current.dx, gesture.dy - last.current.dy);
          last.current.dx = gesture.dx;
          last.current.dy = gesture.dy;

          // Pinch: only compare against the previous move while two fingers stay down.
          const distance = touchDistance(e);
          if (distance > 0 && last.current.distance > 0) {
            zoomBy(Math.log2(distance / last.current.distance));
          }
          last.current.distance = distance;
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // Mouse wheel zoom (web only), centred on the cursor.
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const node = containerRef.current as unknown as HTMLElement | null;
    if (!node) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = node.getBoundingClientRect();
      zoomBy(-e.deltaY / 300, e.clientX - rect.left, e.clientY - rect.top);
    };
    node.addEventListener('wheel', onWheel, { passive: false });
    return () => node.removeEventListener('wheel', onWheel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize({ width, height });
  };

  const worldSize = TILE_SIZE * 2 ** viewport.zoom;
  const originX = viewport.cx * worldSize - size.width / 2;
  const originY = viewport.cy * worldSize - size.height / 2;
  const tileLevel = clamp(Math.round(viewport.zoom), 0, MAX_TILE_ZOOM);

  /** Tiles covering the screen at an integer zoom level, scaled to the current fractional zoom. */
  const renderTiles = (level: number) => {
    const count = 2 ** level;
    const tile = worldSize / count;
    const firstX = Math.floor(originX / tile);
    const lastX = Math.floor((originX + size.width) / tile);
    const firstY = Math.max(0, Math.floor(originY / tile));
    const lastY = Math.min(count - 1, Math.floor((originY + size.height) / tile));

    const images = [];
    for (let x = firstX; x <= lastX; x++) {
      const wrappedX = ((x % count) + count) % count;
      for (let y = firstY; y <= lastY; y++) {
        const left = Math.floor(x * tile - originX);
        const top = Math.floor(y * tile - originY);
        images.push(
          <Image
            key={`${level}/${x}/${y}`}
            source={{ uri: tileUrl(level, wrappedX, y) }}
            style={{
              position: 'absolute',
              left,
              top,
              // +1 px overlap hides hairline seams between tiles at fractional zoom.
              width: Math.floor((x + 1) * tile - originX) - left + 1,
              height: Math.floor((y + 1) * tile - originY) - top + 1,
            }}
          />,
        );
      }
    }
    return images;
  };

  const toScreen = (latitude: number, longitude: number) => {
    const w = toWorld(latitude, longitude);
    return { x: w.x * worldSize - originX, y: w.y * worldSize - originY };
  };
  const me = toScreen(DEFAULT_COORDS.latitude, DEFAULT_COORDS.longitude);

  return (
    <View ref={containerRef} style={styles.container} onLayout={onLayout}>
      <View style={styles.gestureLayer} {...panResponder.panHandlers}>
        {size.width > 0 && (
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {/* Coarser tiles underneath show instantly while sharper ones load. */}
            {tileLevel > 0 && renderTiles(tileLevel - 1)}
            {renderTiles(tileLevel)}
            <UserLocationDot x={me.x} y={me.y} />
            {INCIDENTS.map((incident) => {
              const p = toScreen(incident.latitude, incident.longitude);
              return <IncidentMarker key={incident.id} incident={incident} x={p.x} y={p.y} />;
            })}
          </View>
        )}
      </View>

      <View style={styles.controls}>
        <MapButton icon="add" label="Zoom in" onPress={() => zoomBy(1)} />
        <MapButton icon="remove" label="Zoom out" onPress={() => zoomBy(-1)} />
        <MapButton icon="locate" label="Back to my location" onPress={recenter} />
      </View>

      <View style={styles.attribution} pointerEvents="none">
        <Text style={styles.attributionText}>© OpenStreetMap contributors</Text>
      </View>
    </View>
  );
}

function MapButton({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
    >
      <Ionicons name={icon} size={22} color={colors.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8E6DF',
    overflow: 'hidden',
  },
  gestureLayer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    // Stops the browser from scrolling the page or zooming it while dragging the map (web only).
    ...(Platform.OS === 'web' ? ({ touchAction: 'none', cursor: 'grab' } as object) : null),
  },
  controls: {
    position: 'absolute',
    right: 12,
    bottom: 28,
    gap: 8,
  },
  button: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  buttonPressed: { opacity: 0.8 },
  attribution: {
    position: 'absolute',
    left: 0,
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
