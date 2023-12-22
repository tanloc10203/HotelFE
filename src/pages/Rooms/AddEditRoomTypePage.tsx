import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useLoaderData, useParams } from "react-router-dom";
import { amenityActions } from "~/features/amenity";
import { equipmentActions } from "~/features/equipment";
import { ForPage } from "~/layouts";
import { useAppDispatch } from "~/stores";
import { DashboardPaths, IRoomTypePayload, IRoomTypePayloadEdit, IRoomTypeResponse } from "~/types";
import FormAddEditRoomType, {
  ChangeValuePayload,
  ValuesProperty,
} from "./form/FormAddEditRoomType";
import { roomTypeActions } from "~/features/roomTypes";
import { appActions } from "~/features/app";

const { HeadSeo, Container, Title, Breadcrumbs } = ForPage;

const AddEditRoomTypePage: FC = () => {
  const data = useLoaderData() as IRoomTypeResponse | null;
  const { id } = useParams();
  const isAddMode = !Boolean(id);
  const [selected, setSelected] = useState<IRoomTypeResponse | null>(null);
  const [values, setValues] = useState<ValuesProperty>({ equipments: [], amenities: [] });
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!data) return;
    setSelected(data);
  }, [data]);

  useEffect(() => {
    dispatch(amenityActions.getDataStart({ limit: 100, page: 1 }));
    dispatch(equipmentActions.getDataStart({ limit: 100, page: 1 }));
  }, []);

  const titleHeadSeo = useMemo(
    () => (isAddMode ? "Thêm loại phòng" : "Cập nhật loại phòng"),
    [isAddMode]
  );

  const initialValues = useMemo((): IRoomTypePayload => {
    if (!isAddMode && selected) {
      setValues({
        equipments: selected?.equipments ? selected?.equipments : [],
        amenities: selected?.amenities ? selected?.amenities : [],
      });

      return {
        images: selected?.images?.length ? selected?.images.map((v) => v.src) : null,
        id: selected?.id!,
        desc: selected?.desc,
        name: selected?.name,
        character: selected?.character,
        amenities: selected?.amenities?.length
          ? selected?.amenities?.map((a) => ({ id: a.id! }))
          : null,
        equipments: selected?.equipments?.length
          ? selected?.equipments?.map((a) => ({ id: a.id! }))
          : null,
      };
    }

    return {
      desc: "",
      name: "",
      character: "",
      amenities: null,
      equipments: null,
      images: null,
    };
  }, [isAddMode, selected]);

  const handleSubmit = useCallback(
    (values: IRoomTypePayload | IRoomTypePayloadEdit) => {
      const { removeImages, ...others } = values as IRoomTypePayloadEdit;

      dispatch(appActions.openOverplay());

      if (!isAddMode && selected) {
        // @ts-ignore
        const removes = selected.images.filter((s) => removeImages?.includes(s.src));

        dispatch(
          roomTypeActions.editDataStart({
            ...values,
            removeImages: removes.map((r) => ({ id: r.id! })),
          })
        );
        return;
      }

      dispatch(roomTypeActions.addDataStart({ ...others } as IRoomTypePayload));
    },
    [isAddMode, selected]
  );

  const text = useMemo(() => {
    if (!isAddMode) {
      return {
        text: "Lưu thay đổi",
        title: `Cập nhật \`${selected?.name}\``,
      };
    }

    return {
      text: "Tạo mới",
      title: `Thêm mới`,
    };
  }, [isAddMode, selected]);

  const handleChangeValue = useCallback(async ({ data, type }: ChangeValuePayload) => {
    setValues((prev) => ({ ...prev, [type]: data }));
  }, []);

  return (
    <ForPage>
      <HeadSeo title={titleHeadSeo} />
      <Container maxWidth="lg">
        <Title title={titleHeadSeo} mb={2} />

        <Breadcrumbs
          data={[
            { label: "Dang sách loại phòng", to: DashboardPaths.RoomTypes },
            { label: titleHeadSeo },
          ]}
          mb={5}
        />

        <FormAddEditRoomType
          defaultValuesImages={selected?.images ? selected.images.map((i) => i.src) : []}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          textButton={text.text}
          values={values}
          onChangeValues={handleChangeValue}
        />
      </Container>
    </ForPage>
  );
};

export default AddEditRoomTypePage;
