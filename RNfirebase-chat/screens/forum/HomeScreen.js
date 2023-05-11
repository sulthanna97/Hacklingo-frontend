import React, { useCallback, useEffect, useState } from "react";
import { Text, TouchableOpacity, View, Pressable, Image } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import CardForum from "../../components/forum/card";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { fetchForumDetails } from "../../stores/forumsSlice";
import showToast from "../../helper/showToast";
import { ActivityIndicator } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { fetchPostsBySearch } from "../../stores/postsSlice";

export default function HomeScreen({ navigation }) {
  const route = useRoute();
  const forumName = route.name;
  const forumId = route.params.forumId;
  const [showFullText, setShowFullText] = useState(false);
  const forumDetails = useSelector((state) => state.forumsReducer.forumDetails);
  const fetchForumDetailsStatus = useSelector(
    (state) => state.forumsReducer.status.forumDetails
  );
  const fetchPostsBySearchStatus = useSelector(
    (state) => state.postsReducer.status.posts
  );
  const posts = useSelector((state) => state.postsReducer.posts);

  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchForumDetails(forumId))
        .unwrap()
        .catch((err) => showToast("error", "Fetch Data Error", err.message));
    }, [forumId])
  );

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchPostsBySearch({ search: "", forumId }))
        .unwrap()
        .catch((err) => showToast("error", "Fetch Data Error", err.message));
    }, [])
  );

  if (
    fetchForumDetailsStatus === "loading" ||
    fetchPostsBySearchStatus === "loading"
  ) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <View style={{ backgroundColor: "white", paddingBottom: 20 }}>
        <View style={{ marginLeft: 10, marginTop: 20 }}>
          <Text style={{ fontSize: 25, fontWeight: "500", marginBottom: 5 }}>
            {forumName}{" "}
            <Image
              source={{ uri: forumDetails.flagImage }}
              style={{ width: 25, height: 25, borderRadius: 100 }}
            />
          </Text>
          <Pressable onPress={() => setShowFullText(!showFullText)}>
            <Text style={{ color: "grey", fontWeight: "300", fontSize: 15 }}>
              {showFullText
                ? forumDetails.description
                : forumDetails.description?.split(".").slice(0, 1).join(".") +
                  "..."}
            </Text>
          </Pressable>
        </View>
      </View>
      <ScrollView style={{ backgroundColor: "#F6F1F1", paddingVertical: 12 }}>
        {posts?.length > 0 ? (
          posts.map((post) => (
            <CardForum key={post._id} navigation={navigation} post={post} />
          ))
        ) : (
          <Text style={{ textAlign: "center", marginTop: 20, color: "gray" }}>
            No posts found.
          </Text>
        )}
      </ScrollView>
      <TouchableOpacity
        style={{
          backgroundColor: "#0097b2",
          borderRadius: 25,
          paddingHorizontal: 20,
          paddingVertical: 10,
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          bottom: 20,
          right: 20,
        }}
        onPress={() => navigation.navigate("AddPost", { forumId })}
      >
        <MaterialIcons name="post-add" size={24} color="white" />
      </TouchableOpacity>
    </>
  );
}
