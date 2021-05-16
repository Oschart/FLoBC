/*!

=========================================================
* Black Dashboard React v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import InitializationPage from "./components/InitializationPage";
import StatusPage from "./components/StatusPage";

var routes = [
  {
    path: "/monitor",
    name: "System Monitor",
    icon: "tim-icons icon-chart-pie-36",
    component: StatusPage,
    layout: "/admin",
  },
  {
    path: "/spawn",
    name: "Spawn Page",
    icon: "tim-icons icon-chart-pie-36",
    component: InitializationPage,
    layout: "/admin",
  },
  
];
export default routes;
