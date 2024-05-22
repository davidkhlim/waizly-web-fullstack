import Button from "@mui/material/Button";
import PlaylistAddOutlinedIcon from "@mui/icons-material/PlaylistAddOutlined";
import { useState } from "react";
import AddTodos from "./addTodos";
import { PRIORITY_t, TODOS_t } from "../utils/types";

type PROPS_t = {
  priorities: PRIORITY_t;
  allTask: TODOS_t[];
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function addTodosButton(props: PROPS_t) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <AddTodos
        open={open}
        setOpen={setOpen}
        mode="add"
        priorities={props.priorities}
        setRefresh={props.setRefresh}
        allTask={props.allTask}
      ></AddTodos>
      <Button
        variant="contained"
        startIcon={<PlaylistAddOutlinedIcon />}
        onClick={() => {
          setOpen(true);
        }}
      >
        New
      </Button>
    </>
  );
}
