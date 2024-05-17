import { createSlice } from '@reduxjs/toolkit';

const namespace = 'video';

const initialState = {
  currentVideoDetailId: null,
};

const videoSlice = createSlice({
  name: namespace,
  initialState,
  reducers: {
    setCurrentVideoDetailId(state, action) {
      state.currentVideoDetailId = action.payload;
    },
  },
});

export const { setCurrentVideoDetailId } = videoSlice.actions;

export default videoSlice.reducer;
