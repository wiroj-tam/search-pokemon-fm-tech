"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@apollo/client/react";
import { GET_POKEMON } from "@/graphql/queries";


export default function PokemonResult() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const name = searchParams.get("name");

  const { data, loading, error } = useQuery(GET_POKEMON, {
    variables: { name },
    skip: !name,
  });

  if (!name) return null;
  if (loading) return <div className="text-center py-12 text-xl">Loading...</div>;
  if (error || !data?.pokemon) {
    return <div className="text-center py-12 text-red-600 text-xl font-semibold">Pokémon not found</div>;
  }

  const pokemon = data.pokemon;
  console.log(pokemon)

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 p-8 text-white">
            <h1 className="text-4xl font-bold capitalize mb-2">{pokemon.name}</h1>
            <p className="text-red-100">#{pokemon.number}</p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Image & Types */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="flex justify-center">
                <img src={pokemon.image} alt={pokemon.name} className="w-48 h-48 drop-shadow-lg" />
              </div>

              <div className="md:col-span-2">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Types</h2>
                <div className="flex gap-3 flex-wrap mb-8">
                  {pokemon.types?.map((t: string) => (
                    <span
                      key={t}
                      className={`px-5 py-2 text-white rounded-full font-semibold shadow-md capitalize type-${t.toLowerCase()}`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Attacks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Fast Attacks</h2>
                <div className="space-y-2">
                  {pokemon.attacks?.fast
                    ?.filter((a: any) => a.name)
                    ?.map((a: any) => (
                      <div key={a.name} className="bg-red-50 p-3 rounded-lg border-l-4 border-red-500">
                        <div className="flex justify-between">
                          <strong className="text-gray-800">{a.name}</strong>
                          <span className="text-red-600 font-semibold">Power {a.damage}</span>
                        </div>
                        <p className="text-sm text-gray-600">{a.type}</p>
                      </div>
                    ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Special Attacks</h2>
                <div className="space-y-2">
                  {pokemon.attacks?.special
                    ?.filter((a: any) => a.name)
                    ?.map((a: any) => (
                      <div key={a.name} className="bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-500">
                        <div className="flex justify-between">
                          <strong className="text-gray-800">{a.name}</strong>
                          <span className="text-yellow-600 font-semibold">Power {a.damage}</span>
                        </div>
                        <p className="text-sm text-gray-600">{a.type}</p>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Evolutions */}
            {pokemon.evolutions && pokemon.evolutions.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Evolutions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {pokemon.evolutions.map((evo: any) => (
                    <button
                      key={evo.name}
                      onClick={() => router.push(`/?name=${evo.name.toLowerCase()}`)}
                      className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl hover:shadow-lg hover:from-blue-100 hover:to-blue-200 transition cursor-pointer border-2 border-blue-200"
                    >
                      <img src={evo.image} alt={evo.name} className="w-24 h-24 mx-auto mb-3 drop-shadow" />
                      <p className="capitalize font-bold text-gray-800 text-center">{evo.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
