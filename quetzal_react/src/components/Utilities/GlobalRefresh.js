let listeners = [];
let count = 0;

export const GlobalRefresh = {
  trigger: () => {
    count += 1;
    listeners.forEach((listener) => listener());
  },
  subscribe: (callback) => {
    listeners.push(callback);
    return () => {
      listeners = listeners.filter((l) => l !== callback);
    };
  },
  getSnapshot: () => count,
};
