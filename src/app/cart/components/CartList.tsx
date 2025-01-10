import { XMarkIcon } from '@heroicons/react/20/solid'
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

export default function CartList() {
  return (
    <ul role="list" className="divide-y divide-zinc-800 border-b border-t border-zinc-800">
      {products.map(product => (
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
                  <button type="button" className="-m-2 inline-flex p-2 text-zinc-400 hover:text-zinc-300">
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
  )
}
