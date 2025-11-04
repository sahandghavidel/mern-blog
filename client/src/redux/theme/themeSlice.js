import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    theme: 'light',
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
        },
        toggleSuccessTheme :(state) => {
            state.theme = state.theme === "success" ? "green" : "red"
        }
        }
});

export const {toggleTheme,toggleSuccessTheme} = themeSlice.actions;

export default themeSlice.reducer;