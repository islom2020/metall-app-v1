import { Dispatch, FC, SetStateAction } from "react";
import { AlertDialogCancel } from "@radix-ui/react-alert-dialog";

/* eslint-disable @next/next/no-img-element */
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Dialog = ({
  open,
  setOpen,
  onConfirm,
  disabled,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onConfirm: () => void;
  disabled: boolean;
}) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Ma&apos;lumotlar yuborishni tasdiqlaysizmi?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>
            Bekor qilish
          </AlertDialogCancel>
          <AlertDialogAction disabled={disabled} onClick={onConfirm}>
            Tasdiqlayman
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Dialog;
