import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface Background {
    background_id: number;
    background_type: string;
    background_color: string;
    background_image_path: string;
    selectedImageName: string;

}

const initialState: Background = {
    background_id: 0,
    background_type: 'color',
    background_color: '#FFFFFF',
    background_image_path: '',
    selectedImageName: "",
}

export const backgroundSlice = createSlice({
    name: 'background',
    initialState,
    reducers: {
        setBackground: (state, action: PayloadAction<Background>) => {
            return action.payload;
        },
    },
})

export const { setBackground } = backgroundSlice.actions;
export default backgroundSlice.reducer;