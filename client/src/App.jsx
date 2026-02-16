import React, { useMemo, useState } from "react";
import LibraryPage from "./pages/LibraryPage.jsx";

import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";

import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";

const drawerWidth = 280;

export default function App() {
  const [active, setActive] = useState("library");

  const title = useMemo(() => {
    if (active === "library") return "Библиотека";
    if (active === "other1") return "Раздел 2";
    return "Раздел 3";
  }, [active]);

  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: "white",
          color: "#111827",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Dashboard
          </Typography>
          <Box sx={{ flex: 1 }} />
          <Typography variant="body2" sx={{ color: "rgba(17,24,39,0.7)" }}>
            {title}
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            background: "#111827",
            color: "white",
            borderRight: "none",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ px: 2, py: 2 }}>
          <Typography sx={{ fontWeight: 800 }}>Навигация</Typography>
        </Box>
        <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

        <List sx={{ px: 1, py: 1 }}>
          <ListItemButton
            onClick={() => setActive("library")}
            selected={active === "library"}
            sx={{
              borderRadius: 2,
              mx: 1,
              mb: 1,
              "&.Mui-selected": { background: "rgba(255,255,255,0.10)" },
              "&.Mui-selected:hover": { background: "rgba(255,255,255,0.14)" },
              "&:hover": { background: "rgba(255,255,255,0.08)" },
            }}
          >
            <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
              <LibraryBooksIcon />
            </ListItemIcon>
            <ListItemText primary="Библиотека" />
          </ListItemButton>

          <ListItemButton
            onClick={() => setActive("other1")}
            selected={active === "other1"}
            sx={{
              borderRadius: 2,
              mx: 1,
              mb: 1,
              "&.Mui-selected": { background: "rgba(255,255,255,0.10)" },
              "&.Mui-selected:hover": { background: "rgba(255,255,255,0.14)" },
              "&:hover": { background: "rgba(255,255,255,0.08)" },
            }}
          >
            <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Раздел 2" />
          </ListItemButton>

          <ListItemButton
            onClick={() => setActive("other2")}
            selected={active === "other2"}
            sx={{
              borderRadius: 2,
              mx: 1,
              mb: 1,
              "&.Mui-selected": { background: "rgba(255,255,255,0.10)" },
              "&.Mui-selected:hover": { background: "rgba(255,255,255,0.14)" },
              "&:hover": { background: "rgba(255,255,255,0.08)" },
            }}
          >
            <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Раздел 3" />
          </ListItemButton>
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
          p: 3,
          minHeight: "100vh",
          background: "#f5f7fb",
        }}
      >
        <Toolbar />
        {active === "library" ? (
          <LibraryPage />
        ) : (
          <Box
            sx={{
              background: "white",
              borderRadius: 3,
              p: 3,
              border: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {title}
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(17,24,39,0.7)", mt: 1 }}>
              Раздел сделан как пункт меню, без функционала
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
