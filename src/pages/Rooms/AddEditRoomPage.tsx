import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useLoaderData, useParams } from "react-router-dom";
import { equipmentActions } from "~/features/equipment";
import { floorActions, useFloor } from "~/features/floor";
import { roomActions } from "~/features/room";
import { roomTypeActions, useRoomTypes } from "~/features/roomTypes";
import { ForPage } from "~/layouts";
import { useAppDispatch } from "~/stores";
import { DashboardPaths, IRoomNumber, IRoomResponse, RoomPayload } from "~/types";
import { convertRoomNumber } from "~/utils";
import FormAddEditRoom from "./form/FormAddEditRoom";

const { HeadSeo, Container, Title, Breadcrumbs } = ForPage;

const AddEditRoomPage: FC = () => {
  const data = useLoaderData() as IRoomResponse | null;
  const { id } = useParams();
  const isAddMode = !Boolean(id);
  const [selected, setSelected] = useState<IRoomResponse | null>(null);
  const dispatch = useAppDispatch();
  const { data: roomTypesData } = useRoomTypes();
  const { data: floorsData } = useFloor();

  useEffect(() => {
    if (!data) return;
    setSelected(data);
  }, [data]);

  useEffect(() => {
    dispatch(floorActions.getDataStart({ limit: 9999, page: 1 }));
    dispatch(roomTypeActions.getDataStart({ limit: 9999, page: 1 }));
    dispatch(equipmentActions.getDataGroupsFilterStart("furniture.bed"));
  }, []);

  const titleHeadSeo = useMemo(() => (isAddMode ? "Thêm  phòng" : "Cập nhật  phòng"), [isAddMode]);

  const initialValues = useMemo((): RoomPayload => {
    if (!isAddMode && selected) {
      const beds = selected.beds?.length
        ? selected.beds.map((b) => ({ value: b.bed.id!, label: b.bed.name, quantity: b.quantity }))
        : null;

      let roomNumbers = selected.room_numbers;

      if (!roomNumbers?.length) {
        if (floorsData?.length && roomTypesData?.length) {
          const floor = floorsData.find((f) => f.id === selected.floor_id);
          const roomType = roomTypesData.find((r) => r.id === selected.room_type_id);

          if (floor && roomType) {
            const floorCharacter = floor.character;
            const roomTypeCharacter = roomType.character;

            const roomNumbersNew: IRoomNumber[] = [];

            for (let index = 0; index < +selected.room_quantity; index++) {
              const roomNumberId = `P${floorCharacter}${roomTypeCharacter}${convertRoomNumber(
                index + 1
              )}`;
              roomNumbersNew.push({ id: roomNumberId, status: "available", note: "" });
            }

            roomNumbers = roomNumbersNew;
          }
        }
      }

      return {
        id: selected.id!,
        floor_id: `${selected.floor_id}`,
        room_type_id: `${selected.room_type_id}`,
        is_public: selected.is_public,
        is_smoking: selected.is_smoking,
        is_parking: selected.is_parking,
        is_breakfast: selected.is_breakfast,
        is_pets: selected.is_pets,
        is_extra_beds: selected.is_extra_beds,
        adults: `${selected.adults}`,
        children: `${selected.children ?? ""}`,
        area: `${selected.adults ?? ""}`,
        beds: beds,
        check_in_from: `${selected.durationRoom?.check_in_from ?? "12"}`,
        check_in_to: `${selected.durationRoom?.check_in_to ?? "12"}`,
        check_out_from: `${selected.durationRoom?.check_out_from ?? "12"}`,
        check_out_to: `${selected.durationRoom?.check_out_to ?? "12"}`,
        room_quantity: `${selected.room_quantity}`,
        photo_publish: selected.photo_publish!,
        room_numbers: roomNumbers,
      };
    }

    return {
      floor_id: "",
      room_quantity: "",
      room_type_id: "",
      is_public: 1,
      is_smoking: 0,
      is_parking: 0,
      is_breakfast: 0,
      is_pets: 0,
      is_extra_beds: 0,
      adults: "",
      children: "",
      area: "",
      beds: null,
      check_in_from: "12",
      check_in_to: "12",
      check_out_from: "12",
      check_out_to: "12",
      photo_publish: "",
      room_numbers: [],
    };
  }, [isAddMode, selected, roomTypesData, floorsData]);

  const handleSubmit = useCallback(
    (values: RoomPayload) => {
      const { ...others } = values;

      if (isAddMode) {
        dispatch(
          roomActions.addDataStart({
            ...others,
            check_in_from: `${others.check_in_from}`,
            check_out_from: `${others.check_out_from}`,
            check_in_to: `${others.check_in_to}`,
            check_out_to: `${others.check_out_to}`,
            adults: +others.adults,
            area: +others.area,
            beds: others.beds!,
            children: others.children ? +others.children : 0,
            floor_id: +others.floor_id,
            room_type_id: +others.room_type_id,
            room_quantity: +others.room_quantity,
            is_public: others.is_public ? 1 : 0,
          })
        );
        return;
      }

      dispatch(
        roomActions.editDataStart({
          ...others,
          check_in_from: `${others.check_in_from}`,
          check_out_from: `${others.check_out_from}`,
          check_in_to: `${others.check_in_to}`,
          check_out_to: `${others.check_out_to}`,
          adults: +others.adults,
          area: +others.area,
          beds: others.beds!,
          children: others.children ? +others.children : 0,
          floor_id: +others.floor_id,
          room_type_id: +others.room_type_id,
          room_quantity: +others.room_quantity,
          is_public: others.is_public ? 1 : 0,
        })
      );
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
          data={[{ label: "Dang sách phòng", to: DashboardPaths.Room }, { label: titleHeadSeo }]}
          mb={5}
        />

        <FormAddEditRoom
          defaultValuesImages={initialValues.photo_publish ? [initialValues.photo_publish] : []}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          textButton={text.text}
        />
      </Container>
    </ForPage>
  );
};

export default AddEditRoomPage;
