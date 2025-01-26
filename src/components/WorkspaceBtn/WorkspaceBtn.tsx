import { v4 as uuidv4 } from "uuid";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus } from "lucide-react";
import { USER_TYPE, WORKSPACE_TYPE } from "@/types";
import { formatTimeStampDate, getFirstLetterUppercase } from "@/lib/utils";
import Link from "next/link";
import { Timestamp } from "firebase/firestore";

interface PropType {
  isCreated: boolean;
  workspace?: WORKSPACE_TYPE;
  onClick: () => void;
}

const WorkspaceBtn = (props: PropType) => {
  const { isCreated, workspace, onClick } = props;

  return (
    <>
      {isCreated ? (
        <Card
          className="w-[300px] h-[300px] border-dashed hover:cursor-pointer"
          onClick={onClick}
        >
          <CardContent className="h-full p-6 flex flex-col justify-center items-center gap-3">
            <Plus size={35} />

            <h1 className="font-semibold text-gray-600 dark:text-gray-300">
              Create a workspace
            </h1>

            <span className="text-[0.75rem] text-gray-500 dark:text-gray-400">
              eg: chill-workspace
            </span>
          </CardContent>
        </Card>
      ) : (
        <Link href={`/workspace/${workspace?.id}`}>
          <Card
            className="w-[300px] h-[300px] border-dashed hover:cursor-pointer"
            onClick={onClick}
          >
            <CardContent className="h-full p-6 flex flex-col items-center justify-center gap-3">
              <Avatar className="w-16 h-16">
                <AvatarImage src="https://github.com/shadcn1.png" />
                <AvatarFallback className="bg-primary text-white text-xl font-bold">
                  {workspace?.name
                    ? getFirstLetterUppercase(workspace?.name)
                    : "unknow"}
                </AvatarFallback>
              </Avatar>

              <h1 className="font-semibold text-gray-600 dark:text-gray-300">
                {workspace?.name ? workspace?.name : "unknow"}
              </h1>

              <div className="mt-3 flex flex-row-reverse justify-end -space-x-3 space-x-reverse *:ring *:ring-background">
                {workspace?.joinUsers?.map((user: USER_TYPE) => {
                  return (
                    <Avatar key={uuidv4()} className="w-7 h-7">
                      <AvatarImage src={user?.photoURL} />
                      <AvatarFallback className="text-[0.7rem] font-semibold">
                        {user?.displayName
                          ? getFirstLetterUppercase(user?.displayName)
                          : "U"}
                      </AvatarFallback>
                    </Avatar>
                  );
                })}
              </div>

              <span className="text-[0.75rem] text-gray-500 dark:text-gray-400">
                Created:{" "}
                {workspace?.createdAt
                  ? formatTimeStampDate(
                      workspace?.createdAt as Timestamp,
                      "date"
                    )
                  : "unknow"}
              </span>
            </CardContent>
          </Card>
        </Link>
      )}
    </>
  );
};

export default WorkspaceBtn;
