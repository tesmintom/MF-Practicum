
import menuData from '../data/foodmenu.json'

function Menu() {
  return (
    <section id="menu" className="menu-section">
      <div className="container menu-inner mx-auto w-full max-w-[1200px] px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="menu-header">
          <p className="section-eyebrow">Discover Our Menu</p>
          <h2 className="section-title">A Taste of Excellence</h2>
          <p className="section-description">
            Thoughtfully sourced ingredients, seasonal flavours,
            and dishes crafted to be savoured.
          </p>
        </div>

        <div className="menu-grid grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {menuData.categories.map((category) => (
            <div className="menu-category" key={category.id}>
              <h3 className="menu-category-title">
                {category.name}
              </h3>

              <div className="menu-items">
                {category.items.map((item) => (
                  <article className="menu-item" key={item.id}>
                    <div className="menu-item-header flex items-start justify-between gap-4">
                      <h4 className="menu-item-name">
                        {item.name}
                      </h4>

                      <span className="menu-item-price shrink-0">
                        AED {item.price}
                      </span>
                    </div>

                    <p className="menu-item-description">
                      {item.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Menu
