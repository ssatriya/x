import * as React from "react";
import { Button, Select, SelectItem, Selection } from "@nextui-org/react";
import { daysInMonths, generateYearArray } from "@/lib/utils";

const months = [
  { value: "0", label: "January" },
  { value: "1", label: "February" },
  { value: "2", label: "March" },
  { value: "3", label: "April" },
  { value: "4", label: "May" },
  { value: "5", label: "June" },
  { value: "6", label: "July" },
  { value: "7", label: "August" },
  { value: "8", label: "September" },
  { value: "9", label: "October" },
  { value: "10", label: "November" },
  { value: "11", label: "December" },
];

type BirthdateProps = {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setMonthValue: (month: Selection) => void;
  monthValue: Selection;
  setDayValue: (day: Selection) => void;
  dayValue: Selection;
  setYearValue: (year: Selection) => void;
  yearValue: Selection;
};

const Birthdate = ({
  setStep,
  setMonthValue,
  monthValue,
  setDayValue,
  dayValue,
  setYearValue,
  yearValue,
}: BirthdateProps) => {
  const [daysValue, setDaysValue] =
    React.useState<{ value: string; label: string }[]>();
  const [yearsValue, setYearsValue] =
    React.useState<{ value: string; label: string }[]>();

  React.useEffect(() => {
    const month = Array.from(monthValue)[0];
    const year = Array.from(yearValue)[0];
    const daysCount = daysInMonths(month as string, year as string);

    const days = [...Array(daysCount)].map((_, index) => ({
      value: (index + 1).toString(),
      label: (index + 1).toString(),
    }));
    setDaysValue(days);

    const years = generateYearArray();
    if (years.length) {
      setYearsValue(years);
    }
  }, [monthValue, yearValue]);

  const isDisabled =
    [...monthValue].length === 0 ||
    [...dayValue].length === 0 ||
    [...yearValue].length === 0;

  return (
    <div className="flex flex-col justify-between h-full pb-6">
      <div>
        <div className="flex flex-col justify-start w-full mb-4">
          <p className="font-bold text-3xl">What&apos;s your birth date?</p>
          <p className="text-base text-gray">This won&apos;t be public.</p>
        </div>

        <div className="flex w-full gap-4 justify-between">
          <Select
            disableAnimation
            disallowEmptySelection
            autoFocus
            label="Month"
            selectedKeys={monthValue}
            variant="bordered"
            onSelectionChange={setMonthValue}
            // defaultValue="january"
            classNames={{
              trigger:
                "rounded-lg group data-[focus=true]:border-blue data-[open=true]:border-blue",
              selectorIcon:
                "data-[open=true]:text-blue group-data-[focus=true]:text-blue",
            }}
          >
            {months.map((month) => (
              <SelectItem key={month.value} value={month.value}>
                {month.label}
              </SelectItem>
            ))}
          </Select>

          {daysValue && (
            <Select
              disableAnimation
              disallowEmptySelection
              items={daysValue}
              label="Day"
              selectedKeys={dayValue}
              onSelectionChange={setDayValue}
              variant="bordered"
              classNames={{
                trigger:
                  "rounded-lg data-[focus=true]:border-blue data-[open=true]:border-blue",
                selectorIcon:
                  "data-[open=true]:text-blue group-data-[focus=true]:text-blue",
              }}
            >
              {(day) => (
                <SelectItem key={day.value} value={day.value}>
                  {day.label}
                </SelectItem>
              )}
            </Select>
          )}

          {yearsValue && (
            <Select
              disableAnimation
              disallowEmptySelection
              items={yearsValue}
              label="Years"
              selectedKeys={yearValue}
              onSelectionChange={setYearValue}
              variant="bordered"
              classNames={{
                trigger:
                  "rounded-lg data-[focus=true]:border-blue data-[open=true]:border-blue",
                selectorIcon:
                  "data-[open=true]:text-blue group-data-[focus=true]:text-blue",
              }}
            >
              {(year) => (
                <SelectItem key={year.value} value={year.value}>
                  {year.label}
                </SelectItem>
              )}
            </Select>
          )}
        </div>
      </div>
      <Button
        isDisabled={isDisabled}
        onClick={() => {
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
export default Birthdate;
