import { redirect } from "next/navigation";

type SearchParamsType = Promise<{ code?: string }>;

export default async function SuccessPage({ searchParams }: { searchParams: SearchParamsType }) {
  const { code } = await searchParams;

  if (!code) {
    return redirect("/");
  }

  return (
    <div className="max-w-lg mx-auto p-6 text-center">
      <h1 className="text-2xl font-bold"> Success!</h1>
      <p className="mt-4 text-lg">Your discount code:</p>
      <div className="mt-2 p-3 text-xl font-semibold bg-gray-200 rounded">{code}</div>
      <p className="mt-4">Use this code at checkout to claim your discount.</p>
    </div>
  );
}
