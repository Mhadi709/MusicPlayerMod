import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Song, PodcastEpisode } from "@/app/(drawer)/Bookmarks";

type Props = {
  songs: Song[];
  podcasts: PodcastEpisode[];
};

export default function NodataBookmar({ songs, podcasts }: Props) {
  let title = "";
  let subtitle = "";

  if (songs.length === 0 && podcasts.length === 0) {
    title = "No Bookmarks";
    subtitle =
      "Your bookmarks list is still empty. Start saving your favorite songs or podcasts here.";
  } else if (songs.length === 0) {
    title = "No Music Bookmarks";
    subtitle =
      "Your bookmarks list is still empty. Start saving your favorite songs here.";
  } else if (podcasts.length === 0) {
    title = "No Podcast Bookmarks";
    subtitle =
      "Your bookmarks list is still empty. Start saving your favorite podcasts here.";
  }

  return (
    <View style={styles.content}>
      <MaterialCommunityIcons
        name="bookmark-remove-outline"
        size={100}
        color="#898A8D"
      />
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptySubtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    color: "#333",
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#898A8D",
    marginTop: 5,
    textAlign: "center",
  },
});
