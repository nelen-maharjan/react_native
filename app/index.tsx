import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

interface Pokemon {
  name: string;
  image: string;
  imageBack: string;
  types: PokemonType[];
}

interface PokemonType {
  type: {
    name: string;
    url: string;
  };
}

const colorsByType: Record<string, string> = {
  grass: "#9EDB8A",
  fire: "#F6A76B",
  water: "#9BB7F0",
  bug: "#C4D96F",
  normal: "#C6C6A7",
  poison: "#C183C1",
  electric: "#FFE066",
  ground: "#F0D8A8",
  fairy: "#F5B7C8",
  fighting: "#E57373",
  psychic: "#F7A1C4",
  rock: "#D8C97A",
  ghost: "#9A87B8",
  ice: "#BEEAEA",
  dragon: "#9C7BFA",
  dark: "#9A8F86",
  steel: "#D6D6E8",
  flying: "#C6B7F5",
};

export default function Index() {
  
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  useEffect(() => {
    // fetch pokemons
    fetchPokemons();
  }, []);

  async function fetchPokemons() {
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_POKE_API_URL}/pokemon?limit=10`);
      const data = await res.json();
      
      const detailedPokemons = await Promise.all(
        data.results.map(async (pokemon: any) => {
          const res = await fetch(pokemon.url);
          
          const details = await res.json();
          return {
            name: pokemon.name,
            image: details.sprites.front_default,
            imageBack: details.sprites.back_default,
            types: details.types.map((type: any) => type.type)
          };
        }),
      );

      setPokemons(detailedPokemons);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <ScrollView
    contentContainerStyle={{
      gap: 16,
      padding: 16,
    }}
    >
      {pokemons.map((pokemon: any) => (
        <View key={pokemon.name} style={{
          // @ts-ignore
          backgroundColor: colorsByType[pokemon.types?.[0]?.name] + 50,
          padding: 20,
          borderRadius: 20, 
        }}>
          <Text style={styles.name}>{pokemon.name}</Text>
          <Text style={styles.type}>
            {pokemon.types?.[0]?.name}
          </Text>

          <View style={{ flexDirection: "row" }}>
            <Image
              source={{ uri: pokemon.image }}
              style={{ width: 150, height: 150 }}
            />
            <Image
              source={{ uri: pokemon.imageBack }}
              style={{ width: 150, height: 150 }}
            />
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  name: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "capitalize",
  },
  type: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "gray",
  },
});
