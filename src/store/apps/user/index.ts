// ** Redux Imports
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getUserCollectionByUserId,
  saveUserCollection,
} from "@/utils/firebase";
import axios from "axios";
import { IUser } from "@/interfaces";

export const saveUser = createAsyncThunk(
  "appUser/saveUser",
  async (user: IUser, { dispatch }) => {
    await saveUserCollection(user);
    return user;
  }
);
export const fetchAdmins = createAsyncThunk(
  "appUser/fetchAdmins",
  async (isToken: string) => {
    const formData = new FormData();
    formData.set("isToken", isToken);
    const response = await axios.post(`/api/get-admins`, formData);
    return response.data.data;
  }
);
export const setIsToken = createAsyncThunk(
  "appUser/setIsToken",
  async (id: string, { dispatch }) => {
    return id;
  }
);
export const removeAdmin = createAsyncThunk(
  "appUser/removeAdmin",
  async ({ userId, isToken }: { userId: string; isToken: string }) => {
    const formData = new FormData();
    formData.set("isToken", isToken);
    formData.set("userId", userId);
    const response = await axios.post(`/api/delete-user`, formData);
    return response.data.data;
  }
);
export const fetchUser = createAsyncThunk(
  "appUser/fetchUser",
  async (id: string) => {
    return await getUserCollectionByUserId(id);
  }
);

export const appUserSlice = createSlice({
  name: "appUser",
  initialState: {
    user: null as IUser | null,
    userId: null as string | null,
    userLoading: false,
    isToken: "",
    admins: [] as IUser[],
    adminsLoding: false,
  },
  reducers: {
    removeUser: (state) => {
      state.user = null;
      state.userId = null;
    },
    setUserLoadingTrue: (state) => {
      state.userLoading = true;
    },
    setAdminLoadingTrue: (state) => {
      state.adminsLoding = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(saveUser.fulfilled, (state, action) => {
      saveUserCollection(action.payload);
    });
    builder.addCase(fetchAdmins.fulfilled, (state, action) => {
      state.admins = action.payload;
      state.adminsLoding = false;
    });
    builder.addCase(setIsToken.fulfilled, (state, action) => {
      state.isToken = action.payload;
    });
    builder.addCase(removeAdmin.fulfilled, (state, action) => {
      state.admins = state.admins.filter(
        (admin) => admin.id !== action.payload
      );
    });
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.user = action.payload;
    });
  },
});

export const { removeUser, setUserLoadingTrue, setAdminLoadingTrue } =
  appUserSlice.actions;

export default appUserSlice.reducer;
