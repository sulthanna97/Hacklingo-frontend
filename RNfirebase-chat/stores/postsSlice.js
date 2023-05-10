import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import base_url from "./base_url";

export const fetchPostDetails = createAsyncThunk(
  "postsSlice/fetchPostDetails", // this is the action name
  async (input, { rejectWithValue }) => {
    // this is the action
    try {
      const userId = await AsyncStorage.getItem("userid");
      const response = await axios({
        method: "GET",
        url: `${base_url}/posts/${input}`,
        headers: {
          userid: userId,
        },
      });
      return response.data;
    } catch (err) {
      if (err.response) {
        return rejectWithValue(err.response.data);
      } else {
        throw err;
      }
    }
  }
);

export const fetchPostsBySearch = createAsyncThunk(
  "postsSlice/fetchPostsBySearch", // this is the action name
  async (input, { rejectWithValue }) => {
    // this is the action
    console.log("masuk sini");
    try {
      const userId = await AsyncStorage.getItem("userid");
      const response = await axios({
        method: "GET",
        url: `${base_url}/posts/`,
        headers: {
          userid: userId,
        },
        params : {
          search : input
        }
      });
      console.log(response.data);
      return response.data;
    } catch (err) {
      if (err.response) {
        return rejectWithValue(err.response.data);
      } else {
        throw err;
      }
    }
  }
);

export const insertNewPost = createAsyncThunk(
  "postsSlice/insertNewPost", // this is the action name
  async (input, { rejectWithValue }) => {
    // this is the action
    try {
      const userId = await AsyncStorage.getItem("userid");
      const response = await axios({
        method: "POST",
        url: `${base_url}/posts`,
        headers: {
          userid: userId,
        },
        data: input
      });
      return response.data;
    } catch (err) {
      if (err.response) {
        return rejectWithValue(err.response.data);
      } else {
        throw err;
      }
    }
  }
);

export const updatePostById = createAsyncThunk(
  "postsSlice/updatePostById", // this is the action name
  async ({input, postId}, { rejectWithValue }) => {
    // this is the action
    try {
      const userId = await AsyncStorage.getItem("userid");
      const response = await axios({
        method: "PUT",
        url: `${base_url}/posts/${postId}`,
        headers: {
          userid: userId,
        },
        data: input
      });
      return response.data;
    } catch (err) {
      if (err.response) {
        return rejectWithValue(err.response.data);
      } else {
        throw err;
      }
    }
  }
);

export const deletePostById = createAsyncThunk(
  "postsSlice/deletePostById", // this is the action name
  async (postId, { rejectWithValue }) => {
    // this is the action
    try {
      const userId = await AsyncStorage.getItem("userid");
      const response = await axios({
        method: "DELETE",
        url: `${base_url}/posts/${postId}`,
        headers: {
          userid: userId,
        },
      });
      return response.data;
    } catch (err) {
      if (err.response) {
        return rejectWithValue(err.response.data);
      } else {
        throw err;
      }
    }
  }
);

const postsSlice = createSlice({
  name: "postsSlice",
  initialState: {
    postDetails: {},
    posts: [],
    status: {
      posts: "idle",
      postDetails: "idle",
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPostDetails.pending, (state, action) => {
        state.status.postDetails = "loading";
      })
      .addCase(fetchPostDetails.fulfilled, (state, action) => {
        state.status.postDetails = "idle";
        state.postDetails = action.payload;
      })
      .addCase(fetchPostDetails.rejected, (state, action) => {
        state.status.postDetails = "error";
      })
      .addCase(fetchPostsBySearch.pending, (state, action) => {
        state.status.posts = "loading";
      })
      .addCase(fetchPostsBySearch.fulfilled, (state, action) => {
        state.status.posts = "idle";
        state.posts = action.payload;
      })
      .addCase(fetchPostsBySearch.rejected, (state, action) => {
        state.status.posts = "error";
      });
  },
});

export default postsSlice.reducer;