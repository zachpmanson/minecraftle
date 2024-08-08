const Row = ({ left, right }: { left: string; right?: string }) => (
  <tr className="odd:text-white even:text-gray-400">
    <td colSpan={right ? 1 : 2}>{left}</td>
    {right && <td className="text-right">{right}</td>}
  </tr>
);

export default Row;
