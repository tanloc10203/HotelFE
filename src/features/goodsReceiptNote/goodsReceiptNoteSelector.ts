import { useAppSelector } from "~/stores";

export const useGoodsReceiptNoteSelector = () => useAppSelector((state) => state.goodsReceiptNote);
