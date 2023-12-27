"use client";

import * as React from "react";

import Icons from "@/components/icons";
import { SelectFollows, UsersProfile } from "@/lib/db/schema";
import { formatBirthdate, formatJoinDate } from "@/lib/utils";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";

type ProfileInfoProps = {
  userByUsername: UsersProfile;
  loggedInUserId: string;
};

const ProfileInfo = ({ userByUsername, loggedInUserId }: ProfileInfoProps) => {
  const queryClient = useQueryClient();

  const [localFollowersAmt, setLocalFollowersAmt] = React.useState<
    SelectFollows[]
  >(userByUsername.followers);
  const [localFollowingsAmt, setLocalFollowingsAmt] = React.useState<
    SelectFollows[]
  >(userByUsername.followings);

  const birthdate = formatBirthdate(
    userByUsername.birthdate ? userByUsername.birthdate : ""
  );
  const joinDate = formatJoinDate(userByUsername.createdAt);
  const isMyProfile = userByUsername.id === loggedInUserId;

  const { data: followsData } = useQuery({
    queryKey: ["followsData", userByUsername.id],
    queryFn: async () => {
      const { data } = await axios.get("/api/follow", {
        params: {
          userByUsernameId: userByUsername.id,
        },
      });

      return data as UsersProfile;
    },
  });

  React.useEffect(() => {
    if (followsData) {
      setLocalFollowersAmt(followsData.followers);
    }
  }, [followsData]);
  React.useEffect(() => {
    if (followsData) {
      setLocalFollowingsAmt(followsData.followings);
    }
  }, [followsData]);

  const { mutate: followUser } = useMutation({
    mutationKey: ["followButton", userByUsername],
    mutationFn: async () => {
      const payload = {
        loggedInUserId: loggedInUserId,
        userToFollow: userByUsername.id,
      };

      const { data } = await axios.post("/api/follow", payload);
      return data as string;
    },
    onError: () => {},
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["followsData"] });
    },
  });

  let isFollowed: boolean;
  if (!loggedInUserId) {
    isFollowed = false;
  } else {
    isFollowed = !!localFollowersAmt.find(
      (user) => user.followingId === loggedInUserId
    );
  }

  return (
    <div>
      <div className="relative">
        <div className="max-h-[200px] overflow-hidden">
          <Image
            width={600}
            height={200}
            alt="NextUI hero Image"
            src="https://via.placeholder.com/600x200"
            className="object-contain"
          />
        </div>
        <Avatar
          showFallback
          src={userByUsername.image!}
          isBordered
          className="absolute ml-4 -translate-y-[50%] h-[134px] w-[134px]"
        />
        {isMyProfile ? (
          <>
            <Button
              //   onPress={onOpen}
              className="absolute right-4 mt-3 border rounded-full text-[15px] leading-5 font-bold hover:bg-white/10"
              variant="bordered"
            >
              Edit profile
            </Button>
            {/* <EditProfileModal
          isOpen={isOpen}
          onOpen={onOpen}
          onOpenChange={onOpenChange}
          currentUser={currentUser}
        /> */}
          </>
        ) : (
          <div className="absolute right-4 mt-3">
            {isFollowed ? (
              <Dropdown
                classNames={{
                  base: "p-0 min-w-0 bg-black shadow-normal",
                  trigger: "p-0",
                }}
              >
                <DropdownTrigger>
                  <Button
                    isIconOnly
                    className="fill-text rounded-full border-1"
                    variant="bordered"
                  >
                    <Icons.followedIcon className="h-5 w-5" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  className="p-0 px-2 w-fit"
                  aria-label="unfollow button"
                >
                  <DropdownItem
                    onClick={() => followUser()}
                    key="unfollow"
                    className="h-[44px] rounded-xl data-[hover=true]:bg-hover/40 data-[hover=true]:text-text"
                    textValue="unfollo"
                  >
                    <div className="flex items-center gap-2">
                      <Icons.unfollow className="fill-text h-[18px] w-[18px]" />
                      <div className="font-bold text-[15px]">
                        Unfollow {userByUsername.username}
                      </div>
                    </div>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            ) : (
              <Button
                onClick={() => followUser()}
                className="border bg-text text-black rounded-full text-[15px] leading-5 font-bold hover:bg-text/90"
              >
                Follow
              </Button>
            )}
          </div>
        )}
      </div>
      <div className="mt-[85px] px-4 pt-3 mb-4">
        <div className="mb-[18px] flex flex-col gap-[2px]">
          <p className="text-xl font-bold leading-6">{userByUsername.name}</p>
          <p className="text-[15px] leading-5 text-gray">
            {userByUsername.username}
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-[15px] leading-5">{userByUsername.bio}</p>
          <div className="flex gap-3 items-center relative right-[2px]">
            <div className="flex gap-1 items-center">
              <Icons.balloon className="fill-gray w-[18px] h-[18px]" />
              <p className="text-[15px] text-gray leading-3">{birthdate}</p>
            </div>
            <div className="flex gap-1 items-center">
              <Icons.calendar className="fill-gray w-[18px] h-[18px]" />
              <p className="text-[15px] text-gray leading-3">
                Joined {joinDate}
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="text-text text-sm">
              <span className="font-bold tabular-nums">
                {localFollowingsAmt.length}
              </span>{" "}
              <span className="text-gray text-sm leading-4">Following</span>
            </div>
            <div className="text-text text-sm">
              <span className="font-bold tabular-nums">
                {localFollowersAmt.length}
              </span>{" "}
              <span className="text-gray text-sm leading-4">Followers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfileInfo;
