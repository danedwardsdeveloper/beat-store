interface HoneypotProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export default function HoneyPot({ value, onChange, name }: HoneypotProps) {
  return (
    <input
      name={name}
      type="text"
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      className="hidden"
      value={value}
      onChange={onChange}
    />
  )
}
