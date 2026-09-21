import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { type Incident, incidentIcon, markerSize, severityColor } from '../map/incidents';

type Point = {
  /** Screen position of the marker's centre, relative to the map container. */
  x: number;
  y: number;
};

export function IncidentMarker({ incident, x, y }: Point & { incident: Incident }) {
  const size = markerSize(incident);
  return (
    <View
      style={[
        styles.marker,
        {
          left: x - size / 2,
          top: y - size / 2,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: severityColor(incident.severity),
        },
      ]}
    >
      <MaterialCommunityIcons name={incidentIcon(incident)} size={size * 0.62} color="#FFFFFF" />
    </View>
  );
}

export function UserLocationDot({ x, y }: Point) {
  return (
    <>
      <View style={[styles.userHalo, { left: x - 24, top: y - 24 }]} />
      <View style={[styles.userDot, { left: x - 8, top: y - 8 }]} />
    </>
  );
}

const styles = StyleSheet.create({
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
});
