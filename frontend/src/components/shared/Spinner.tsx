import styles from '../../css/spinner.module.css';

export const Spinner = () => (
  <div className={styles.spinnerWrapper}>
    <div className={styles.steam}>
      <span></span>
      <span></span>
      <span></span>
    </div>
    <svg viewBox="0 0 64 64" className={styles.cup}>
      <defs>
        <clipPath id="cupClip">
          <path d="M14 28h32v14a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12V28z" />
        </clipPath>
      </defs>

      {/* Koppens outline */}
      <path
        d="M14 28h32v14a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12V28z"
        className={styles.cupBody}
      />

      {/* Tevätska, klippt till koppens form, animerad nivå */}
      <g clipPath="url(#cupClip)">
        <rect x="14" y="20" width="32" height="34" className={styles.tea} />
        <ellipse cx="30" cy="0" rx="16" ry="2" className={styles.teaSurface} />
      </g>

      <path
        d="M46 32h4a6 6 0 0 1 0 12h-4"
        className={styles.handle}
      />
      <line x1="10" y1="54" x2="54" y2="54" className={styles.saucer} />
    </svg>
  </div>
);