"use client";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import ToDoList from "./components/list";
import { TODOS_t, PRIORITY_t } from "./utils/types";
import { createContext, useEffect, useState } from "react";
import { Button, Icon, IconButton, TextField } from "@mui/material";
import { formatDate, msToTime } from "./utils/date";
import AddTodosButton from "./components/addTodosButton";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import WeatherInfo from "./components/weatherInfo";

const PRIORITY: PRIORITY_t = {
  high: "#FF0000",
  medium: "#FF8F00",
  low: "#CFD200",
};

export default function Home() {
  const [todos, setTodos] = useState<TODOS_t[]>([]);
  const [dones, setDones] = useState<TODOS_t[]>([]);
  const [allTask, setAllTask] = useState<TODOS_t[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<boolean>(true);
  const [filterStr, setFilterStr] = useState<string>("");
  const [weatherInfo, setWeatherInfo] = useState({
    location: {
      name: "Ciputat",
      region: "West Java",
      country: "Indonesia",
      lat: -6.94,
      lon: 107.69,
      tz_id: "Asia/Jakarta",
      localtime_epoch: 1716375988,
      localtime: "2024-05-22 18:06",
    },
    current: {
      last_updated_epoch: 1716375600,
      last_updated: "2024-05-22 18:00",
      temp_c: 24.1,
      temp_f: 75.4,
      is_day: 0,
      condition: {
        text: "Patchy light rain",
        icon: "//cdn.weatherapi.com/weather/64x64/night/293.png",
        code: 1180,
      },
      wind_mph: 2.2,
      wind_kph: 3.6,
      wind_degree: 26,
      wind_dir: "NNE",
      pressure_mb: 1009,
      pressure_in: 29.79,
      precip_mm: 1.08,
      precip_in: 0.04,
      humidity: 84,
      cloud: 86,
      feelslike_c: 26.2,
      feelslike_f: 79.2,
      vis_km: 9,
      vis_miles: 5,
      uv: 1,
      gust_mph: 6.7,
      gust_kph: 10.8,
    },
  });

  const getData = () => {
    setIsLoading(true);
    fetch(`/api/todos?timestamp=${new Date().getTime()}`, {
      // query URL without using browser cache
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0",
      },
      method: "GET",
    })
      .then((data) => data.json())
      .then((data) => {
        if (data != null) {
          let res: TODOS_t[] = data.data.map((x: any) => {
            return {
              ...x,
              due_date_at: x.due_date,
              due_date: formatDate(x.due_date),
              due_date_desc: msToTime(
                Date.now() - new Date(x.due_date).getTime(),
              ),
              created_at: formatDate(x.created_at),
              updated_at: formatDate(x.updated_at),
            };
          });
          setAllTask(res);
          setTodos(res.filter((x: TODOS_t) => x.is_done === false));
          setDones(res.filter((x: TODOS_t) => x.is_done === true));
          setIsLoading(false);
        }
      });
  };

  useEffect(() => {
    setRefresh(true);

    if ("geolocation" in navigator) {
      // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const { latitude, longitude } = coords;
        console.log(process.env.NEXT_PUBLIC_OPEN_WEATHER_KEY);
        fetch(
          `http://api.weatherapi.com/v1/current.json?q=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`,
        )
          .then((data) => data.json())
          .then((data) => {
            setWeatherInfo(data);
          });
      });
    }
  }, []);

  useEffect(() => {
    if (refresh) {
      getData();
      setRefresh(false);
    }
  }, [refresh]);

  useEffect(() => {
    console.log(weatherInfo);
  }, [weatherInfo]);

  const handleFilter = () => {
    setTodos(
      todos.filter(
        (x: TODOS_t) =>
          x.title.includes(filterStr) || x.description?.includes(filterStr),
      ),
    );
    setDones(
      dones.filter(
        (x: TODOS_t) =>
          x.title.includes(filterStr) || x.description?.includes(filterStr),
      ),
    );
  };

  const handleClearFilter = () => {
    setTodos(allTask.filter((x: TODOS_t) => x.is_done === false));
    setDones(allTask.filter((x: TODOS_t) => x.is_done === true));
    setFilterStr("");
  };
  return (
    <>
      <Typography variant="h4" className=" font-bold py-4">
        To Do List
      </Typography>
      {weatherInfo && <WeatherInfo data={weatherInfo}></WeatherInfo>}
      <Box className=" w-7/12 flex flex-col gap-4">
        <Box className="flex flex-row gap-2">
          <TextField
            id="search-bar"
            label="Search"
            className="w-full"
            placeholder="Search titles or descriptions..."
            helperText={`Found ${todos.length + dones.length} tasks from ${
              allTask.length
            } tasks`}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end" className="gap-1">
                  <Button
                    onClick={handleClearFilter}
                    startIcon={<SearchOffIcon />}
                    variant="contained"
                    color="warning"
                  >
                    Clear
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleFilter}
                  >
                    Search
                  </Button>
                </InputAdornment>
              ),
            }}
            onChange={(e) => setFilterStr(e.target.value)}
            value={filterStr}
          />
          <AddTodosButton
            priorities={PRIORITY}
            allTask={allTask}
            setRefresh={setRefresh}
          />
        </Box>
        <ToDoList
          priorities={PRIORITY}
          title={"Pending"}
          todos={todos}
          isLoading={isLoading}
          setRefresh={setRefresh}
          allTask={allTask}
        />
        <ToDoList
          priorities={PRIORITY}
          title={"Done"}
          todos={dones}
          isLoading={isLoading}
          setRefresh={setRefresh}
          allTask={allTask}
        />
      </Box>
    </>
  );
}
