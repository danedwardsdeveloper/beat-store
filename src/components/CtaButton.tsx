import clsx from 'clsx'

export default function CtaButton() {
  return (
    <button
      className={clsx(
        'text-black',
        'bg-yellow-300 hover:bg-yellow-400 active:bg-yellow-500',
        'transition-all duration-300',
        'rounded py-1 px-4 text-xl font-bold',
      )}
    >
      Get your store
    </button>
  )
}
