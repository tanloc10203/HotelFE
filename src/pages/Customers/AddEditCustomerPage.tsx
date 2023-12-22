import { useParams } from "react-router-dom";
import { ForPage } from "~/layouts";
import { useMemo } from "react";
import { FormAddEditCustomer } from "./form";
import { Customer } from "~/types";

const { HeadSeo, Container, Title } = ForPage;

const AddEditCustomerPage = () => {
  const { id } = useParams();
  const isAddMode = !Boolean(id);

  const titleHeadSeo = useMemo(
    () => (isAddMode ? "Thêm khách hàng" : "Cập nhật khách hàng"),
    [isAddMode]
  );

  console.log(`isAddMode`, isAddMode);

  const initialValues: Customer = {
    first_name: "",
    last_name: "",
    password: "",
    phone_number: "",
    email: "",
  };

  const handleSubmit = (values: Customer) => {
    alert(JSON.stringify(values, null, 4));
  };

  return (
    <ForPage>
      <HeadSeo title={titleHeadSeo} />
      <Container>
        <Title title={titleHeadSeo} />
        <FormAddEditCustomer initialValues={initialValues} onSubmit={handleSubmit} />
      </Container>
    </ForPage>
  );
};

export default AddEditCustomerPage;
