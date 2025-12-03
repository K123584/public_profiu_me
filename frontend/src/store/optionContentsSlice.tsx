import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Descendant } from "slate";


interface OptionContentProps {
    option_content_id: number;
    option_item_id: number;
    option_content: Descendant[]; // JSON
    created_at: string;
    updated_at: string;
    option_item_sort_index: number;
  }

interface OptionContentState {
  lists: OptionContentProps[],
};

const initialState: OptionContentState = {
  lists: [],
}


export const optionContentsSlice = createSlice({
  name: 'optionContents',
  initialState,
  reducers: {
    setOptionContents: (state, action: PayloadAction<OptionContentProps[]>) => {
      state.lists = action.payload;
    },
    moveList: (
      state,
      action: PayloadAction<{ from_index: number; to_index: number }>
    ) => {
      const { from_index, to_index } = action.payload;
      const updatedLists = [...state.lists];
      const [movedItem] = updatedLists.splice(from_index, 1);
      updatedLists.splice(to_index, 0, movedItem);

      state.lists = updatedLists.map((item, index) => ({
        ...item,
        option_item_sort_index: index + 1,
      }));
    },
    removeOptionContent(state, action) {
      state.lists = state.lists.filter(
        (item) => item.option_item_id !== action.payload
      );
    },
  },
});

export const { setOptionContents, moveList , removeOptionContent} = optionContentsSlice.actions;
export default optionContentsSlice.reducer;