import {
    LayoutDashboard,
    Users,
    Receipt,
    HandCoins,
    User,
    Settings
} from "lucide-react";

import { ROUTES } from "./routes";

export const NAVIGATION = [

    {
        title: "Dashboard",
        icon: LayoutDashboard,
        path: ROUTES.DASHBOARD
    },

    {
        title: "Groups",
        icon: Users,
        path: ROUTES.GROUPS
    },

    {
        title: "Expenses",
        icon: Receipt,
        path: ROUTES.EXPENSES
    },

    {
        title: "Settlements",
        icon: HandCoins,
        path: ROUTES.SETTLEMENTS
    },

    {
        title: "Profile",
        icon: User,
        path: ROUTES.PROFILE
    },

    {
        title: "Settings",
        icon: Settings,
        path: ROUTES.SETTINGS
    }

];

export default NAVIGATION;
