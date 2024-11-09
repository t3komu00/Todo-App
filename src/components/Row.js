import React from "react";

const Row = ({ item, deleteTask }) => {
  return (
    <li key={item.id}>
      {item.description}
      <button className="delete-button" onClick={() => deleteTask(item.id)}>
        Delete
      </button>
    </li>
  );
};

export default Row;
