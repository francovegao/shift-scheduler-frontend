export default function Table({
  columns,
  renderRow,
  data,
}: {
  columns: {header: string; accessor: string; className?: string}[];
  renderRow: (item: any) => React.ReactNode;
  data: any[];
}) {
    return(
          <table className="min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
                <tr className="text-left text-gray-500 text-sm">
                    {columns.map((col) => (
                    <th scope="col" key={col.accessor} className={col.className}>{col.header}</th>
                    ))}
                </tr>
            </thead>
            <tbody className="bg-white">{data.map((item)=>renderRow(item))}</tbody>
          </table>
    );

}