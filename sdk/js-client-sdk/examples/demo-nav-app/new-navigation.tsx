import React from "react";

const NewNavigation: React.FC = () => {
  return (
    <>
      <div
        style={{
          backgroundColor: "white",
          color: "black",
          height: "100%",
          width: "100%",
          padding: "5px",
          display: "flex",
          flexDirection: "row",
          justifyItems: "center",
        }}
      >
        <>New Navigation</>
        <a style={{ margin: "0 10px" }} href="">
          Some menu item
        </a>
        <a style={{ margin: "0 10px" }} href="">
          Some menu item
        </a>
        <a style={{ margin: "0 10px" }} href="">
          Some menu item
        </a>
      </div>
      <hr />
    </>
  );
};

export default NewNavigation;
