
function QuantityStepper({ quantity, onChange }) {
  return (
    <div
      className="quantity-stepper inline-flex items-center gap-3"
      aria-label="Item quantity"
    >
      <button
        type="button"
        className="quantity-button"
        onClick={() => onChange(Math.max(0, quantity - 1))}
        disabled={quantity === 0}
        aria-label="Decrease quantity"
      >
        −
      </button>

      <span
        className="quantity-value"
        aria-live="polite"
        aria-atomic="true"
      >
        {quantity}
      </span>

      <button
        type="button"
        className="quantity-button"
        onClick={() => onChange(quantity + 1)}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  )
}

export default QuantityStepper
