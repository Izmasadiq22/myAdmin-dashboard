const orderSchema = {
    name: "order",
    type: "document",
    title: "Order",
    fields: [
      {
        name: "firstName",
        title: "First Name",
        type: "string",
      },
      {
        name: "lastName",
        title: "Last Name",
        type: "string",
      },
      {
        name: "country",
        title: "Country",
        type: "string",
      },
      {
        name: "streetAddress",
        title: "Street Address",
        type: "string",
      },
      {
        name: "city",
        title: "City",
        type: "string",
      },
      {
        name: "province",
        title: "Province",
        type: "string",
      },
      {
        name: "zipCode",
        title: "Zip Code",
        type: "string",
      },
      {
        name: "phoneNumber",
        title: "Phone Number",
        type: "string",
      },
      {
        name: "emailAddress",
        title: "Email Address",
        type: "string",
      },
      {
        name: "discount",
        title: "Discount",
        type: "number",
      },
      {
        name: "cartItems",
        title: "Cart Items",
        type: "array",
        of: [{ type: "reference", to: [{ type: "product" }] }],
      },
      {
        name: "total",
        title: "Total",
        type: "number",
      },
      {
        name: "status",
        title: "Order Status",
        type: "string",
        options: {
          list: [
            { title: "Pending", value: "pending" },
            { title: "Success", value: "success" },
            { title: "Dispatch", value: "dispatch" },
          ],
          layout: "radio",
        },
        initialValue: "pending",
      },
    ],
  };
  
  export default orderSchema;
  