import { QuestionMarkCircleIcon, XMarkIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'

// cspell:disable
const products = [
  {
    id: 1,
    name: 'Basic Tee',
    href: '#',
    price: '$32.00',
    color: 'Sienna',
    inStock: true,
    size: 'Large',
    imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/shopping-cart-page-01-product-01.jpg',
    imageAlt: "Front of men's Basic Tee in sienna.",
  },
  {
    id: 2,
    name: 'Basic Tee',
    href: '#',
    price: '$32.00',
    color: 'Black',
    inStock: false,
    leadTime: '3-4 weeks',
    size: 'Large',
    imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/shopping-cart-page-01-product-02.jpg',
    imageAlt: "Front of men's Basic Tee in black.",
  },
  {
    id: 3,
    name: 'Nomad Tumbler',
    href: '#',
    price: '$35.00',
    color: 'White',
    inStock: true,
    imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/shopping-cart-page-01-product-03.jpg',
    imageAlt: 'Insulated bottle with white base and black snap lid.',
  },
]

export default function CartPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Cart</h1>
      <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
        <section aria-labelledby="cart-heading" className="lg:col-span-7">
          <h2 id="cart-heading" className="sr-only">
            Items in your shopping cart
          </h2>

          <ul role="list" className="divide-y divide-zinc-800 border-b border-t border-zinc-800">
            {products.map((product, productIdx) => (
              <li key={product.id} className="flex py-6 sm:py-10">
                <div className="shrink-0">
                  <Image
                    alt={product.imageAlt}
                    src={product.imageSrc}
                    height={192}
                    width={192}
                    className="size-24 rounded-md object-cover sm:size-48"
                  />
                </div>

                <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                  <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                    <div>
                      <div className="flex justify-between">
                        <h3 className="text-sm">
                          <a href={product.href} className="font-medium text-zinc-200 hover:text-white">
                            {product.name}
                          </a>
                        </h3>
                      </div>
                      <div className="mt-1 flex text-sm">
                        <p className="text-zinc-400">{product.color}</p>
                        {product.size ? (
                          <p className="ml-4 border-l border-zinc-800 pl-4 text-zinc-400">{product.size}</p>
                        ) : null}
                      </div>
                      <p className="mt-1 text-sm font-medium text-white">{product.price}</p>
                    </div>

                    <div className="mt-4 sm:mt-0 sm:pr-9">
                      <div className="absolute right-0 top-0">
                        <button
                          type="button"
                          className="-m-2 inline-flex p-2 text-zinc-400 hover:text-zinc-300"
                        >
                          <span className="sr-only">Remove</span>
                          <XMarkIcon aria-hidden="true" className="size-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Order summary */}
        <section
          aria-labelledby="summary-heading"
          className="mt-16 rounded-lg bg-slate-900 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
        >
          <h2 id="summary-heading" className="text-lg font-medium text-white">
            Order summary
          </h2>

          <dl className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <dt className="text-sm text-zinc-400">Subtotal</dt>
              <dd className="text-sm font-medium text-white">$99.00</dd>
            </div>
            <div className="flex items-center justify-between border-t border-zinc-800 pt-4">
              <dt className="flex items-center text-sm text-zinc-400">
                <span>Shipping estimate</span>
                <a href="#" className="ml-2 shrink-0 text-zinc-500 hover:text-zinc-400">
                  <span className="sr-only">Learn more about how shipping is calculated</span>
                  <QuestionMarkCircleIcon aria-hidden="true" className="size-5" />
                </a>
              </dt>
              <dd className="text-sm font-medium text-white">$5.00</dd>
            </div>
            <div className="flex items-center justify-between border-t border-zinc-800 pt-4">
              <dt className="flex text-sm text-zinc-400">
                <span>Tax estimate</span>
                <a href="#" className="ml-2 shrink-0 text-zinc-500 hover:text-zinc-400">
                  <span className="sr-only">Learn more about how tax is calculated</span>
                  <QuestionMarkCircleIcon aria-hidden="true" className="size-5" />
                </a>
              </dt>
              <dd className="text-sm font-medium text-white">$8.32</dd>
            </div>
            <div className="flex items-center justify-between border-t border-zinc-800 pt-4">
              <dt className="text-base font-medium text-white">Order total</dt>
              <dd className="text-base font-medium text-white">$112.32</dd>
            </div>
          </dl>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
            >
              Checkout
            </button>
          </div>
        </section>
      </form>
    </div>
  )
}
