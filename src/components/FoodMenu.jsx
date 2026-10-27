
import menuData from '../data/foodmenu.json'

function Menu() {
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

        <div className="menu-grid">
          {menuData.categories.map((category) => (
            <section
              className="menu-category"
              key={category.id}
              aria-labelledby={category.titleId}
            >
              <h3 id={category.titleId}>{category.name}</h3>

              <ul className="menu-list" role="list">
                {category.items.map((item) => (
                  <li className="menu-item" key={item.id}>
                    <div className="menu-item-heading">
                      <h4>{item.name}</h4>

                      <span className="menu-price">
                        AED {item.price}
                      </span>
                    </div>

                    <p>{item.description}</p>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Menu
