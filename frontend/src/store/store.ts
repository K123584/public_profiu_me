import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice';
import { optionContentsSlice } from "./optionContentsSlice";
import { headerSlice } from "./HeaderSlice";
import { backgroundSlice } from "./backgroundSlice";
import { optionItemsSlice } from "./optionItemsSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        optionItems: optionItemsSlice.reducer,
        optionContents:  optionContentsSlice.reducer,
        header: headerSlice.reducer,
        background: backgroundSlice.reducer,
    }
})

// Reduxのstoreの全体の型: RootState
export type RootState = ReturnType<typeof store.getState>;
//dispatchは型推論が効かないが、AppDispatchを使うことで型推論が効く(型checkのため使用)
export type AppDispatch = typeof store.dispatch;

export default store;