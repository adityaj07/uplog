import { getGreeting } from "@/utils/getGreeting";
import { type FC } from "react";

interface GreetingCardProps {}

const GreetingCard: FC<GreetingCardProps> = ({}) => {
  return (
    <div className="space-y-2">
      <h1 className="font-dosis text-2xl font-bold text-gray-900 dark:text-gray-100">
        {getGreeting()}, {"currentWorkspace.ownerName.split()[0]"} 👋
      </h1>
    </div>
  );
};

export default GreetingCard;
