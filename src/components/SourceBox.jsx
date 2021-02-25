import React from "react";
import { DragSource } from "react-dnd";

const style = {
  border: "1px dashed gray",
  padding: "0.5rem",
  margin: "0.5rem",
};

const SourceBoxRaw = ({ data, isDragging, connectDragSource }) => {
  const opacity = isDragging ? 0.4 : 1;
  let backgroundColor = data.color;

  return connectDragSource(
    <div
      style={{
        ...style,
        backgroundColor,
        opacity,
        cursor: "move",
      }}
    >
      Forbid drag
    </div>
  );
};

const sourceSpec = {
  beginDrag: (props) => props.data,
};

const SourceBox = DragSource("BOX", sourceSpec, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))(SourceBoxRaw);

export default SourceBox;
