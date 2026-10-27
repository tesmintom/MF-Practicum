
function Reservation() {
  return (
    <section
      className="reservations"
      id="reservations"
      aria-labelledby="reservation-title"
    >
      <img
        className="reservation-background"
        src="/images/noir-reservation-bg.png"
        alt=""
      />

      <div className="reservation-content">
        <p className="section-eyebrow">Reservations</p>

        <h2 id="reservation-title">Let us set the table.</h2>

        <p className="reservation-description">
          Join us for an unforgettable dining experience.
          <br />
          We look forward to welcoming you.
        </p>

        <a
          className="button button-primary"
          href="mailto:reservations@brewhaus.com"
          aria-describedby="reservation-note"
        >
          Reserve a Table
        </a>

        <p className="reservation-note" id="reservation-note">
          Request by email. Your booking is confirmed by our team.
        </p>
      </div>
    </section>
  )
}

export default Reservation
