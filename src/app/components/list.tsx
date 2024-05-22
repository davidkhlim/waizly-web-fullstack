"use client";

import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";

import ListItemText from "@mui/material/ListItemText";
import {
  ChangeEvent,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { PRIORITY_t, TODOS_t } from "../utils/types";
import ListItemIcon from "@mui/material/ListItemIcon";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import TimerIcon from "@mui/icons-material/TimerOutlined";
import {
  Accordion,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Paper,
  Skeleton,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddTodosButton from "./addTodosButton";
import DeleteTodos from "./deleteTodos";
import { ListOutlined } from "@mui/icons-material";
import ReportIcon from "@mui/icons-material/Report";
import AddTodos from "./addTodos";

type PROPS = {
  priorities: PRIORITY_t;
  title: string;
  todos: TODOS_t[];
  isLoading: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  allTask: TODOS_t[];
};

export default function ToDoList(props: PROPS) {
  const [isDelDialogOpen, setIsDelDialogOpen] = useState<boolean>(false);
  const [selectedID, setSelectedID] = useState<number>(0);
  const [selectedTodo, setSelectedTodo] = useState<TODOS_t>();
  const [open, setOpen] = useState(false);

  const handleEdit = (value: number) => () => {
    console.log(value + "EDIT");
    setSelectedID(value);
    setOpen(true);
    setSelectedTodo(props.todos.filter((x) => x.id === value)[0]);
  };
  const handleDelete = (value: number) => () => {
    console.log(value + "DELETE");
    setIsDelDialogOpen(true);
    setSelectedID(value);
    setSelectedTodo(props.todos.filter((x) => x.id === value)[0]);
  };

  const handleDone = (id: number) => (event: ChangeEvent<HTMLInputElement>) => {
    console.log(id + "DONE" + event.target.checked);
    fetch(`/api/todos?timestamp=${new Date().getTime()}&id=${id}`, {
      method: "PUT", // or PATCH
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        is_done: event.target.checked,
      }),
    }).then((data) => {
      if (data.status === 200) props.setRefresh(true);
    });
  };
  return (
    <>
      <AddTodos
        open={open}
        setOpen={setOpen}
        mode="edit"
        todo={selectedTodo}
        priorities={props.priorities}
        setRefresh={props.setRefresh}
        allTask={props.allTask}
      ></AddTodos>
      <Accordion defaultExpanded disabled={props.isLoading}>
        {selectedTodo ? (
          <DeleteTodos
            isOpen={isDelDialogOpen}
            setIsOpen={setIsDelDialogOpen}
            selectedID={selectedID}
            setRefresh={props.setRefresh}
            selectedTodo={selectedTodo!}
          ></DeleteTodos>
        ) : null}
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
          sx={{ bgcolor: props.title === "Done" ? "#7DFF66" : "#FFD166" }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            {`${props.title} (${props.todos.length})`}
          </Typography>
        </AccordionSummary>
        {props.isLoading ? (
          <Skeleton variant="rectangular" width="100%" animation="wave" />
        ) : (
          <List
            sx={{
              width: "100%",
              bgcolor: "background.paper",
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            {props.todos.length > 0 ? (
              props.todos.map((value) => {
                const labelId = `checkbox-list-label-${value}`;
                return (
                  <ListItem
                    sx={{
                      borderBlock: "solid 1px #cccccc",
                      borderRadius: 2,
                    }}
                    key={value.id}
                    secondaryAction={
                      <>
                        <IconButton edge="end" onClick={handleDelete(value.id)}>
                          <DeleteForeverIcon
                            fontSize="small"
                            sx={{
                              bgcolor: "red",
                              color: "white",
                              borderRadius: 4,
                              padding: 0.5,
                              minWidth: 25,
                              minHeight: 25,
                            }}
                          />
                        </IconButton>
                      </>
                    }
                    dense
                    disablePadding
                  >
                    <Checkbox
                      onChange={handleDone(value.id)}
                      checked={value.is_done}
                    />
                    <ReportIcon
                      sx={{ color: props.priorities[value.priority] }}
                    />
                    <ListItemButton
                      role={undefined}
                      onClick={handleEdit(value.id)}
                      dense
                      alignItems="flex-start"
                      className="group "
                      disabled={props.title === "Done"}
                    >
                      <ListItemIcon
                        className="invisible group-hover:visible"
                        sx={{ minWidth: 30 }}
                      >
                        <EditIcon sx={{ fontSize: 18 }} />
                      </ListItemIcon>
                      <ListItemText
                        id={labelId}
                        primary={value.title}
                        secondary={value.description}
                        primaryTypographyProps={{
                          noWrap: true,
                          fontSize: 18,
                          fontWeight: 600,
                        }}
                        secondaryTypographyProps={{
                          fontSize: 16,
                        }}
                      />
                      {value.due_date && (
                        <ListItemButton
                          sx={{
                            minWidth: 140,
                            maxWidth: 250,
                            display: "flex",
                            alignItems: "center",
                            ":hover": {
                              bgcolor: "transparent",
                            },
                          }}
                          disableRipple
                        >
                          <ListItemIcon className="" sx={{ minWidth: 20 }}>
                            <TimerIcon sx={{ fontSize: 16, color: "#" }} />
                          </ListItemIcon>
                          <ListItemText
                            id={labelId}
                            primary={value.due_date}
                            secondary={
                              (value.due_date_desc.type > 0
                                ? "Overdue "
                                : "Due in ") + value.due_date_desc.val
                            }
                            secondaryTypographyProps={{
                              color:
                                value.due_date_desc.type > 0
                                  ? "#ff0000"
                                  : "inherit",
                              fontWeight:
                                value.due_date_desc.type > 0 ? 800 : "inherit",
                            }}
                          />
                        </ListItemButton>
                      )}
                    </ListItemButton>
                  </ListItem>
                );
              })
            ) : (
              <Alert
                severity="info"
                action={
                  props.title === "Done" ? (
                    <></>
                  ) : (
                    <AddTodosButton
                      priorities={props.priorities}
                      allTask={props.allTask}
                      setRefresh={props.setRefresh}
                    />
                  )
                }
              >
                {props.title === "Done"
                  ? "I believe you can do it!"
                  : "Add more tasks?"}
              </Alert>
            )}
          </List>
        )}
      </Accordion>
    </>
  );
}
