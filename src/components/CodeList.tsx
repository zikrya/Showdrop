"use client";

export default function CodeList({
  codes,
  total,
  claimed,
  remaining,
}: {
  codes: { code: string; assignedToEmail: string | null }[];
  total: number;
  claimed: number;
  remaining: number;
}) {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mt-4">All Discount Codes</h3>
      <ul className="border p-4 rounded bg-white">
        {codes.map((code, index) => (
          <li
            key={index}
            className={`p-2 border-b last:border-0 flex justify-between ${
              code.assignedToEmail ? "text-gray-400 line-through" : "text-black"
            }`}
          >
            <span>{code.code}</span>
            <span>{code.assignedToEmail ? "Claimed" : "Available"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

