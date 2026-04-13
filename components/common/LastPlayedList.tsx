import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";

export type Artist = {
  id: string;
  name: string;
  image: string;
  subtitle?: string;
};

/* Helper: bagi data per 4 item*/
const chunkArray = (data: Artist[], size: number) => {
  const result: Artist[][] = [];
  for (let i = 0; i < data.length; i += size) {
    result.push(data.slice(i, i + size));
  }
  return result;
};

export default function LastPlayedList({
  data,
}: {
  data: Artist[];
}) {
  const columns = chunkArray(data, 4);

  return (
    <View style={styles.container}>
      {/* ===== Header ===== */}
      <View style={styles.header}>
        <Text style={styles.title}>Last played from search</Text>
        <Text style={styles.seeAll}>See all</Text>
      </View>

      {/* ===== Horizontal Scroll (column based) ===== */}
      <FlatList
        horizontal
        data={columns}
        keyExtractor={(_, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => (
          <View style={styles.column}>
            {item.map((artist) => (
              <View key={artist.id} style={styles.card}>
                <Image
                  source={{ uri: artist.image }}
                  style={styles.avatar}
                />

                <View style={styles.info}>
                  <Text style={styles.name} numberOfLines={1}>
                    {artist.name}
                  </Text>
                  <Text style={styles.subtitle} numberOfLines={1}>
                    {artist.subtitle ?? "Artist"}
                  </Text>
                </View>

                <TouchableOpacity>
                  <Feather
                    name="more-horizontal"
                    size={18}
                    color="#444"
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 24,
  },

  header: {
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
  },

  seeAll: {
    color: "#1DB954",
    fontSize: 14,
  },
  column: {
    width: 320, 
    marginRight: 16,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: 12,
    marginRight: 12,
  },

  info: {
    flex: 1,
  },

  name: {
    fontSize: 15,
    fontWeight: "600",
  },

  subtitle: {
    fontSize: 13,
    color: "#777",
    marginTop: 2,
  },
});
