import { BADGE_COLORS } from '../utils/constants';

export default function Badge({ value }) {
  if (!value) return <span>-</span>;
  const colors = BADGE_COLORS[value] || { bg: '#eceff1', color: '#455a64' };
  return (
    <span
      className="badge"
      style={{ background: colors.bg, color: colors.color }}
    >
      {value}
    </span>
  );
}
