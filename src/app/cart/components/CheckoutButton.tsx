'use client'

export default function CheckoutButton() {
  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
  }
  return (
    <button onClick={handleClick} className="button-primary w-full">
      Checkout
    </button>
  )
}
