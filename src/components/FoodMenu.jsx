import { useEffect, useState } from 'react'
import { apiRequest } from '../api'
import QuantityStepper from './QuantityStepper'

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Starters', value: 'starters' },
  { label: 'Mains', value: 'mains' },
  { label: 'Desserts', value: 'desserts' },
]

function Menu() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [quantities, setQuantities] = useState({})
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    apiRequest('/api/menu')
      .then(({ categories: menuCategories }) => {
        if (active) setCategories(menuCategories)
      })
      .catch((requestError) => {
        if (active) setError(requestError.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const visibleCategories =
    activeFilter === 'all'
      ? categories
      : categories.filter((category) => category.id === activeFilter)

  function updateQuantity(itemId, newQuantity) {
    setQuantities((previousQuantities) => ({
      ...previousQuantities,
      [itemId]: Math.max(0, newQuantity),
    }))
  }

  return (
    <section
      className="food-menu mx-auto w-full px-5 sm:px-8 lg:px-10"
      id="menu"
      aria-labelledby="menu-title"
    >
      <div className="container">
        <header className="menu-heading">
          <p className="menu-eyebrow">Seasonal cuisine</p>

          <h2 id="menu-title">The Menu</h2>

          <p className="menu-intro">
            A modern interpretation of classic flavours,
            inspired by the world around us.
          </p>
        </header>

        <div
          className="menu-filters flex flex-wrap justify-center gap-3"
          role="group"
          aria-label="Filter menu by category"
        >
          {filters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              className={`menu-filter ${
                activeFilter === filter.value ? 'active' : ''
              }`}
              aria-pressed={activeFilter === filter.value}
              onClick={() => setActiveFilter(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {loading && <p role="status">Loading the menu...</p>}
        {error && (
          <p className="menu-error" role="alert">
            We couldn’t load the menu. {error}
          </p>
        )}
        {!loading && !error && categories.length === 0 && (
          <p role="status">The menu is not available yet.</p>
        )}

        {!loading && !error && (
          <div className="menu-grid">
            {visibleCategories.map((category) => {
              const titleId = `${category.id}-title`

              return (
                <section
                  className="menu-category"
                  key={category.id}
                  aria-labelledby={titleId}
                >
                  <h3 id={titleId}>{category.name}</h3>

                  <ul className="menu-list" role="list">
                    {category.items.map((item) => {
                      const quantity = quantities[item.id] ?? 0

                      return (
                        <li className="menu-item" key={item.id}>
                          <div className="menu-item-heading">
                            <h4>{item.name}</h4>

                            <span className="menu-price">
                              AED {item.price}
                            </span>
                          </div>

                          <p>{item.description}</p>

                          <QuantityStepper
                            quantity={quantity}
                            onChange={(newQuantity) =>
                              updateQuantity(item.id, newQuantity)
                            }
                          />
                        </li>
                      )
                    })}
                  </ul>
                </section>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export default Menu
