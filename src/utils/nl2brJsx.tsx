import React from "react";

const nl2brJsx = (text: string): (string | React.ReactElement)[] =>
  text
    .split("\n")
    .map((line, index, array) =>
      index < array.length - 1 ? [line, <br key={index} />] : line
    )
    .flat();

export default nl2brJsx;
