import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";

interface Pokemon {
  name: string;
  image: string;
  types: any[];
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

export default function PokeDex() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);

  const LIMIT = 20;

  useEffect(() => {
    fetchPokemons();
  }, []);

  async function fetchPokemons() {
    if (loading) return;

    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.EXPO_PUBLIC_POKE_API_URL}/pokemon?limit=${LIMIT}&offset=${offset}`
      );

      const data = await res.json();

      const detailed = await Promise.all(
        data.results.map(async (pokemon: any) => {
          const res = await fetch(pokemon.url);
          const details = await res.json();

          return {
            name: pokemon.name,
            image:
              details.sprites.other["official-artwork"].front_default,
            types: details.types.map((t: any) => t.type),
          };
        })
      );

      // 🚫 prevent duplicate pokemon (fixes your key error)
      setPokemons((prev) => {
        const existing = new Set(prev.map((p) => p.name));
        const filtered = detailed.filter((p) => !existing.has(p.name));
        return [...prev, ...filtered];
      });

      setOffset((prev) => prev + LIMIT);
    } catch (err) {
      console.log("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  function renderItem({ item }: { item: Pokemon }) {
    return (
      <View style={{ flex: 1 }}>
        <Link
          href={{
            pathname: "/pokemonDetails",
            params: { name: item.name },
          }}
          asChild
        >
          <Pressable
            style={{
              // @ts-ignore
              backgroundColor:
                colorsByType[item.types?.[0]?.name] + "50",
              borderRadius: 22,
              padding: 14,
              height: 120,
              margin: 6,
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.name}>{item.name}</Text>

            <View style={styles.typeBadge}>
              <Text style={styles.typeText}>
                {item.types?.[0]?.name}
              </Text>
            </View>

            <Image source={{ uri: item.image }} style={styles.image} />
          </Pressable>
        </Link>
      </View>
    );
  }

  return (
    <FlatList
      data={pokemons}
      keyExtractor={(item) => item.name}
      renderItem={renderItem}
      numColumns={2}
      contentContainerStyle={{ padding: 10 }}
      onEndReached={fetchPokemons}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        loading ? <ActivityIndicator size="large" /> : null
      }
    />
  );
}

const styles = StyleSheet.create({
  name: {
    fontWeight: "bold",
    fontSize: 16,
    textTransform: "capitalize",
  },
  typeBadge: {
    marginTop: 6,
    backgroundColor: "rgba(255,255,255,0.35)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  typeText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  image: {
    position: "absolute",
    right: -10,
    bottom: -10,
    width: 90,
    height: 90,
  },
});
