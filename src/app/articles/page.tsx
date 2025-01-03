import clsx from 'clsx'
import Image from 'next/image'

import Heading from '@/components/Heading'

import { articles } from './data'
import { zIndexStyles } from '@/styles'

import tempImage from '@/images/custom-high-performance-beat-store.png'

export default function ArticlesPage() {
  return (
    <div className=" py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Heading title={'Articles'} intro={`Learn how to grow your business with our expert advice.`} />
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {articles.map(post => (
            <article key={post.id} className="flex flex-col items-start justify-between">
              <div className="relative w-full">
                <Image
                  alt=""
                  src={tempImage}
                  className="aspect-video w-full rounded-2xl bg-zinc-800 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
              </div>
              <div className="max-w-xl">
                <div className="mt-8 flex items-center gap-x-4 text-xs">
                  <time dateTime={post.datetime} className="text-zinc-300">
                    {post.date}
                  </time>
                  <a
                    href={post.category.href}
                    className={clsx(
                      'relative rounded-full bg-zinc-700 px-3 py-1.5 font-medium text-zinc-300 hover:bg-zinc-800 transition-colors duration-300',
                      zIndexStyles.articleCategoryLink,
                    )}
                  >
                    {post.category.title}
                  </a>
                </div>
                <div className="group relative">
                  <h3 className="mt-3 text-lg/6 font-semibold text-zinc-100 group-hover:text-zinc-300">
                    <a href={post.href}>
                      <span className="absolute inset-0" />
                      {post.title}
                    </a>
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm/6 text-zinc-300">{post.description}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
