import { FC } from "react";
import * as Toast from "@radix-ui/react-toast";
import {
  Cross1Icon,
  QuestionMarkCircledIcon,
  CheckCircledIcon,
} from "@radix-ui/react-icons";

interface SuccessPopupProps {
  open: boolean;
  onOpen: () => void;
}

const SuccessPopup: FC<SuccessPopupProps> = ({ open, onOpen }) => {
  return (
    <Toast.Provider swipeDirection='up'>
      <Toast.Root
        className='bg-white border border-gray-[#A8D5BA] rounded-md shadow-lg p-4 flex items-center space-x-4'
        open={open}
        onOpenChange={onOpen}
      >
        <Toast.Title className='text-3xl min-w-6'>
          <CheckCircledIcon width={24} height={24} color='#28A745' />
        </Toast.Title>
        <Toast.Description className='text-sm text-gray-600'>
          Ma&apos;lumotlar muvaffaqiyatli o&apos;zgartirildi
        </Toast.Description>
        <Toast.Close
          className='ml-auto text-gray-400 hover:text-gray-800'
          aria-label='Close'
        >
          <Cross1Icon />
        </Toast.Close>
      </Toast.Root>
      <Toast.Viewport className='fixed top-4 left-1/2 transform -translate-x-1/2 flex flex-col space-y-2 w-96 max-w-full z-50' />
    </Toast.Provider>
  );
};

export default SuccessPopup;
