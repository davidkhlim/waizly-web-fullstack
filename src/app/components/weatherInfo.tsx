import { Paper, Typography } from "@mui/material";
import Image from "next/image";

type PROPS_t = {
  data: { [keys: string]: any };
};
export default function WeatherInfo(props: PROPS_t) {
  return (
    <>
      {props.data && (
        <Paper className="flex flex-col items-center">
          <Typography>{props.data.current.temp_c}°C</Typography>
          <Typography>{props.data.location.name}</Typography>
          <Image
            src={"https:" + props.data.current.condition.icon}
            alt={""}
            width={64}
            height={64}
          />
          <Typography>{props.data.current.condition.text}</Typography>
          <Typography>
            Powered by{" "}
            <a href="https://www.weatherapi.com/" title="Free Weather API">
              WeatherAPI.com
            </a>
          </Typography>
        </Paper>
      )}
    </>
  );
}
