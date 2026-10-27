
function OurStory() {
  return (
    <section
      className="our-story grid grid-cols-1 lg:grid-cols-2"
      id="about"
      aria-labelledby="story-title"
    >
      <div className="story-image">
        <img
          src="/images/noir-inner.png"
          alt="Warmly lit restaurant interior with elegantly set dining tables"
          loading="lazy"
        />
      </div>

      <div className="story-content">
        <p className="section-eyebrow">Our story</p>

        <h2 id="story-title">
          Thoughtfully crafted.
          <br />
          Beautifully shared.
        </h2>

        <p>
          Cait Restaurant was born from a simple belief — that extraordinary food
          brings people closer. Inspired by global flavours and rooted
          in a passion for seasonal ingredients, we create dining
          experiences that are elegant, immersive and always memorable.
        </p>
      </div>
    </section>
  )
}

export default OurStory
