import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Descendant } from "slate";


interface HeaderState {
    header_id: number;
    header_text: string;
    header_content: Descendant[];
    header_background_color: string;
    header_text_color: string;
    header_icon: string;
}

const initialState: HeaderState = {
    header_id: 0,
    header_text: '',
    header_content: [],
    header_background_color: '#FFFFFF',
    header_text_color: '#000000',
    header_icon: ''
};


export const headerSlice = createSlice({
    name: 'header',
    initialState,
    reducers: {
        setHeader: (state, action: PayloadAction<HeaderState>) => {
            return action.payload;
        },
    },
})

export const { setHeader } = headerSlice.actions;
export default headerSlice.reducer;