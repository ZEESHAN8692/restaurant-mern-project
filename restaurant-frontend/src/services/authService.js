
export const loginAdminAPI = async (email, password) => {
  try {
    const res = await fetch("http://localhost:8000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", 
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    return data; 
  } catch (err) {
    console.error("Login error:", err);
    return { success: false, message: "Network error" };
  }
};

export const checkAuthAPI = async () => {
  try {
    const res = await fetch("http://localhost:8000/api/current-user-details", {
      method: "post",
      credentials: "include",
    });
    return await res.json(); 
  } catch (err) {
    console.error("Check auth error:", err);
    return { success: false };
  }
};

export const logoutAdminAPI = async () => {
  try {
    await fetch("http://localhost:8000/api/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch (err) {
    console.error("Logout error:", err);
  }
};
