import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Transition } from "../utils/transition";
import toast from "react-hot-toast";
import { TODOS_t } from "../utils/types";

type PROPS_t = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  selectedID: number;
  selectedTodo: TODOS_t;
};

export default function DeleteTodos(props: PROPS_t) {
  const handleClose = () => {
    props.setIsOpen(false);
  };
  const handleSubmit = () => {
    fetch(
      `/api/todos?timestamp=${new Date().getTime()}&id=${props.selectedID}`,
      {
        // query URL without using browser cache
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
        },
        method: "DELETE",
      },
    ).then((data) => {
      if (data.status === 200) {
        props.setRefresh(true);
        toast.success("Deleted!");
      }
    });
    handleClose();
  };

  return (
    <Dialog open={props.isOpen} TransitionComponent={Transition}>
      <DialogTitle>Are you sure to delete this task?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          {props.selectedTodo.title}
          <br />
          {"Due Date: " +
            (props.selectedTodo.due_date
              ? props.selectedTodo.due_date
              : "None")}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
