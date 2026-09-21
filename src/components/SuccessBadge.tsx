import Svg, { Circle, Path } from 'react-native-svg';

/** Solid green badge with a soft outer ring and a hand-drawn tick; used for success confirmations. */
export function SuccessBadge({ size = 72 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 72 72">
      <Circle cx="36" cy="36" r="35" fill="#E7F4EC" />
      <Circle cx="36" cy="36" r="26" fill="#2E9E4F" />
      <Path
        d="M25.5 36.5 L32.5 43.5 L47 28.5"
        stroke="#FFFFFF"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}
