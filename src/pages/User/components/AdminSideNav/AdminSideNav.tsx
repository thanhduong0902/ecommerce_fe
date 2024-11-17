import classNames from "classnames";
import { useContext, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import path from "../../../../constants/path";
import { getAvatarUrl } from "../../../../utils/utils";
import { AppContext } from "../../../../context/app.context";
import "./style.css";
import MenuNav from "./MenuNav";
export default function AdminSideNav() {
  const location = useLocation();
  const { profile } = useContext(AppContext);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSubMenu = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="">
      <MenuNav />
    </div>
  );
}
