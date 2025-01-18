"use client";
import React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Monitor } from "@phosphor-icons/react";
import { IconButton, Menu, MenuItem } from "@mui/material";

const ThemeToggleBtn = () => {
  const { setTheme, theme } = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleClick} color="inherit" size="medium">
        {theme === "dark" && <Moon size={28} weight="fill" color="#FF7000" />}
        {theme === "light" && <Sun size={28} weight="fill" color="#FF7000" />}
        {theme === "system" && (
          <Monitor size={28} weight="fill" color="#FF7000" />
        )}
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        classes={{
          paper: "!rounded-xl !shodow-lg !background-light800_dark400",
        }}
      >
        <MenuItem
          onClick={() => {
            setTheme("light");
            handleClose();
          }}
          className="text-dark-100 dark:text-light-900"
        >
          <Sun size={20} style={{ marginRight: "0.5rem" }} />
          Light Mode
        </MenuItem>
        <MenuItem
          onClick={() => {
            setTheme("dark");
            handleClose();
          }}
          className="text-dark-100 dark:text-light-900"
        >
          <Moon size={20} style={{ marginRight: "0.5rem" }} />
          Dark Mode
        </MenuItem>
        <MenuItem
          onClick={() => {
            setTheme("system");
            handleClose();
          }}
          className="text-dark-100 dark:text-light-900"
        >
          <Monitor size={20} style={{ marginRight: "0.5rem" }} />
          System Mode
        </MenuItem>
      </Menu>
    </>
  );
};

export default ThemeToggleBtn;
