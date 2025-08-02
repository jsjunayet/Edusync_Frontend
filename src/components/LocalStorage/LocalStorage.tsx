export const setLocalStorage = (key, value) => {
  if (typeof window !== "undefined") {
    if (typeof value === "object") {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.setItem(key, value);
    }
  }
};

export const getLocalStorage = (key) => {
  if (typeof window !== "undefined") {
    const value = localStorage.getItem(key);
    return value ? value : null;
  }
  return null;
};

export const getuserStorage = (key) => {
  if (typeof window !== "undefined") {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }
  return null;
};

export const removeLocalStorage = (key) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(key);
  }
};

export const setCookie = (value) => {
  if (typeof window !== "undefined") {
    document.cookie = `refreshToken=${value}; path=/; samesite=strict; secure`;
  }
};

export const getCookie = (name) => {
  if (typeof window !== "undefined") {
    const cookies = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`));
    return cookies ? cookies.split("=")[1] : null;
  }
  return null;
};

export const deleteCookie = (name) => {
  if (typeof window !== "undefined") {
    document.cookie = `${name}=; path=/; Max-Age=0; SameSite=Strict; Secure`;
  }
};
