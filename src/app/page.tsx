import SearchBar from "@/components/SearchBar";
import PokemonResult from "@/components/PokemonResult";

type Props = {
  searchParams: Promise<{ name?: string }>;
};

export default async function Home() {
  return (
    <main className="min-h-screen px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
          Pokémon Search
        </h1>
        <SearchBar />
        <PokemonResult />
      </div>
    </main>
  );
}
