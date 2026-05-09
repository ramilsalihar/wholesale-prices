import React from 'react';

export const RouterContext = React.createContext(null);
export const useRouter = () => React.useContext(RouterContext);

export function RouterProvider({ initial = { screen: 'home' }, children }) {
  const [route, setRoute] = React.useState(initial);
  const [history, setHistory] = React.useState([initial]);
  const go = (next) => {
    setRoute(next);
    setHistory((h) => [...h, next]);
  };
  const back = () => {
    setHistory((h) => {
      if (h.length <= 1) return h;
      const next = h.slice(0, -1);
      setRoute(next[next.length - 1]);
      return next;
    });
  };
  return (
    <RouterContext.Provider value={{ route, go, back, history }}>
      {children}
    </RouterContext.Provider>
  );
}
