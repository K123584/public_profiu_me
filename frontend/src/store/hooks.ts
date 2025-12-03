import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store";


export const useAppDispatch = () => useDispatch<AppDispatch>();
//useSelectorに型推論を使用するためuseAppSelectorを作成
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;