"use client";

export default function DiscountCodeList({ codes }: { codes: string[] }) {
  if (codes.length === 0) return <p>No discount codes added yet.</p>;

  return (
    <ul className="border p-4 rounded">
      {codes.map((code, index) => (
        <li key={index} className="p-2 border-b last:border-0">{code}</li>
      ))}
    </ul>
  );
}
