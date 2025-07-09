"use client";

import { type FC } from "react";
import GreetingCard from "./_components/greeting-card";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div>
      <GreetingCard />
    </div>
  );
};

export default page;
