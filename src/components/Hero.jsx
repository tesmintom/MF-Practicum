
function Hero() {
  return (
    <section className="hero relative" aria-labelledby="hero-title">
      <img
        className="hero-image"
        src="/images/noir-hero.png"
        alt="Cait Hero"
      />

      <div className="container hero-inner relative z-10 mx-auto w-full px-5 sm:px-8 lg:px-10">
        <div className="hero-content">
          <h1 id="hero-title">
            An evening<br />to savour.
          </h1>

          <p className="hero-description">
            Seasonal ingredients. Thoughtful craftsmanship.
            <br className="hidden sm:block" />
            An intimate dining experience in the heart of Dubai.
          </p>

          <a
            href="#reservations"
            className="button button-primary"
          >
            Reserve a Table
          </a>
        </div>
      </div>
    </section>
  )
}

export default Hero
