import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import PlaylistAddOutlinedIcon from "@mui/icons-material/PlaylistAddOutlined";
import { PRIORITY_t, TODOS_t } from "../utils/types";
import { useEffect, useState } from "react";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import EditIcon from "@mui/icons-material/Edit";

type PROPS_t = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mode: "add" | "edit";
  todo?: TODOS_t;
  priorities: PRIORITY_t;
  allTask: TODOS_t[];
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function AddTodos(props: PROPS_t) {
  const [title, setTitle] = useState("");
  const [oldTitle, setOldTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<string>("low");
  const [dueDatetime, setDueDatetime] = useState<Date>(new Date());

  useEffect(() => {
    if (props.mode === "edit" && props.todo) {
      setTitle(props.todo!.title || "");
      setOldTitle(props.todo!.title || "");
      setDescription(props.todo!.description || "");
      setPriority(props.todo!.priority || "low");
      setDueDatetime(new Date(props.todo.due_date_at || Date.now()));
    }
  }, [props.todo, props.mode]);

  useEffect(() => {
    if (props.mode === "add") {
      if (props.allTask.some((x) => x.title === title)) {
        setTitleError("Title already exists");
      } else setTitleError("");
    } else if (props.mode === "edit") {
      if (
        props.allTask.some((x) => x.title === title && x.title !== oldTitle)
      ) {
        setTitleError("Title already exists");
      } else setTitleError("");
    }
  }, [title]);
  const handleClose = () => {
    setTitle("");
    setDescription("");
    setPriority("low");
    setDueDatetime(new Date());
    props.setOpen(false);
  };

  const upsertData = () => {
    if (props.mode === "add") {
      fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          priority,
          due_date: dueDatetime?.getTime() > 0 ? dueDatetime?.getTime() : null,
        }),
      });
    } else if (props.mode === "edit") {
      fetch(
        `/api/todos?timestamp=${new Date().getTime()}&id=${props.todo!.id}`,
        {
          method: "PUT", // or PATCH
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            priority,
            due_date:
              dueDatetime?.getTime() < 86400000 ? null : dueDatetime?.getTime(),
          }),
        },
      );
    }
  };

  return (
    <Dialog
      open={props.open}
      keepMounted
      PaperProps={{
        component: "form",
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          // const formData = new FormData(event.currentTarget);
          // const formJson = Object.fromEntries((formData as any).entries());
          // console.log(formJson); // not used
          upsertData();
          props.setRefresh(true);
          handleClose();
        },
      }}
    >
      <DialogTitle sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
        {props.mode === "add" ? (
          <PlaylistAddOutlinedIcon fontSize="large" />
        ) : (
          <EditIcon fontSize="large" />
        )}

        <Typography variant="h5">
          {props.mode === "add" ? "New Task" : "Edit Task"}
        </Typography>
      </DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", width: 600, gap: 1 }}
      >
        <TextField
          autoFocus
          required
          margin="dense"
          id="title"
          name="title"
          label="Title"
          type="text"
          fullWidth
          variant="standard"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={titleError ? true : false}
          helperText={titleError}
        />
        <TextField
          margin="dense"
          id="description"
          name="description"
          label="Description"
          type="text"
          fullWidth
          multiline
          variant="standard"
          maxRows={10}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
            width: 1,
            alignContent: "center",
            justifyContent: "left",
          }}
        >
          {" "}
          <Typography alignSelf={"center"}>Priority: </Typography>
          <RadioGroup
            row
            name="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <FormControlLabel value="low" control={<Radio />} label="Low" />
            <FormControlLabel
              value="medium"
              control={<Radio />}
              label="Medium"
            />
            <FormControlLabel value="high" control={<Radio />} label="High" />
          </RadioGroup>
        </Box>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
              width: 1,
              alignContent: "center",
              justifyContent: "left",
            }}
          >
            <Typography alignSelf={"center"}>Due Date:</Typography>
            <MobileDateTimePicker
              defaultValue={dayjs(new Date().toString())}
              name="due_date"
              value={dayjs(
                dueDatetime
                  ? dueDatetime.toString()
                  : dayjs(new Date().toString()),
              )}
              onChange={(newValue) =>
                newValue
                  ? setDueDatetime(newValue!.toDate())
                  : setDueDatetime(new Date(0))
              }
              slotProps={{
                actionBar: {
                  actions: ["today", "accept"],
                },
              }}
            />
          </Box>
        </LocalizationProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained" color="error">
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={titleError ? true : false}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
