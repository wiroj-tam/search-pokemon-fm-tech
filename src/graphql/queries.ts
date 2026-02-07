import { gql } from "@apollo/client";

export const GET_POKEMONS_NAME = gql`
  query GetPokemons($first: Int!) {
    pokemons(first: $first) {
      name
    }
  }
`;

export const GET_POKEMON = gql`
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
