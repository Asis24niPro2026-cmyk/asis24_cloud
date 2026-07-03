import { trpc } from "@/lib/trpc";

export function Hello() {
  const { data, isLoading } = trpc.hello.useQuery("Evelio");

  if (isLoading) return <p>Cargando...</p>;
  return <p>{data}</p>;
}
