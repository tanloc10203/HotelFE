import { Stack, Typography } from "@mui/material";
import { FC, useMemo } from "react";
import { LazyLoading } from "~/components";
import { ImportProductDataType } from "~/types";
import { fNumber } from "~/utils";

type ProductItemProps = {
  alignment: string;
  onToggleHoverId?: (value: string) => void;
  hoverId?: string;
  onSelected?: (item: ImportProductDataType) => void;
} & ImportProductDataType;

const ProductItem: FC<ProductItemProps> = (props) => {
  const { alignment, hoverId, onToggleHoverId, onSelected, ...data } = props;

  const quantityInStock = useMemo(() => {
    if (!props.unit_is_default) {
      const quantityParser = props.unit_quantity || 1;
      const unitData = [...(props?.units || [])];

      if (quantityParser === 1) return props.unit_quantity_in_stock;

      const unitDefault = unitData.find((t) => t.is_default);

      if (!unitDefault) return 0;

      const totalStock = Math.floor(Number(unitDefault.quantity_in_stock) / quantityParser);

      return totalStock;
    }

    return props.unit_quantity_in_stock || 0;
  }, [props]);

  return (
    <Stack
      onClick={() => onSelected?.(data)}
      flexDirection={"row"}
      width={"50%"}
      gap={1}
      sx={{
        transition: "all 0.25s ease-in-out 0s",
        cursor: "pointer",
        borderRadius: 2,
        p: 1.2,
        "&:hover": {
          boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);",
        },
      }}
      onMouseMove={
        alignment !== "service" ? () => onToggleHoverId?.(props.unit_service_id) : undefined
      }
      onMouseLeave={alignment !== "service" ? () => onToggleHoverId?.("") : undefined}
    >
      <Stack
        height={80}
        width={80}
        borderRadius={"4px"}
        alignItems={"center"}
        justifyContent={"center"}
        position={"relative"}
        overflow={"hidden"}
      >
        <LazyLoading
          src={props.photo_public!}
          sxBox={{
            width: 80,
            height: 80,
            borderRadius: "4px",
            border: (theme) => `1px dashed ${theme.palette.grey[800]}`,
          }}
          sxImage={{ borderRadius: "4px", background: "gray" }}
        />
        <Stack
          position="absolute"
          zIndex={(theme) => theme.zIndex.modal + 1}
          bottom={hoverId === props.unit_service_id ? 0 : -100}
          sx={{
            background: "rgba(0, 0, 0, 0.4)",
            transition: "all 0.35s ease-in-out",
          }}
          width={"100%"}
          height={"100%"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Stack
            sx={{
              background: (theme) => theme.palette.success.main,
              width: 30,
              height: 30,
              borderRadius: "50%",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            }}
          >
            <Typography fontSize={14} fontWeight={700}>
              {quantityInStock}
            </Typography>
          </Stack>
        </Stack>
      </Stack>

      <Stack flex={1}>
        <Typography fontSize={13} fontWeight={700}>
          {`${props.name} (${props.unit_name})`}
        </Typography>
        <Typography fontSize={12}>{`${fNumber(
          Number(props.unit_quantity) > 1
            ? Number(props.priceData?.price_sell!) * Number(props.unit_quantity)
            : Number(props.priceData?.price_sell!)
        )}/${props.unit_name}`}</Typography>
      </Stack>
    </Stack>
  );
};

export default ProductItem;
