import { createUseStyles } from "react-jss";
export const useStyles = createUseStyles({
  groupWrapper: {
    width: "100%",
    height: "100%",
    paddingBottom: "1px",
    position: "relative",
    overflow: "hidden",
    border: "1px solid transparent",
    borderRadius: "2px",
    "&:hover": {
      background: "#50bed7",
      borderColor: "#50bed7",
      color: "white",
    },
  },
  groupHeader: {
    padding: "0 3px 0 3px",
    fontSize: " 13px",
    userSelect: "none",
    cursor: "pointer",
  },

  groupNav: {
    width: "100%",
    height: "35px",
    display: "flex",
    justifyItems: "start",
    alignItems: "center",
    gap: 2,
    padding: "2px 6px",
    background: "white",
    fontSize: "14px",
    fontWeight: "500",
    "& button": {
      "&:hover": {
        color: "#3ebced",
      },
    },
  },
});
