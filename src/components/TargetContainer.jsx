import React, { useState, useCallback } from "react";
import { DropTarget } from "react-dnd";
import TargetBoxList from "./TargetBoxList";

const style = {
  border: "1px solid gray",
  height: "500px",
  width: "15rem",
  padding: "2rem",
  textAlign: "center",
  overflow: "auto",
};

const Target = ({ connectDropTarget, list = [], pushData = () => {} }) => {
  return connectDropTarget(
    <div style={{ ...style }}>
      {list.map((item, idx) => {
        return <TargetBoxList list={item} key={idx} pushData={pushData} />;
      })}
    </div>
  );
};

const TargetContainer = DropTarget(
  "BOX",
  {
    drop(props, monitor, component) {
      if (monitor.didDrop()) {
        return;
      }
      props.setData(monitor.getItem());
    },
  },
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    draggingColor: monitor.getItemType(),
  })
)(Target);

const StatefulTargetContainer = (props) => {
  // 二维数组
  const [list, setList] = useState([]);
  // 新扔进来的对象，直接变成一个新的数组
  const setData = useCallback(
    (item) => {
      const newList = [...list, [item]];
      setList(newList);
    },
    [list, setList]
  );

  const pushData = useCallback((target, source) => {
    if (target.map((o) => o.id).includes(source.id)) return;
    target.push(source);
  }, []);

  const moveData = useCallback(
    (dragIndex, hoverIndex) => {
      const tmp = [...list];
      [tmp[dragIndex], tmp[hoverIndex]] = [tmp[hoverIndex], tmp[dragIndex]];
      setList(tmp);
    },
    [list, setList]
  );

  return (
    <TargetContainer
      {...props}
      setData={setData}
      moveData={moveData}
      pushData={pushData}
      list={list}
    />
  );
};
export default StatefulTargetContainer;
