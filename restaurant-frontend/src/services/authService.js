// src/services/authService.js
export const loginAdminAPI = async (email, password) => {
  try {
    const res = await fetch("https://7-eleven-backend.vercel.app/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // ✅ Important to send SID cookie
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    return data; // { success, message, dashboard, user }
  } catch (err) {
    console.error("Login error:", err);
    return { success: false, message: "Network error" };
  }
};

export const checkAuthAPI = async () => {
  try {
    const res = await fetch("https://7-eleven-backend.vercel.app/api/current-user-details", {
      method: "post",
      credentials: "include",
    });
    return await res.json(); // { success, user }
  } catch (err) {
    console.error("Check auth error:", err);
    return { success: false };
  }
};

export const logoutAdminAPI = async () => {
  try {
    await fetch("https://7-eleven-backend.vercel.app/api/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch (err) {
    console.error("Logout error:", err);
  }
};
