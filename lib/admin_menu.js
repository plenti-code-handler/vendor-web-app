import {
  dashboardIconSvgWhite,
  dashboardIconSvgActive,
  usersIconSvgActive,
  usersIconSvgWhite,
  approvalSvgActive,
  approvalSvgWhite,
  transactionSvgActive,
  transactionSvgWhite,
  categoriesSvgActive,
  categoriesSvgWhite,
} from "../svgs";

export const menuItemsData = [
  {
    name: "Dashboard",
    href: "/admin",
    activeSvg: dashboardIconSvgWhite,
    inactiveSvg: dashboardIconSvgActive,
  },
  {
    name: "Users",
    href: "/admin/users",
    activeSvg: usersIconSvgWhite,
    inactiveSvg: usersIconSvgActive,
  },
  {
    name: "Approvals",
    href: "/admin/approvals",
    activeSvg: approvalSvgActive,
    inactiveSvg: approvalSvgWhite,
  },
  {
    name: "Transactions",
    href: "/admin/transactions",
    activeSvg: transactionSvgActive,
    inactiveSvg: transactionSvgWhite,
  },
  {
    name: "Categories",
    href: "/admin/categories",
    activeSvg: categoriesSvgActive,
    inactiveSvg: categoriesSvgWhite,
  },
];
