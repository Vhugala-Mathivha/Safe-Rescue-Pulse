import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { colors } from '../theme';

type Marker = {
  left: `${number}%`;
  top: `${number}%`;
  color: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  size: number;
};

// Placeholder markers; replace with live incident data once the API exists.
const MARKERS: Marker[] = [
  { left: '20%', top: '38%', color: colors.emergency, icon: 'fire', size: 34 },
  { left: '74%', top: '30%', color: colors.watchAndAct, icon: 'alert', size: 28 },
  { left: '17%', top: '74%', color: colors.advice, icon: 'exclamation-thick', size: 26 },
];

/** Stylised street map with incident pins and the user's position. */
export function IncidentsMapPreview() {
  return (
    <View style={styles.container}>
      <Svg width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
        <Rect width="400" height="300" fill="#EFEDE6" />
        {/* parks + water */}
        <Rect x="230" y="150" width="120" height="70" rx="6" fill="#D6E6C9" />
        <Rect x="-10" y="215" width="110" height="60" rx="6" fill="#D6E6C9" />
        <Path d="M300 -10 L420 -10 L420 70 Q360 60 330 30 Z" fill="#BBD7EE" />
        {/* minor streets */}
        <Path
          d="M0 60 H400 M0 130 H400 M0 200 H400 M0 265 H400 M60 0 V300 M140 0 V300 M230 0 V300 M320 0 V300"
          stroke="#FFFFFF"
          strokeWidth="6"
        />
        {/* main roads */}
        <Path d="M-10 250 L410 90" stroke="#FFFFFF" strokeWidth="12" />
        <Path d="M-10 250 L410 90" stroke="#F6D77A" strokeWidth="7" />
        <Path d="M180 -10 L200 310" stroke="#FFFFFF" strokeWidth="11" />
        <Path d="M180 -10 L200 310" stroke="#F1C0A0" strokeWidth="6" />
        {/* user position */}
        <Circle cx="200" cy="160" r="22" fill="#2F7DE1" opacity={0.18} />
        <Circle cx="200" cy="160" r="9" fill="#FFFFFF" />
        <Circle cx="200" cy="160" r="6" fill="#2F7DE1" />
      </Svg>

      {MARKERS.map((m, i) => (
        <View
          key={i}
          style={[
            styles.marker,
            {
              left: m.left,
              top: m.top,
              width: m.size,
              height: m.size,
              borderRadius: m.size / 2,
              backgroundColor: m.color,
              marginLeft: -m.size / 2,
              marginTop: -m.size / 2,
            },
          ]}
        >
          <MaterialCommunityIcons name={m.icon} size={m.size * 0.62} color="#FFFFFF" />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 200,
    backgroundColor: '#EFEDE6',
    overflow: 'hidden',
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
});
