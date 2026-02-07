import { gql } from "@apollo/client";
import { TypedDocumentNode } from "@graphql-typed-document-node/core";
import type {
  GetPokemonData,
  GetPokemonVars,
  GetPokemonsNameData,
  GetPokemonsNameVars,
} from "./types";

export const GET_POKEMONS_NAME: TypedDocumentNode<
  GetPokemonsNameData,
  GetPokemonsNameVars
> = gql`
  query GetPokemons($first: Int!) {
    pokemons(first: $first) {
      name
    }
  }
`;

export const GET_POKEMON: TypedDocumentNode<
  GetPokemonData,
  GetPokemonVars
> = gql`
  query GetPokemon($name: String!) {
    pokemon(name: $name) {
      id
      number
      name
      image
      types
      attacks {
        fast {
          name
          type
          damage
        }
        special {
          name
          type
          damage
        }
      }
      evolutions {
        id
        name
        image
      }
    }
  }
`;
