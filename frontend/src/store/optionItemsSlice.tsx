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
interface OptionCardProps {
    option_card_id: number;
    option_item_id: number;
    option_card_image_id: number;
    option_card_title: Descendant[]; // JSON
    option_card_description: Descendant[]; // JSON
    created_at: string;
    updated_at: string;
    option_item_sort_index: number;
  }

interface OptionItemsState {
  contents: OptionContentProps[],
  cards: OptionCardProps[],
};

const initialState: OptionItemsState = {
  contents: [],
  cards: [],
}


export const optionItemsSlice = createSlice({
  name: 'optionItems',
  initialState,
  reducers: {
    setOptionItems: (state, action: PayloadAction<OptionItemsState>) => {
      state.contents = action.payload.contents;
      state.cards = action.payload.cards;
    },
    moveList: (
      state,
      action: PayloadAction<{ from_index: number; to_index: number }>
    ) => {
      const { from_index, to_index } = action.payload;
      const updatedContents = [...state.contents];
      const [movedContent] = updatedContents.splice(from_index, 1);
      updatedContents.splice(to_index, 0, movedContent);

      const updatedCards = [...state.cards];
      const [movedCard] = updatedCards.splice(from_index, 1);
      updatedCards.splice(to_index, 0, movedCard);

      state.contents = updatedContents.map((item, index) => ({
        ...item,
        option_item_sort_index: index + 1,
      }));
      state.cards = updatedCards.map((item, index) => ({
        ...item,
        option_item_sort_index: index + 1,
      }));
    },
    removeOptionContent(state, action) {
      state.contents = state.contents.filter(
        (item) => item.option_item_id !== action.payload
      );
      state.cards = state.cards.filter(
        (item) => item.option_item_id !== action.payload
      );
    },
  },
});

export const { setOptionItems, moveList , removeOptionContent} = optionItemsSlice.actions;
export default optionItemsSlice.reducer;