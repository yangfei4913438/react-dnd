import React from "react";
import SourceBox from "./SourceBox";
import TargetContainer from "./TargetContainer";
import { Colors } from "./Colors";

const sourceList = [
  {
    id: 1,
    name: "蓝色",
    color: Colors.BLUE,
  },
  {
    id: 2,
    name: "黄色",
    color: Colors.YELLOW,
  },
  {
    id: 3,
    name: "绿色",
    color: Colors.GREEN,
  },
  {
    id: 4,
    name: "灰色",
    color: Colors.GRAY,
  },
  {
    id: 5,
    name: "粉色",
    color: Colors.PINK,
  },
];

const Container = () => {
  return (
    <div style={{ overflow: "hidden", clear: "both", margin: "-.5rem" }}>
      <div style={{ float: "left" }}>
        {sourceList.map((item) => {
          return <SourceBox data={item} key={item.id} />;
        })}
      </div>

      <div style={{ float: "left", marginLeft: "5rem", marginTop: ".5rem" }}>
        <TargetContainer />
      </div>
    </div>
  );
};

export default Container;
