import { createSlice } from "@reduxjs/toolkit";

const stored = JSON.parse(localStorage.getItem("auth"));

const authSlice = createSlice({
  name: "auth",
  initialState: stored || { user: null, token: null },
  reducers:{
    setCredentials:(state,action)=>{
      state.user = action.payload.user;
      state.token = action.payload.accessToken;
      localStorage.setItem("auth",JSON.stringify(state));
    },
    logout:(state)=>{
      state.user=null;
      state.token=null;
      localStorage.removeItem("auth");
    }
  }
});

export const {logout,setCredentials} = authSlice.actions
export default authSlice.reducer