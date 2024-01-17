"use client";

import React from "react";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Selection,
} from "@nextui-org/react";
import Icons from "@/components/icons";
import { useDebouncedValue } from "@mantine/hooks";
import { OnboardingPayload } from "@/lib/validator/onboarding";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import Bio from "@/components/main/modal/onboarding/bio";
import Birthdate from "@/components/main/modal/onboarding/birthdate";
import Username from "@/components/main/modal/onboarding/username";
import { SelectUser } from "@/lib/db/schema";

type OnboardingProps = {
  username: string;
  userId: string;
};

const Onboarding = ({ username, userId }: OnboardingProps) => {
  const router = useRouter();
  const [step, setStep] = React.useState(1);

  const [monthValue, setMonthValue] = React.useState<Selection>(new Set([]));
  const [dayValue, setDayValue] = React.useState<Selection>(new Set([]));
  const [yearValue, setYearValue] = React.useState<Selection>(new Set([]));

  const [bio, setBio] = React.useState("");

  const [localUsername, setLocalUsername] = React.useState(username);
  const [debouncedUsername] = useDebouncedValue(localUsername, 500);

  const { mutate: submitOnboarding, isPending } = useMutation({
    mutationFn: async () => {
      const payload: OnboardingPayload = {
        birthdate: `${[...yearValue][0]}-${[...monthValue][0]}-${
          [...dayValue][0]
        }`,
        bio: bio,
        username: localUsername,
      };
      const { data } = await axios.post("/api/onboarding", payload);
      return data as string;
    },
    onError: (error) => {},
    onSuccess: (data) => {
      router.refresh();
    },
  });

  let isDisabled;

  if (step === 1) {
    isDisabled = !dayValue || !monthValue || !yearValue;
  } else if (step === 3) {
    isDisabled === !debouncedUsername;
  }

  return (
    <Modal
      isOpen={true}
      hideCloseButton={true}
      size="2xl"
      classNames={{
        base: "bg-black w-full w-[600px] h-[600px] rounded-xl",
        backdrop: "bg-backdrop",
      }}
      backdrop="blur"
    >
      <ModalContent>
        <>
          <ModalHeader className="flex flex-col items-center gap-1">
            <Icons.x className="fill-text w-7 h-7" />
          </ModalHeader>
          <ModalBody className="px-16">
            {step === 1 && (
              <Birthdate
                setStep={setStep}
                setMonthValue={setMonthValue}
                monthValue={monthValue}
                setDayValue={setDayValue}
                dayValue={dayValue}
                setYearValue={setYearValue}
                yearValue={yearValue}
              />
            )}
            {step === 2 && <Bio setStep={setStep} bio={bio} setBio={setBio} />}
            {step === 3 && (
              <Username
                setStep={setStep}
                step={step}
                username={username}
                userId={userId}
                setUsername={setLocalUsername}
                debouncedUsername={debouncedUsername}
                submitOnboarding={submitOnboarding}
                isPending={isPending}
              />
            )}
          </ModalBody>
        </>
      </ModalContent>
    </Modal>
  );
};
export default Onboarding;
