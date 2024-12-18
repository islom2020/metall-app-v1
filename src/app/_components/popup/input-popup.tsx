import { FC } from "react";
import * as Toast from "@radix-ui/react-toast";
import { Cross1Icon, QuestionMarkCircledIcon } from "@radix-ui/react-icons";

interface InputPopupProps {
  open: boolean;
  onOpen: () => void;
}

const InputPopup: FC<InputPopupProps> = ({ open, onOpen }) => {
  return (
    <Toast.Provider swipeDirection='up'>
      <Toast.Root
        className='bg-white border border-gray-300 rounded-md shadow-lg p-4 flex items-center space-x-4'
        open={open}
        onOpenChange={onOpen}
      >
        <Toast.Title className='text-3xl min-w-6'>
          <QuestionMarkCircledIcon width={24} height={24} color='#FF4B68' />
        </Toast.Title>
        <Toast.Description className='text-sm text-gray-600'>
          {
            // eslint-disable-next-line react/no-unescaped-entities
            `"Кто отгрузил" ва "Бригада" ни танлаш мажбурий`
          }
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

export default InputPopup;
