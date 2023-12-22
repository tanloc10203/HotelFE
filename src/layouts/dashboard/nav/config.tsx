import { Iconify } from "~/components/ui/iconify";
import { DashboardPaths, INavConfig } from "~/types";

// ----------------------------------------------------------------------

const icon = (name: string, color = "default") => (
  <Iconify icon={name} sx={{ width: 1, color: color, height: 1 }} />
);

export const navConfigOwner: Array<INavConfig> = [
  {
    title: "Bảng điều khiển",
    path: DashboardPaths.DashboardApp,
    icon: icon("fxemoji:cop"),
  },
  {
    title: "Lễ tân",
    path: DashboardPaths.FrontDesk,
    icon: icon("ic:baseline-desk"),
  },
  {
    title: "Giao dịch",
    icon: icon("ant-design:transaction-outlined"),
    children: [
      {
        path: DashboardPaths.ImportProduct,
        icon: icon("clarity:import-solid"),
        title: "Nhập hàng",
      },
    ],
  },
  {
    title: "Quản lý công tác",
    icon: icon("carbon:operations-field"),
    children: [
      {
        path: DashboardPaths.Position,
        icon: icon("gis:position-man"),
        title: "Quản lý chức vụ",
      },
      {
        path: DashboardPaths.Department,
        icon: icon("mingcute:department-fill"),
        title: "Quản lý bộ phận",
      },
    ],
  },
  {
    title: "Quản lý khách hàng",
    icon: icon("twemoji:busts-in-silhouette"),
    children: [
      // {
      //   path: DashboardPaths.CustomerTypes,
      //   icon: icon("material-symbols:category-rounded"),
      //   title: "Danh mục khách hàng",
      // },
      {
        path: DashboardPaths.Customer,
        icon: icon("material-symbols:list"),
        title: "Danh sách khách hàng",
      },
      // {
      //   path: DashboardPaths.AddCustomer,
      //   icon: icon("ic:round-plus"),
      //   title: "Thêm khách hàng",
      // },
    ],
  },
  {
    title: "Quản lý nhân viên",
    icon: icon("clarity:employee-group-line"),
    children: [
      {
        path: DashboardPaths.Employee,
        icon: icon("material-symbols:list"),
        title: "Danh sách nhân viên",
      },
      {
        path: DashboardPaths.AddEmployee,
        icon: icon("ic:round-plus"),
        title: "Thêm nhân viên",
      },
    ],
  },
  {
    title: "Phân quyền",
    icon: icon("arcticons:permissionsmanager"),
    children: [
      {
        path: DashboardPaths.Permission,
        icon: icon("fluent-mdl2:permissions"),
        title: "Quản lý quyền",
      },
      {
        path: DashboardPaths.Role,
        icon: icon("carbon:user-role"),
        title: "Quản lý vai trò",
      },
      {
        path: DashboardPaths.RoleEmployee,
        icon: icon("icon-park-solid:permissions"),
        title: "Phân quyền nhân viên",
      },
    ],
  },
  // {
  //   icon: icon("material-symbols:floor"),
  //   title: "Danh mục tầng",
  //   path: DashboardPaths.Floor,
  // children: [
  //   {
  //     path: DashboardPaths.Floor,
  //     icon: icon("material-symbols:list"),
  //     title: "Danh sách tầng",
  //   },
  //   {
  //     path: DashboardPaths.AddFloor,
  //     icon: icon("ic:sharp-discount"),
  //     title: "Thêm tầng",
  //   },
  // ],
  // },
  // {
  //   title: "Quản lý khuyển mãi",
  //   icon: icon("flat-color-icons:sales-performance"),
  //   children: [
  //     {
  //       path: DashboardPaths.PromotionTypes,
  //       icon: icon("arcticons:service-victoria"),
  //       title: "Loại khuyễn mãi",
  //     },
  //     {
  //       path: DashboardPaths.Promotion,
  //       icon: icon("material-symbols:list"),
  //       title: "Danh sách khuyến mãi",
  //     },
  //     {
  //       path: DashboardPaths.AddPromotion,
  //       icon: icon("ic:round-plus"),
  //       title: "Thêm khuyến mãi",
  //     },
  //     {
  //       path: DashboardPaths.Voucher,
  //       icon: icon("mdi:voucher"),
  //       title: "Danh sách Voucher",
  //     },
  //     {
  //       path: DashboardPaths.AddVoucher,
  //       icon: icon("mdi:tag-add"),
  //       title: "Thêm voucher",
  //     },
  //   ],
  // },
  {
    title: "Quản lý đánh giá",
    path: DashboardPaths.Review,
    icon: icon("material-symbols:rate-review-outline-sharp"),
  },
  {
    title: "Thông tin khách sạn",
    path: DashboardPaths.InformationHotel,
    icon: icon("fluent-emoji-flat:information"),
  },
];

