export default function Heading({ title, intro }: { title: string; intro: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <h1>{title}</h1>
      <p className="mt-2 text-lg/8 text-zinc-300">{intro}</p>
    </div>
  )
}
