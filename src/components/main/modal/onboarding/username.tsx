"use client";

import * as React from "react";

import { Button, Input } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

type UsernameProps = {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  username: string;
  userId: string;
  step: number;
  setUsername: (username: string) => void;
  debouncedUsername: string;
  submitOnboarding: () => void;
  isPending: boolean;
};

const Username = ({
  setStep,
  username,
  userId,
  step,
  setUsername,
  debouncedUsername,
  submitOnboarding,
  isPending,
}: UsernameProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(e.target.value);
  };

  const {
    data: checkUsername,
    isError,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["checkUsername", debouncedUsername],
    queryFn: async () => {
      const { data } = await axios.get("/api/profile/check-username", {
        params: {
          username: `@${debouncedUsername}` || `@${username}`,
          userId: userId,
        },
      });
      return data as string;
    },
    retry: false,
  });

  let errorMessage = "";

  if (error) {
    if (error instanceof AxiosError) {
      // if (error.response?.status === 402) {
      errorMessage = error.response?.data[0].message;
      // }
      // if(error.response?.status === 422){}
    }
  } else if (debouncedUsername === "") {
    errorMessage = "Username is required.";
  }

  React.useEffect(() => {
    if (debouncedUsername.length !== username.length) {
      checkUsername;
    }
  }, [debouncedUsername.length, checkUsername, username.length]);

  const isDisabled = isError || debouncedUsername.length < 3;

  return (
    <div className="flex flex-col justify-between h-full pb-6">
      <div>
        <div className="flex flex-col justify-start w-full mb-4">
          <p className="font-bold text-3xl">What should we call you?</p>
          <p className="text-base text-gray">
            Your @usename is unique. You can always change it later.
          </p>
        </div>

        <div className="flex w-full gap-4 justify-between">
          <Input
            errorMessage={errorMessage}
            isInvalid={isError || debouncedUsername.length < 3}
            onChange={handleChange}
            defaultValue={username}
            variant="bordered"
            label="Username"
            type="text"
            startContent={
              <p className="group-data-[focus=true]:text-blue hidden group-data-[focus=true]:inline-block group-data-[filled-within=true]:inline-block group-data-[invalid=true]:text-danger mt-[2px]">
                @
              </p>
            }
            endContent={
              <>
                {!isLoading && isError && (
                  <AlertCircle className="w-4 h-4 fill-danger stroke-black" />
                )}
                {debouncedUsername === "" && (
                  <AlertCircle className="w-4 h-4 fill-danger stroke-black" />
                )}
                {!isLoading && !isError && debouncedUsername !== "" && (
                  <CheckCircle2 className="w-4 h-4 fill-green-600 stroke-black" />
                )}
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              </>
            }
            classNames={{
              inputWrapper: "rounded-lg group-data-[focus=true]:border-blue",
              input: "mt-[4px] -ml-[2px] text-base",
              label: "group-data-[focus=true]:text-blue",
            }}
          />
        </div>
      </div>
      <Button
        isDisabled={isDisabled}
        isLoading={isPending}
        onClick={() => {
          if (step === 3) {
            submitOnboarding();
            return;
          }
          setStep((prev) => prev + 1);
        }}
        size="lg"
        className="mb-4 rounded-full font-bold text-lg bg-text text-black hover:bg-text/90"
      >
        Next
      </Button>
    </div>
  );
};
export default Username;
