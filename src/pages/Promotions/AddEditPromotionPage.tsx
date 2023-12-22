import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useLoaderData, useParams } from "react-router-dom";
import { discountActions } from "~/features/discount";
import { floorActions } from "~/features/floor";
import { roomTypeActions } from "~/features/roomTypes";
import { ForPage } from "~/layouts";
import { useAppDispatch } from "~/stores";
import { DashboardPaths, DiscountPayload, IDiscount } from "~/types";
import FormAddEditDiscount from "./form/FormAddEditDiscount";

const { HeadSeo, Container, Title, Breadcrumbs } = ForPage;

const AddEditPromotionPage: FC = () => {
  const data = useLoaderData() as IDiscount | null;
  const { id } = useParams();
  const isAddMode = !Boolean(id);
  const [selected, setSelected] = useState<IDiscount | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!data) return;
    setSelected(data);
  }, [data]);

  useEffect(() => {
    dispatch(floorActions.getDataStart({ limit: 100, page: 1 }));
    dispatch(roomTypeActions.getDataStart({ limit: 100, page: 1 }));
  }, []);

  const titleHeadSeo = useMemo(
    () => (isAddMode ? "Thêm mã khuyến mãi" : "Cập nhật mã khuyến mã"),
    [isAddMode]
  );

  const initialValues = useMemo((): DiscountPayload => {
    if (!isAddMode && selected) {
      return {
        is_public: false,
        num_discount: "",
        percent_discount: "",
        price_discount: "",
        time_end: "",
        time_start: "",
        type: "",
      };
    }

    return {
      is_public: false,
      num_discount: "",
      percent_discount: "",
      price_discount: "",
      time_end: "",
      time_start: "",
      type: "",
    };
  }, [isAddMode, selected]);

  const handleSubmit = useCallback(
    (values: DiscountPayload) => {
      console.log(`values`, values);

      if (isAddMode) {
        dispatch(discountActions.addDataStart(values));
        return;
      }

      dispatch(discountActions.editDataStart(values));
    },
    [isAddMode, selected]
  );

  const text = useMemo(() => {
    if (!isAddMode) {
      return {
        text: "Lưu thay đổi",
        title: `Cập nhật \`${selected?.id}\``,
      };
    }

    return {
      text: "Tạo mới",
      title: `Thêm mới`,
    };
  }, [isAddMode, selected]);

  return (
    <ForPage>
      <HeadSeo title={titleHeadSeo} />
      <Container maxWidth="lg">
        <Title title={titleHeadSeo} mb={2} />

        <Breadcrumbs
          data={[
            { label: "Dang sách mã khuyến mãi", to: DashboardPaths.Promotion },
            { label: titleHeadSeo },
          ]}
          mb={5}
        />

        <FormAddEditDiscount
          initialValues={initialValues}
          onSubmit={handleSubmit}
          textButton={text.text}
        />
      </Container>
    </ForPage>
  );
};

export default AddEditPromotionPage;
