import React from "react";
import { DropTarget } from "react-dnd";

const style = {
  height: "35px",
  lineHeight: "35px",
  width: "100%",
  textAlign: "center",
  boxSizing: "border-box",
};

const Box = ({ data }) => {
  let backgroundColor = data.color;
  return <div style={{ ...style, backgroundColor }}>{data.name}</div>;
};

const BoxList = ({ list, connectDropTarget, isOver, sourceItem }) => {
  const listStyle = {
    cursor: "move",
    border: "1px solid #ccc",
    marginBottom: 10,
  };

  if (isOver) {
    const res = list.map((o) => o.id).includes(sourceItem.id);
    listStyle["border"] = `2px solid ${!res ? "green" : "red"}`;
  }

  return connectDropTarget(
    <article style={listStyle}>
      {list.map((item) => (
        <Box data={item} key={item.id} />
      ))}
    </article>
  );
};

const TargetBoxList = DropTarget(
  "BOX",
  {
    drop(props, monitor, component) {
      if (monitor.didDrop()) {
        return;
      }
      props.pushData(props.list, monitor.getItem());
    },
  },
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    sourceItem: monitor.getItem(),
  })
)(BoxList);

export default TargetBoxList;
