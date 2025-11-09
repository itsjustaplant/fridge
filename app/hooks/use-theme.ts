import * as React from "react";

export function useTheme() {
	const [isDark, setIsDark] = React.useState(false);

	React.useEffect(() => {
		const saved = localStorage.getItem("theme");
		const prefersDark = window.matchMedia(
			"(prefers-color-scheme: dark)",
		).matches;
		const dark = saved ? saved === "dark" : prefersDark;
		setIsDark(dark);
		document.documentElement.classList.toggle("dark", dark);
	}, []);

	React.useEffect(() => {
		document.documentElement.classList.toggle("dark", isDark);
		localStorage.setItem("theme", isDark ? "dark" : "light");
	}, [isDark]);

	const toggleTheme = React.useCallback(() => setIsDark((v) => !v), []);

	return { isDark, toggleTheme };
}
