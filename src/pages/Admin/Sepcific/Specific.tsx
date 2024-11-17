import { useQuery } from "@tanstack/react-query";
import staticApi from "../../../apis/static.api";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart } from "chart.js/auto";
import { CategoryScale } from "chart.js";
import Flavor from "./Flavor";
import Category from "./Category";
import Characteric from "./Characteric";
export default function Specific() {
  return (
    <div className="container">
      <Flavor />
      <Category />
      <Characteric />
    </div>
  );
}
