import { Input } from "@nextui-org/react";

import Icons from "@/components/icons";

const Search = () => {
  return (
    <div className="flex items-center group rounded-full border border-transparent group focus-within:border-twitter">
      <Input
        isClearable
        radius="full"
        placeholder="Search"
        classNames={{
          input: "h-[42px] text-gray",
          innerWrapper: "border border-transparent",
        }}
        startContent={<Icons.search className="w-[44px] h-[19px] fill-gray" />}
      />
    </div>
  );
};
export default Search;
