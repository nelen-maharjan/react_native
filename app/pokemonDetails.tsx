import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

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

export default function PokemonDetails() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const name = params.name as string;

  const [pokemon, setPokemon] = useState<any>(null);
  const [evolutions, setEvolutions] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<
    "about" | "stats" | "evolution" | "moves"
  >("about");

  useEffect(() => {
    fetchPokemon();
  }, [name]);

  async function fetchPokemon() {
    try {
      // GET MAIN DATA
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_POKE_API_URL}/pokemon/${name}`
      );
      const data = await res.json();

      setPokemon({
        name: data.name,
        image: data.sprites.other["official-artwork"].front_default,
        types: data.types,
        height: data.height,
        weight: data.weight,
        abilities: data.abilities,
        stats: data.stats,
        moves: data.moves.slice(0, 20),
      });

      // GET SPECIES
      const speciesRes = await fetch(data.species.url);
      const speciesData = await speciesRes.json();

      // GET EVOLUTION CHAIN
      const evoRes = await fetch(speciesData.evolution_chain.url);
      const evoData = await evoRes.json();

      const evoList: string[] = [];

      function extractEvos(chain: any) {
        evoList.push(chain.species.name);
        chain.evolves_to.forEach((e: any) => extractEvos(e));
      }

      extractEvos(evoData.chain);
      setEvolutions(evoList);
    } catch (e) {
      console.log(e);
    }
  }

  if (!pokemon) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const typeName = pokemon.types?.[0]?.type?.name;
  const bg = colorsByType[typeName] || "#eee";

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={[styles.header, { backgroundColor: bg }]}>
          <Text style={styles.title}>{pokemon.name}</Text>

          <View style={styles.typeRow}>
            {pokemon.types.map((t: any) => (
              <View key={t.type.name} style={styles.typeBadge}>
                <Text style={styles.typeText}>{t.type.name}</Text>
              </View>
            ))}
          </View>

          <Image source={{ uri: pokemon.image }} style={styles.image} />
        </View>

        {/* WHITE INFO CARD */}
        <View style={styles.card}>
          {/* TABS */}
          <View style={styles.tabs}>
            {["about", "stats", "evolution", "moves"].map((tab) => (
              <Pressable key={tab} onPress={() => setActiveTab(tab as any)}>
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.activeTab,
                  ]}
                >
                  {tab}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* ABOUT */}
          {activeTab === "about" && (
            <View style={styles.section}>
              <Text style={styles.row}>Height: {pokemon.height / 10} m</Text>
              <Text style={styles.row}>Weight: {pokemon.weight / 10} kg</Text>
              <Text style={styles.row}>
                Abilities:{" "}
                {pokemon.abilities.map((a: any) => a.ability.name).join(", ")}
              </Text>
            </View>
          )}

          {/* BASE STATS */}
          {activeTab === "stats" && (
            <View style={styles.section}>
              {pokemon.stats.map((s: any) => (
                <View key={s.stat.name} style={styles.statRow}>
                  <Text style={styles.statName}>{s.stat.name}</Text>

                  <View style={styles.statBarBg}>
                    <View
                      style={[
                        styles.statBarFill,
                        { width: `${s.base_stat}%` },
                      ]}
                    />
                  </View>

                  <Text>{s.base_stat}</Text>
                </View>
              ))}
            </View>
          )}

          {/* EVOLUTIONS 🔥 */}
          {activeTab === "evolution" && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.evoScroll}
            >
              {evolutions.map((evo, index) => (
                <View key={evo} style={styles.evoWrapper}>
                  <Pressable
                    onPress={() =>
                      router.push({
                        pathname: "/pokemonDetails",
                        params: { name: evo },
                      })
                    }
                    style={styles.evoCard}
                  >
                    <Image
                      source={{
                        uri: `https://img.pokemondb.net/artwork/${evo}.jpg`,
                      }}
                      style={styles.evoImage}
                    />

                    <Text style={styles.evoText}>{evo}</Text>
                  </Pressable>

                  {index !== evolutions.length - 1 && (
                    <Text style={styles.evoArrow}>→</Text>
                  )}
                </View>
              ))}
            </ScrollView>
          )}

          {/* MOVES */}
          {activeTab === "moves" && (
            <View style={styles.section}>
              <View style={styles.movesWrap}>
                {pokemon.moves.map((m: any) => (
                  <View key={m.move.name} style={styles.moveBadge}>
                    <Text style={styles.moveText}>{m.move.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 120,
  },

  title: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
    textTransform: "capitalize",
  },

  typeRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },

  typeBadge: {
    backgroundColor: "rgba(255,255,255,0.35)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },

  typeText: {
    fontWeight: "600",
    textTransform: "capitalize",
  },

  image: {
    width: 220,
    height: 220,
    position: "absolute",
    right: 10,
    bottom: -10,
  },

  card: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    minHeight: 500,
  },

  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },

  tabText: {
    fontSize: 16,
    color: "#888",
    textTransform: "capitalize",
  },

  activeTab: {
    color: "#000",
    fontWeight: "bold",
  },

  section: {
    gap: 14,
  },

  row: {
    fontSize: 16,
    textTransform: "capitalize",
  },

  statRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  statName: {
    width: 80,
    textTransform: "capitalize",
  },

  statBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: "#eee",
    borderRadius: 10,
  },

  statBarFill: {
    height: 6,
    backgroundColor: "#4CAF50",
    borderRadius: 10,
  },

  movesWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  moveBadge: {
    backgroundColor: "#eee",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },

  moveText: {
    textTransform: "capitalize",
  },

  evoScroll: {
    alignItems: "center",
    paddingVertical: 10,
    gap: 10,
  },

  evoWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },

  evoCard: {
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    padding: 12,
    borderRadius: 18,
    width: 110,
  },

  evoImage: {
    width: 80,
    height: 80,
  },

  evoText: {
    marginTop: 6,
    textTransform: "capitalize",
    fontWeight: "600",
  },

  evoArrow: {
    fontSize: 26,
    marginHorizontal: 10,
    color: "#999",
    fontWeight: "bold",
  },
});
