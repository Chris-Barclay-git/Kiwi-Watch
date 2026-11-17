import styles from './Disclaimer.module.css'

// A short notice at the bottom of the page. This app is a hobby project,
// so it must not look like an official warning system.
export function Disclaimer() {
  return (
    <footer className={styles.disclaimer}>
      <p className={styles.text}>
        Kiwi Watch is a hobby project, not an official warning source. In an
        emergency, follow{' '}
        <a href="https://www.civildefence.govt.nz" className={styles.link}>
          Civil Defence
        </a>{' '}
        advice and call 111.
      </p>
      <p className={styles.text}>
        Quake data comes from{' '}
        <a href="https://www.geonet.org.nz" className={styles.link}>
          GeoNet
        </a>
        .
      </p>
    </footer>
  )
}