export const navConfigEmployee: Array<INavConfig> = [
  {
    title: "Bảng điều khiển",
    path: DashboardPaths.DashboardApp,
    icon: icon("fxemoji:cop"),
  },
  {
    title: "Lễ tân",
    path: DashboardPaths.FrontDesk,
    icon: icon("ic:baseline-desk"),
  },
  {
    title: "Giao dịch",
    icon: icon("ant-design:transaction-outlined"),
    children: [
      {
        path: DashboardPaths.ImportProduct,
        icon: icon("clarity:import-solid"),
        title: "Nhập hàng",
      },
    ],
  },
  {
    title: "Quản lý công tác",
    icon: icon("carbon:operations-field"),
    children: [
      {
        path: DashboardPaths.Position,
        icon: icon("gis:position-man"),
        title: "Quản lý chức vụ",
      },
      {
        path: DashboardPaths.Department,
        icon: icon("mingcute:department-fill"),
        title: "Quản lý bộ phận",
      },
    ],
  },
  {
    title: "Quản lý nhân viên",
    icon: icon("clarity:employee-group-line"),
    children: [
      {
        path: DashboardPaths.Employee,
        icon: icon("material-symbols:list"),
        title: "Danh sách nhân viên",
      },
      {
        path: DashboardPaths.AddEmployee,
        icon: icon("ic:round-plus"),
        title: "Thêm nhân viên",
      },
    ],
  },
  {
    title: "Quản lý khách hàng",
    icon: icon("twemoji:busts-in-silhouette"),
    children: [
      {
        path: DashboardPaths.CustomerTypes,
        icon: icon("material-symbols:category-rounded"),
        title: "Danh mục khách hàng",
      },
      {
        path: DashboardPaths.Customer,
        icon: icon("material-symbols:list"),
        title: "Danh sách khách hàng",
      },
      {
        path: DashboardPaths.AddCustomer,
        icon: icon("ic:round-plus"),
        title: "Thêm khách hàng",
      },
    ],
  },
  // {
  // icon: icon("material-symbols:floor"),
  // title: "Danh mục tầng",
  // path: DashboardPaths.Floor,
  // children: [
  //   {
  //     path: DashboardPaths.Floor,
  //     icon: icon("material-symbols:list"),
  //     title: "Danh sách tầng",
  //   },
  //   {
  //     path: DashboardPaths.AddFloor,
  //     icon: icon("ic:sharp-discount"),
  //     title: "Thêm tầng",
  //   },
  // ],
  // },
  {
    title: "Quản lý phòng",
    icon: icon("emojione:bed"),
    children: [
      {
        path: DashboardPaths.RoomTypes,
        icon: icon("material-symbols:nest-multi-room"),
        title: "Loại phòng",
      },
      {
        path: DashboardPaths.SetupPriceList,
        icon: icon("material-symbols:price-change-outline-rounded"),
        title: "Thiết lập giá",
      },
      {
        path: DashboardPaths.Room,
        icon: icon("material-symbols:list"),
        title: "Danh sách phòng",
      },
      {
        path: DashboardPaths.AddRoom,
        icon: icon("ic:round-plus"),
        title: "Thêm phòng",
      },
    ],
  },
  {
    title: "Quản lý tiện nghi",
    icon: icon("twemoji:smiling-face-with-sunglasses"),
    children: [
      {
        path: DashboardPaths.AmenityTypes,
        icon: icon("mdi:emoticon"),
        title: "Loại tiện nghi",
      },
      {
        path: DashboardPaths.Amenity,
        icon: icon("material-symbols:list"),
        title: "Danh sách tiện nghi",
      },
      // {
      //   path: DashboardPaths.AddAmenity,
      //   icon: icon("ic:round-plus"),
      //   title: "Thêm tiện nghi",
      // },
    ],
  },
  {
    title: "Quản lý thiết bị",
    icon: icon("icon-park:setting"),
    children: [
      {
        path: DashboardPaths.EquipmentTypes,
        icon: icon("ic:sharp-settings-suggest"),
        title: "Loại thiết bị",
      },
      {
        path: DashboardPaths.Equipment,
        icon: icon("material-symbols:list"),
        title: "Danh sách thiết bị",
      },
      // {
      //   path: DashboardPaths.AddEquipment,
      //   icon: icon("ic:round-plus"),
      //   title: "Thêm thiết bị",
      // },
    ],
  },
  // {
  //   title: "Quản lý bài viết",
  //   icon: icon("twemoji:letter-p"),
  //   children: [
  //     {
  //       path: DashboardPaths.PostCategory,
  //       icon: icon("tabler:category-filled"),
  //       title: "Danh mục bài viết",
  //     },
  //     {
  //       path: DashboardPaths.Post,
  //       icon: icon("material-symbols:list"),
  //       title: "Danh sách bài viết",
  //     },
  //     {
  //       path: DashboardPaths.AddPost,
  //       icon: icon("ic:round-plus"),
  //       title: "Thêm bài viết",
  //     },
  //   ],
  // },
  {
    title: "Quản lý dịch vụ",
    icon: icon("vscode-icons:folder-type-services-opened"),
    children: [
      {
        path: DashboardPaths.ServiceTypes,
        icon: icon("arcticons:service-victoria"),
        title: "Loại dịch vụ",
      },
      {
        path: DashboardPaths.Service,
        icon: icon("material-symbols:list"),
        title: "Danh sách dịch vụ",
      },
      // {
      //   path: DashboardPaths.AddService,
      //   icon: icon("ic:round-plus"),
      //   title: "Thêm dịch vụ",
      // },
    ],
  },
  // {
  //   title: "Quản lý khuyển mãi",
  //   icon: icon("flat-color-icons:sales-performance"),
  //   children: [
  //     {
  //       path: DashboardPaths.PromotionTypes,
  //       icon: icon("arcticons:service-victoria"),
  //       title: "Loại khuyễn mãi",
  //     },
  //     {
  //       path: DashboardPaths.Promotion,
  //       icon: icon("material-symbols:list"),
  //       title: "Danh sách khuyến mãi",
  //     },
  //     {
  //       path: DashboardPaths.AddPromotion,
  //       icon: icon("ic:round-plus"),
  //       title: "Thêm khuyến mãi",
  //     },
  //     {
  //       path: DashboardPaths.Voucher,
  //       icon: icon("mdi:voucher"),
  //       title: "Danh sách Voucher",
  //     },
  //     {
  //       path: DashboardPaths.AddVoucher,
  //       icon: icon("mdi:tag-add"),
  //       title: "Thêm voucher",
  //     },
  //   ],
  // },
  // {
  //   title: "Quản lý đặt phòng",
  //   path: DashboardPaths.Booking,
  //   icon: icon("tabler:brand-booking", Colors.Blue),
  // },
  {
    title: "Quản lý đánh giá",
    path: DashboardPaths.Review,
    icon: icon("material-symbols:rate-review-outline-sharp"),
  },
  {
    title: "Thông tin khách sạn",
    path: DashboardPaths.InformationHotel,
    icon: icon("fluent-emoji-flat:information"),
  },
];
