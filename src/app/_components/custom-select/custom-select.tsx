import { FC } from "react";
import * as Select from "@radix-ui/react-select";
import type { SelectProps } from "@radix-ui/react-select";
import { cn } from "@/lib/utils";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";

interface CustomSelectProps extends SelectProps {
  error?: boolean;
  data?: any;
  label: string;
}

const CustomSelect: FC<CustomSelectProps> = ({
  value,
  onValueChange,
  error,
  data,
  label,
}) => {
  return (
    <Select.Root value={value} onValueChange={onValueChange}>
      <Select.Trigger
        className={cn(
          "inline-flex group rounded-lg items-center justify-between gap-[5px] dark:bg-white/15  bg-white px-2 text-[13px] leading-none text-violet11 shadow-[0_2px_10px] shadow-black/10 outline-none hover:bg-mauve3 focus:shadow-[0_0_0_2px] focus:shadow-black data-[placeholder]:text-violet9 w-full border border-black/30 h-11",
          error && "!border-red-400"
        )}
        aria-label="Food"
      >
        <Select.Value
          className="group-focus:-translate-y-2"
          placeholder="Select a option…"
        />
        <Select.Icon className="text-violet11">
          <ChevronDownIcon width={20} height={20} />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          onPointerDownOutside={(event) => {
            const target = event.target as HTMLElement;
            // Prevent closing if the user is interacting with the scroll bar
            if (target.closest("[data-radix-scroll-area]")) {
              event.preventDefault();
            }
          }}
          onEscapeKeyDown={(event) => {
            // Optional: Handle Escape key if needed
            console.log("Escape key pressed");
          }}
          className="overflow-hidden dark:bg-[#1A1A1A] rounded-md bg-white shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] relative z-50"
        >
          <Select.ScrollUpButton className="flex h-[25px] cursor-default items-center justify-center dark:bg-[#1A1A1A] bg-white text-violet11">
            <ChevronUpIcon width={20} height={20} />
          </Select.ScrollUpButton>
          <Select.Viewport className="p-[5px]">
            <Select.Group>
              <Select.Item
                key={0}
                value="0"
                className="flex items-center px-3 py-2 rounded cursor-pointer  dark:hover:bg-white/30 hover:bg-gray-100 focus-visible:outline-none"
              >
                <Select.ItemText>
                  <div className="text-sm">{label}</div>
                </Select.ItemText>
                <Select.ItemIndicator className="ml-auto">
                  <CheckIcon width={20} height={20} />
                </Select.ItemIndicator>
              </Select.Item>
              {data?.rows?.map((option: any) => (
                <Select.Item
                  key={option.id}
                  value={option.id}
                  className="flex items-center px-3 py-2 rounded cursor-pointer  dark:hover:bg-white/30 hover:bg-gray-100 focus-visible:outline-none"
                >
                  <Select.ItemText>
                    <div className="text-sm">{option.name}</div>
                  </Select.ItemText>
                  <Select.ItemIndicator className="ml-auto">
                    <CheckIcon width={20} height={20} />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Group>
          </Select.Viewport>
          <Select.ScrollDownButton className="flex h-[25px] cursor-default items-center justify-center bg-white dark:bg-[#1A1A1A]  text-violet11">
            <ChevronDownIcon width={20} height={20} />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

export default CustomSelect;
