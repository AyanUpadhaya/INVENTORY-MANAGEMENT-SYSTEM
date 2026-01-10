import { useLocation } from "react-router-dom";

export default function useGetPath() {
  const location = useLocation();
  const currentPath = location.pathname;
  function isPathActive(pathList = []) {
    return pathList.includes(currentPath);
  }

  return { isPathActive, currentPath };
}
