import CartList from './components/CartList'
import OrderSummary from './components/OrderSummary'

export default function CartPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Cart</h1>
      <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
        <section aria-labelledby="cart-heading" className="lg:col-span-7">
          <h2 id="cart-heading" className="sr-only">
            Items in your shopping cart
          </h2>
          <CartList />
        </section>
        <OrderSummary />
      </form>
    </div>
  )
}
