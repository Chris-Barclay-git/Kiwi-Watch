import { EMERGENCY_LINK_GROUPS } from '../../data/emergencyLinks'
import styles from './GetReadyPage.module.css'

// Official links for getting ready and staying informed, with the emergency number up top.
export function GetReadyPage() {
  return (
    <section className={styles.card} aria-labelledby="get-ready-heading">
      <h2 id="get-ready-heading" className={styles.title}>
        Get ready
      </h2>

      <p className={styles.emergency}>
        In an emergency, call <a href="tel:111">111</a>.
      </p>

      <p className={styles.intro}>
        Kiwi Watch is a hobby project. These are the official places to get
        ready and stay informed.
      </p>

      {EMERGENCY_LINK_GROUPS.map((group) => (
        <section key={group.heading} className={styles.group}>
          <h3 className={styles.groupTitle}>{group.heading}</h3>

          <ul className={styles.list}>
            {group.links.map((link) => (
              <li key={link.url}>
                <a
                  className={styles.link}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className={styles.name}>
                    {link.title}
                    <span className={styles.hidden}> (opens in a new tab)</span>
                  </span>
                  <span className={styles.description}>{link.description}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </section>
  )
}
