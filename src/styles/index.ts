import clsx from 'clsx'

// export const buttonClasses = {
//   base: 'font-semibold transition-colors duration-300 text-base rounded-md px-3 py-2 text-center shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 w-full',
//   disabled: 'cursor-not-allowed opacity-50',
//   primary: {
//     base: 'text-white  bg-indigo-600 focus-visible:outline-indigo-600',
//     active: 'cursor-pointer active:bg-indigo-400 hover:bg-indigo-500',
//   },
//   secondary: {
//     base: 'bg-white text-indigo-700 focus-visible:outline-indigo-600',
//     active: 'cursor-pointer hover:bg-indigo-50 active:bg-indigo-100 ',
//   },
// }

export const menuItemStyles = {
  base: clsx(
    'text-xl hover:bg-slate-700 active:bg-slate-600 transition-all duration-300 px-2 py-3',
    // 'rounded-lg'
  ),
  active: clsx(
    // 'text-slate-300 bg-slate-800',
    'border-b-2 border-indigo-500',
  ),
  inactive: 'text-slate-200',
}

export const formStyles = {
  textButton: 'text-sm font-semibold text-indigo-400 hover:text-indigo-300 active:text-indigo-200',
  checkbox:
    'col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-zinc-300 checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto',
  label: {
    main: 'block text-sm/6 font-medium text-white',
    subtle: 'text-sm/6 font-medium', // Todo: Add @apply rule for this
  },
}
