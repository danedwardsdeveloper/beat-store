import clsx from 'clsx'

const lineClasses = 'absolute h-0.5 bg-current transition-all duration-300 ease-in-out'

export default function MenuIcon({ menuOpen = false }: { menuOpen: boolean }) {
  return (
    <div className="relative size-10">
      <div className={clsx(lineClasses, 'w-6 top-1', menuOpen && 'rotate-45 top-[11px]')} />
      <div className={clsx(lineClasses, 'w-6 top-[11px]', menuOpen && 'opacity-0 scale-x-0')} />
      <div className={clsx(lineClasses, 'w-6 bottom-1', menuOpen && '-rotate-45 top-[11px]')} />
    </div>
  )
}
