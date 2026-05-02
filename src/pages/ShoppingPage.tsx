import { useState } from 'react'
import { SHOPPING, TIER_DESCS, type ShopTier } from '../data/shoppingEatout'

const TIERS: ShopTier[] = ['budget', 'standard', 'premium']

export function ShoppingPage() {
  const [tier, setTier] = useState<ShopTier>('standard')

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
