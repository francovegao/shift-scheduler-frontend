import clsx from 'clsx';

export default function ColorCodes({ label, color }: {
     label: string,
     color: string,
     }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-xs ',
        {
          'bg-[rgb(104,163,67)] text-white': color === 'green',
          'bg-[rgb(255,222,33)] text-black': color === 'yellow',
          'bg-[rgb(178,255,255)] text-black': color === 'blue',
          'bg-[rgb(99,107,47)] text-white': color === 'olivegreen',
          'bg-[rgb(255,70,162)] text-white': color === 'pink',
          'bg-[rgb(144,213,255)] text-black': color === 'lightblue',
          'bg-[rgb(224,176,255)] text-black': color === 'purple',
          'bg-[rgb(239,191,4)] text-black': color === 'gold',
        },
      )}
    >
    <>
        {label}
    </>
    </span>
  );
}