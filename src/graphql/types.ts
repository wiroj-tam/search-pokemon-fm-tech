export type Attack = {
  name: string;
  type: string;
  damage: number;
};

export type Pokemon = {
  id: string;
  number: string;
  name: string;
  image: string;
  types: string[];
  attacks: {
    fast: Attack[];
    special: Attack[];
  };
  evolutions?: {
    id: string;
    name: string;
    image: string;
  }[];
};

export type GetPokemonData = {
  pokemon: Pokemon | null;
};

export type GetPokemonVars = {
  name: string;
};

export type GetPokemonsNameData = {
  pokemons: { name: string }[];
};

export type GetPokemonsNameVars = {
  first: number;
};
