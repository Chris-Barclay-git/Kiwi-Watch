import { GO_BAG_ITEMS } from '../../data/goBagItems'
import { useGoBag } from '../../hooks/useGoBag'
import { countPacked, groupItemsByCategory } from '../../lib/goBagLogic'
import styles from './GoBagPage.module.css'

// The items never change, so we group them once here, not on every render.
const GROUPS = groupItemsByCategory(GO_BAG_ITEMS)

// A tick-off list of what to put in an emergency go bag.
export function GoBagPage() {
  const { packedIds, toggleItem } = useGoBag()

  const total = GO_BAG_ITEMS.length
  const packedCount = countPacked(GO_BAG_ITEMS, packedIds)

  return (
    <section className={styles.card} aria-labelledby="go-bag-heading">
      <h2 id="go-bag-heading" className={styles.title}>
        Go bag
      </h2>
      <p className={styles.intro}>
        Tick off what you've packed. Your list is saved in this browser.
      </p>

      <progress
        className={styles.progress}
        max={total}
        value={packedCount}
        aria-label="Items packed"
      />
      <p className={styles.count}>
        {packedCount} / {total} packed
      </p>

      {packedCount === total && (
        <p className={styles.done}>Your go bag is packed. Nice work!</p>
      )}

      {GROUPS.map((group) => (
        <fieldset key={group.category} className={styles.group}>
          <legend className={styles.groupTitle}>{group.category}</legend>

          <ul className={styles.list}>
            {group.items.map((item) => {
              const isPacked = packedIds.includes(item.id)

              return (
                <li key={item.id}>
                  <label
                    className={
                      isPacked ? `${styles.item} ${styles.packed}` : styles.item
                    }
                  >
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={isPacked}
                      onChange={() => toggleItem(item.id)}
                    />
                    <span>
                      <span className={styles.name}>{item.name}</span>
                      <span className={styles.tip}>{item.tip}</span>
                    </span>
                  </label>
                </li>
              )
            })}
          </ul>
        </fieldset>
      ))}
    </section>
  )
}
