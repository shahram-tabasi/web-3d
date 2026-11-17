import styles from './HeroAtmosphere.module.css';

// Positions match the artwork's 1536 × 1024 coordinate system, not the viewport.
const stars = [[390, 52], [475, 112], [545, 44], [630, 134], [697, 70], [761, 104], [872, 43], [948, 116], [1015, 61], [1124, 42], [1183, 102], [880, 177], [565, 153], [1054, 162]];
const motes = [[393, 147], [452, 194], [504, 231], [552, 251], [604, 265], [652, 252], [686, 293], [724, 339], [761, 371], [799, 312], [822, 295], [805, 410], [850, 403], [900, 359], [953, 304], [1001, 285], [1053, 251], [1104, 216], [1156, 173], [1182, 131], [722, 449], [664, 496], [625, 534], [620, 575], [654, 613], [702, 651], [748, 693], [785, 742]];

export function HeroAtmosphere({ active }: { active: boolean }) {
  return <svg className={styles.atmosphere} viewBox="0 0 1536 1024" preserveAspectRatio="xMidYMid slice" aria-hidden="true" data-active={active}>
    <defs>
      <radialGradient id="simorgh-command-glow">
        <stop offset="0" stopColor="#a3d7ff" stopOpacity=".7" />
        <stop offset="1" stopColor="#68b4ee" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="simorgh-meteor-trail" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0" stopColor="#e0edff" stopOpacity=".85" />
        <stop offset="1" stopColor="#6ea6d1" stopOpacity="0" />
      </linearGradient>
    </defs>
    <circle cx="805" cy="378" r="32" fill="url(#simorgh-command-glow)" className={styles.commandOrigin} />
    {['M805 378 Q570 200 80 220', 'M805 378 Q1100 190 1470 275'].map(path => <path key={path} d={path}
      fill="none" stroke="#9fcbed" strokeWidth="1.3" pathLength="1000" strokeDasharray="24 1000" className={styles.commandPulse} />)}
    <circle cx="80" cy="220" r="62" fill="url(#simorgh-command-glow)" className={styles.receiver} />
    <circle cx="1470" cy="275" r="62" fill="url(#simorgh-command-glow)" className={styles.receiver} />
    {stars.map(([cx, cy], index) => <circle key={`star-${index}`} cx={cx} cy={cy} r={index % 4 === 0 ? 1.15 : 0.7} fill="#bfd7f5"
      className={`${styles.spark} ${index > 8 ? styles.detail : ''}`}
      style={{ animationDelay: `${-index * 0.73}s`, animationDuration: `${5 + index % 5}s` }} />)}
    {motes.map(([cx, cy], index) => <circle key={`bird-${index}`} cx={cx} cy={cy} r={index % 3 === 0 ? 1.15 : 0.7}
      fill={index % 5 === 0 ? '#efd7af' : '#c0e8ff'} className={`${styles.spark} ${index % 2 ? styles.detail : ''}`}
      style={{ animationDelay: `${-index * 0.43}s`, animationDuration: `${4 + index % 6}s` }} />)}
    {[[1080, 65], [655, 110], [1010, 160]].map(([x, y], index) => <g key={index}
      className={`${styles.meteor} ${index === 1 ? styles.meteorSecond : index === 2 ? styles.meteorThird : ''}`}>
      <line x1={x} y1={y} x2={x + 90} y2={y - 52} stroke="url(#simorgh-meteor-trail)" strokeWidth="1" />
      <circle cx={x} cy={y} r="1.1" fill="#d9eaff" />
    </g>)}
  </svg>;
}
