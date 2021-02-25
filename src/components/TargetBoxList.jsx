import React, { forwardRef, useRef, useImperativeHandle } from "react";
import { DropTarget, DragSource } from "react-dnd";

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

const BoxList = forwardRef(
  ({ list, connectDropTarget, connectDragSource, isOver, sourceItem }, ref) => {
    const listStyle = {
      cursor: "move",
      border: "1px solid #ccc",
      marginBottom: 10,
    };

    const elementRef = useRef(null);
    connectDragSource(elementRef);
    connectDropTarget(elementRef);
    useImperativeHandle(ref, () => ({
      getNode: () => elementRef.current,
    }));

    // 如果是内部数组拖动，无需改变颜色
    if (isOver && !sourceItem.list) {
      const res = list.map((o) => o.id).includes(sourceItem.id);
      listStyle["border"] = `2px solid ${!res ? "green" : "red"}`;
    }

    return (
      <article ref={elementRef} style={listStyle}>
        {list.map((item) => (
          <Box data={item} key={item.id} />
        ))}
      </article>
    );
  }
);

const targetSpec = {
  drop: (props, monitor) => {
    // list存在表示内部拖动，无需改变值
    if (monitor.didDrop() || monitor.getItem().list) {
      return;
    }
    props.pushData(props.list, monitor.getItem());
  },
  hover: (props, monitor, component) => {
    const list = monitor.getItem().list;
    // 不是数组，表示当前操作是外部进来，无需排序操作
    if (!Array.isArray(list) || !component) {
      return null;
    }
    // node = HTML Div element from imperative API
    const node = component.getNode();
    if (!node) {
      return null;
    }
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;
    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }
    // Determine rectangle on screen
    const hoverBoundingRect = node.getBoundingClientRect();
    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    // Determine mouse position
    const clientOffset = monitor.getClientOffset();
    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;
    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%
    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }
    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }
    // Time to actually perform the action
    props.moveData(dragIndex, hoverIndex);
    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  },
};

const sourceSpec = {
  beginDrag: (props) => {
    return {
      list: props.list,
      index: props.index,
    };
  },
};
export default DropTarget("BOX", targetSpec, (connect, monitor, component) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  sourceItem: monitor.getItem(),
}))(
  DragSource("BOX", sourceSpec, (connect, monitor, component) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }))(BoxList)
);
