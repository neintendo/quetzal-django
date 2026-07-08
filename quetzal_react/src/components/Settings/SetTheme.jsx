import { useEffect, useState } from "react";
import api from "../../api";

const SetTheme = () => {
  const [profile, setProfile] = useState(null);
  const [theme, setTheme] = useState();

  const getProfile = () => {
    api
      .get("profile/")
      .then((res) => res.data)
      .then((data) => {
        setProfile(data);
      })
      .catch((err) => alert(err));
  };

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    if (profile?.theme) {
      setTheme(profile?.theme);
    }
  }, [profile]);

  useEffect(() => {
    let appliedTheme = theme;

    if (theme === "system") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      appliedTheme = prefersDark ? "dark" : "light";
    }

    document.body.setAttribute("data-theme", appliedTheme);
    setTheme(appliedTheme);
  }, [theme]);

  return { theme: theme };
};

export default SetTheme;
