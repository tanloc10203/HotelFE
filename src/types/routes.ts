export enum DashboardPaths {
  /** Dashboard */
  Dashboard = "/dashboard",
  DashboardApp = "/dashboard/app",

  /** Front desk */
  FrontDesk = "/dashboard/front-desk",

  /** Transaction */
  ImportProduct = "/dashboard/transaction/import-product",

  /** Customers */
  Customer = "/dashboard/customers",
  CustomerTypes = "/dashboard/customers/types",
  AddCustomer = "/dashboard/customers/add",
  UpdateCustomer = "/dashboard/customers/update",

  /** Employees */
  Employee = "/dashboard/employees",
  EmployeeTypes = "/dashboard/employees/types",
  AddEmployee = "/dashboard/employees/add",
  UpdateEmployee = "/dashboard/employees/update",

  /** Floors */
  Floor = "/dashboard/floors",
  AddFloor = "/dashboard/floors/add",
  UpdateFloor = "/dashboard/floors/update",

  /** Rooms */
  Room = "/dashboard/rooms",
  AddRoom = "/dashboard/rooms/add",
  UpdateRoom = "/dashboard/rooms/update",

  /** RoomTypes */
  RoomTypes = "/dashboard/rooms/types",
  RoomTypesTrash = "/dashboard/rooms/types",
  AddRoomTypes = "/dashboard/rooms/types/add",
  EditRoomTypes = "/dashboard/rooms/types/edit",

  /** Amenities - Tiện nghi */
  Amenity = "/dashboard/amenities",
  AmenityTrash = "/dashboard/amenities",
  AmenityTypes = "/dashboard/amenities/types",
  AmenityTypesTrash = "/dashboard/amenities/types",
  AddAmenity = "/dashboard/amenities/add",
  UpdateAmenity = "/dashboard/amenities/update",

  /** Equipments - Thiết bị */
  Equipment = "/dashboard/equipments",
  EquipmentTrash = "/dashboard/equipments",
  EquipmentTypes = "/dashboard/equipments/types",
  AddEquipment = "/dashboard/equipments/add",
  UpdateEquipment = "/dashboard/equipments/update",

  /** Posts - Bài viết */
  Post = "/dashboard/posts",
  PostCategory = "/dashboard/posts/categories",
  AddPost = "/dashboard/posts/add",
  UpdatePost = "/dashboard/posts/update",

  /** Services - Dịch vụ */
  Service = "/dashboard/services",
  ServiceTypes = "/dashboard/services/types",
  AddService = "/dashboard/services/add",
  UpdateService = "/dashboard/services/update",

  /** Promotions - Khuyến mãi */
  Promotion = "/dashboard/promotion",
  PromotionTypes = "/dashboard/promotion/types",
  AddPromotion = "/dashboard/promotion/add",
  UpdatePromotion = "/dashboard/promotion/update",

  /** Vouchers - Voucher */
  Voucher = "/dashboard/vouchers",
  AddVoucher = "/dashboard/vouchers/add",
  UpdateVoucher = "/dashboard/vouchers/update",

  /** Bookings - Đặt phòng */
  Booking = "/dashboard/bookings",

  /** Reviews - Đánh giá */
  Review = "/dashboard/review-rate",

  /** InformationHotel - Thông tin khách sạn */
  InformationHotel = "/dashboard/information-hotel",

  /** Auth */
  ChangePassword = "/dashboard/change-password",
  Profile = "/dashboard/profile",

  /** Permission and Role */
  Permission = "/dashboard/permissions",
  Role = "/dashboard/roles",
  AddRole = "/dashboard/roles/add",
  EditRole = "/dashboard/roles/update",
  RoleEmployee = "/dashboard/employee/roles",

  /** Forbidden Page */
  Forbidden = "/dashboard/forbidden",

  /** Positions */
  Position = "/dashboard/positions",

  /** Department */
  Department = "/dashboard/department",

  /** SetupPriceList */
  SetupPriceList = "/dashboard/setup-price-list",
}

export enum SinglePaths {
  LoginOwner = "/owner/login",
  LoginEmployee = "/login",
  ErrorBoundary = "/404",
  ResetPassword = "/reset/password",
  Any = "*",
}
