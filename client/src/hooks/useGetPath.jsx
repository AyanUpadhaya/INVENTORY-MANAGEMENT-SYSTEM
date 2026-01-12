
import { useLocation, matchPath } from "react-router-dom";

export default function useGetPath() {
  const location = useLocation();
  const currentPath = location.pathname;

  function isPathActive(pathList = []) {
    return pathList.some((path) => {
      const isDynamic = path.includes(":") || path.endsWith("*");

      return matchPath(
        { path, end: !isDynamic }, // 👈 KEY FIX
        currentPath
      );
    });
  }

  return { isPathActive, currentPath };
}