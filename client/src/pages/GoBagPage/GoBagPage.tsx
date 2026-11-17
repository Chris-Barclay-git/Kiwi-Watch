import { GO_BAG_ITEMS } from '../../data/goBagItems'
import { useGoBag } from '../../hooks/useGoBag'
import { countPacked, groupItemsByCategory } from '../../lib/goBagLogic'
import styles from './GoBagPage.module.css'

// The items never change, so we group them once here, not on every render.
const GROUPS = groupItemsByCategory(GO_BAG_ITEMS)

interface GoBagListProps {
  packedIds: string[]
  saveFailed: boolean
  onToggleItem: (itemId: string) => void
}

// The progress bar and the tick-off list.
function GoBagList({ packedIds, saveFailed, onToggleItem }: GoBagListProps) {
  const total = GO_BAG_ITEMS.length
  const packedCount = countPacked(GO_BAG_ITEMS, packedIds)

  return (
    <>
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

      {saveFailed && (
        <p className={styles.saveError} role="alert">
          Sorry, that change couldn't be saved. Try again.
        </p>
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
                      onChange={() => onToggleItem(item.id)}
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
    </>
  )
}

// A tick-off list of what to put in an emergency go bag, saved to the user's account.
export function GoBagPage() {
  const { state, saveFailed, toggleItem } = useGoBag()

  return (
    <section className={styles.card} aria-labelledby="go-bag-heading">
      <h2 id="go-bag-heading" className={styles.title}>
        Go bag
      </h2>
      <p className={styles.intro}>
        Tick off what you've packed. Your list is saved to your account.
      </p>

      {state.status === 'loading' && (
        <p className={styles.message}>Loading your go bag…</p>
      )}

      {state.status === 'loggedOut' && (
        <p className={styles.message}>
          Log in to pack your go bag. Your list is saved to your account.
        </p>
      )}

      {state.status === 'error' && (
        <p className={styles.message}>
          Sorry, we couldn't load your go bag. Try refreshing the page.
        </p>
      )}

      {state.status === 'ready' && (
        <GoBagList
          packedIds={state.packedIds}
          saveFailed={saveFailed}
          onToggleItem={toggleItem}
        />
      )}
    </section>
  )
}
