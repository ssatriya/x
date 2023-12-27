import { Button, Textarea } from "@nextui-org/react";

type BioProps = {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setBio: (bio: string) => void;
  bio: string;
};

const Bio = ({ setStep, setBio, bio }: BioProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBio(e.target.value);
  };

  return (
    <div className="flex flex-col justify-between h-full pb-6">
      <div>
        <div className="flex flex-col justify-start w-full mb-4">
          <p className="font-bold text-3xl">Describe yourself</p>
          <p className="text-base text-gray">
            What makes you special? Don&apos;t think too hard, just have fun
            with it.
          </p>
        </div>

        <div className="flex w-full gap-4 justify-between relative">
          <Textarea
            maxLength={160}
            onChange={handleChange}
            value={bio}
            label="Your bio"
            minRows={2}
            variant="bordered"
            classNames={{
              inputWrapper: "rounded-lg group-data-[focus=true]:border-blue",
              label: "group-data-[focus=true]:text-blue",
            }}
          />
          <div className="absolute top-1 right-2 text-sm text-gray">
            {bio.length} / 160
          </div>
        </div>
      </div>
      {bio.length === 0 ? (
        <Button
          // isDisabled={isDisabled}
          onClick={() => {
            setStep((prev) => prev + 1);
          }}
          size="lg"
          variant="bordered"
          className="mb-4 rounded-full font-bold text-lg text-text hover:bg-hover"
        >
          Skip for now
        </Button>
      ) : (
        <Button
          // isDisabled={isDisabled}
          onClick={() => {
            setStep((prev) => prev + 1);
          }}
          size="lg"
          className="mb-4 rounded-full font-bold text-lg bg-text text-black hover:bg-text/90"
        >
          Next
        </Button>
      )}
    </div>
  );
};
export default Bio;
