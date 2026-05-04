import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SHOPPING, TIER_DESCS, type ShopTier } from '../data/shoppingEatout'
import { useSwapsStore } from '../store/swapsStore'

const TIERS: ShopTier[] = ['budget', 'standard', 'premium']

export function ShoppingPage() {
  const [tier, setTier] = useState<ShopTier>('standard')
  const extras = useSwapsStore((s) => s.shoppingExtras)
  const removeFromShopping = useSwapsStore((s) => s.removeFromShopping)
  const clearShoppingExtras = useSwapsStore((s) => s.clearShoppingExtras)

  return (
    <section className="view active">
      <div className="topbar">
        <div className="topbar-left">
          <div className="eyebrow">Basket</div>
          <h1>Shopping list</h1>
          <div className="topbar-sub">{TIER_DESCS[tier]}</div>
        </div>
      </div>

      <div className="sub-tabs">
        {TIERS.map((t) => (
          <button key={t} type="button" className={tier === t ? 'sub-tab active' : 'sub-tab'} onClick={() => setTier(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {extras.length > 0 && (
        <div className="card shop-extras-card">
          <div className="shop-extras-head">
            <div>
              <h3 className="shop-extras-title">From swaps</h3>
              <p className="shop-extras-sub">
                Items you sent here from <Link to="/swaps">Food swaps</Link>. They live alongside the tier list below.
              </p>
            </div>
            <button type="button" className="shop-extras-clear" onClick={clearShoppingExtras}>
              Clear
            </button>
          </div>
          <ul className="shop-extras-list">
            {extras.map((item) => (
              <li key={item}>
                <span className="shop-extras-item">{item}</span>
                <button
                  type="button"
                  className="shop-extras-remove"
                  aria-label={`Remove ${item} from shopping list`}
                  onClick={() => removeFromShopping(item)}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="shop-grid">
        {Object.entries(SHOPPING).map(([cat, byTier]) => (
          <div key={cat} className="card shop-cat-card">
            <h3>{cat}</h3>
            <ul className="shop-item-list">
              {byTier[tier].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
