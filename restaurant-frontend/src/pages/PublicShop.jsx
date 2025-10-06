import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API_BASE = "https://7-eleven-backend.vercel.app/api/public";

const PublicShop = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Checkout form (replaces prompt)
  const [customerName, setCustomerName] = useState(() => localStorage.getItem("customerName") || "");
  const [phone, setPhone] = useState(() => localStorage.getItem("phone") || "");
  const [ tableNumber ,setTableNumber]  = useState(() => localStorage.getItem("table_number") || "");

  const [loading, setLoading] = useState(false);
  const [orderMessage, setOrderMessage] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Check screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_BASE}/get-all-products`);
        setProducts(Array.isArray(res.data.products) ? res.data.products : []);
      } catch (error) {
        console.error("Error fetching products", error);
        setProducts([]);
        setErrorMsg("Failed to load products.");
      }
    };
    fetchProducts();
  }, []);

  // Persist cart + customer info
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);
  useEffect(() => {
    localStorage.setItem("customerName", customerName);
  }, [customerName]);
  useEffect(() => {
    localStorage.setItem("phone", phone);
  }, [phone]);
  useEffect(() => {
    localStorage.setItem("table_number", tableNumber);
  }, [tableNumber]);


  // Auto-hide backend message after 10s (but not while showing QR)
  useEffect(() => {
    if (orderMessage && !qrCode) {
      const t = setTimeout(() => setOrderMessage(null), 10000);
      return () => clearTimeout(t);
    }
  }, [orderMessage, qrCode]);

  const totalAmount = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cart]
  );
  const totalItems = useMemo(() => cart.reduce((n, i) => n + i.qty, 0), [cart]);

  // Add/remove
  const toggleCart = (product) => {
    setErrorMsg(null);
    setCart((prev) => {
      const inCart = prev.find((i) => i._id === product._id);
      if (inCart) return prev.filter((i) => i._id !== product._id);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  // Quantity with stock guard
  const changeQty = (id, delta) => {
    setErrorMsg(null);
    setCart((prev) =>
      prev
        .map((item) => {
          if (item._id !== id) return item;
          const nextQty = Math.max(1, Math.min(item.qty + delta, item.stock ?? Infinity));
          return { ...item, qty: nextQty };
        })
        .filter((x) => x.qty > 0)
    );
  };

  const removeLine = (id) => setCart((prev) => prev.filter((i) => i._id !== id));
  const clearCart = () => setCart([]);

  // Basic Indian phone check (10 digits). Not overly strict; backend still gets the string.
  const phoneLooksOk = /^\d{10}$/.test(phone.trim());

  // Create order
  const handlePayment = async () => {
    setErrorMsg(null);

    if (cart.length === 0) {
      setErrorMsg("Your cart is empty.");
      return;
    }
    if (!customerName.trim() || !phone.trim()) {
      setShowCheckout(true);
      setErrorMsg("Please fill your name and phone to continue.");
      return;
    }
    if (!phoneLooksOk) {
      setShowCheckout(true);
      setErrorMsg("Phone should be 10 digits.");
      return;
    }

    setLoading(true);
    try {
      const items = cart.map((item) => ({
        name: item.name,
        price: item.price,
        qty: item.qty,
      }));

      const res = await axios.post(`${API_BASE}/create-order`, {
        items,
        customerName: customerName.trim(),
        phone: phone.trim(),
        table_number:tableNumber
      });

      // Show everything the backend sends
      setOrderMessage(res.data?.message || "Order created successfully!");
      setOrderId(res.data?.orderId || null);
      setQrCode(res.data?.qrCodeUrl || null);

      // Reset cart
      setCart([]);
      localStorage.removeItem("cart");
      setShowCheckout(false);
    } catch (error) {
      console.error("Payment error:", error);
      setErrorMsg(
        error?.response?.data?.error ||
          "Something went wrong while creating the order."
      );
    } finally {
      setLoading(false);
    }
  };

  // Download QR helper
  const downloadQR = () => {
    if (!qrCode) return;
    const a = document.createElement("a");
    a.href = qrCode;
    a.download = `${orderId || "order"}-upi-qr.png`;
    a.click();
  };

  return (
    <div style={{ 
      maxWidth: 1200, 
      margin: "0 auto", 
      padding: isMobile ? "16px" : "20px 24px",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      color: "#333"
    }}>
      {/* Header with logo and trust badges */}
      <header style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        justifyContent: "space-between",
        alignItems: isMobile ? "flex-start" : "center",
        gap: isMobile ? "12px" : 0,
        marginBottom: 30,
        paddingBottom: 20,
        borderBottom: "1px solid #f0f0f0"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            background: "#4f46e5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
            fontSize: 20
          }}>S</div>
          <h1 style={{ 
            margin: 0, 
            fontSize: isMobile ? 20 : 24, 
            fontWeight: 700,
            color: "#111"
          }}>ShopName</h1>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ fontSize: 14, color: "#666" }}>Secure Checkout</div>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ width: 24, height: 24, background: "#f0f0f0", borderRadius: 4 }}></div>
            <div style={{ width: 24, height: 24, background: "#f0f0f0", borderRadius: 4 }}></div>
            <div style={{ width: 24, height: 24, background: "#f0f0f0", borderRadius: 4 }}></div>
          </div>
        </div>
      </header>

      {/* Flash message / error */}
      {orderMessage && !qrCode && (
        <div style={{ 
          padding: 16, 
          borderRadius: 8, 
          background: "#f0fdf4",
          border: "1px solid #bbf7d0", 
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          gap: 12
        }}>
          <div style={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: "#22c55e",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            flexShrink: 0
          }}>✓</div>
          <div>{orderMessage}</div>
        </div>
      )}
      {errorMsg && (
        <div style={{ 
          padding: 16, 
          borderRadius: 8, 
          background: "#fef2f2",
          border: "1px solid #fecaca", 
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          gap: 12
        }}>
          <div style={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: "#ef4444",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            flexShrink: 0
          }}>!</div>
          <div>{errorMsg}</div>
        </div>
      )}

      <div style={{ 
        display: "flex", 
        flexDirection: isMobile ? "column" : "row", 
        gap: isMobile ? 24 : 32, 
        alignItems: "flex-start" 
      }}>
        {/* Main content */}
        <div style={{ flex: 1, width: "100%" }}>
          <h2 style={{ 
            margin: "0 0 20px 0",
            fontSize: isMobile ? 18 : 20,
            fontWeight: 600,
            color: "#111",
            paddingBottom: 12,
            borderBottom: "1px solid #f0f0f0"
          }}>Our Menu</h2>

          {/* Products */}
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(280px, 1fr))",
            gap: isMobile ? 16 : 24,
          }}>
            {products.length > 0 ? (
              products.map((p) => {
                const inCart = cart.find((i) => i._id === p._id);
                const outOfStock = (p.stock ?? 0) <= 0;
                return (
                  <div
                    key={p._id}
                    style={{
                      border: "1px solid #f0f0f0",
                      borderRadius: 12,
                      overflow: "hidden",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      ":hover": {
                        transform: isMobile ? "none" : "translateY(-2px)",
                        boxShadow: isMobile ? "0 2px 8px rgba(0,0,0,0.04)" : "0 4px 12px rgba(0,0,0,0.08)"
                      }
                    }}
                  >
                    <div style={{ position: "relative" }}>
                      <img
                        src={p.images?.[0]?.url || "https://via.placeholder.com/300x200?text=Product"}
                        alt={p.name}
                        style={{
                          width: "100%",
                          height: isMobile ? 140 : 180,
                          objectFit: "cover",
                          display: "block"
                        }}
                      />
                      {outOfStock && (
                        <div style={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          background: "#ef4444",
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: 4,
                          fontSize: 12,
                          fontWeight: 600
                        }}>
                          Out of stock
                        </div>
                      )}
                    </div>
                    <div style={{ padding: isMobile ? 12 : 16 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                        <h3 style={{ margin: 0, fontSize: isMobile ? 15 : 16, fontWeight: 600 }}>{p.name}</h3>
                        <div style={{ fontWeight: 700, color: "#4f46e5" }}>₹{p.price}</div>
                      </div>
                      <div style={{ fontSize: isMobile ? 13 : 14, color: "#666", marginBottom: isMobile ? 12 : 16 }}>
                        {p.description || p.category}
                      </div>

                      {!outOfStock && (
                        <>
                          <button
                            onClick={() => toggleCart(p)}
                            style={{
                              width: "100%",
                              padding: isMobile ? "8px" : "10px",
                              borderRadius: 8,
                              background: inCart ? "#fee2e2" : "#4f46e5",
                              color: inCart ? "#b91c1c" : "white",
                              border: "none",
                              cursor: "pointer",
                              fontWeight: 600,
                              fontSize: isMobile ? 13 : 14,
                              transition: "background 0.2s"
                            }}
                          >
                            {inCart ? "Remove from Cart" : "Add to Cart"}
                          </button>

                          {inCart && (
                            <div style={{ 
                              display: "flex", 
                              justifyContent: "center", 
                              gap: 16, 
                              marginTop: 12, 
                              alignItems: "center" 
                            }}>
                              <button 
                                onClick={() => changeQty(p._id, -1)} 
                                style={{ 
                                  padding: "6px 12px",
                                  background: "#f3f4f6",
                                  border: "none",
                                  borderRadius: 6,
                                  cursor: "pointer",
                                  fontWeight: 600
                                }}
                              >
                                −
                              </button>
                              <span style={{ fontWeight: 600 }}>{inCart.qty}</span>
                              <button
                                onClick={() => {
                                  if ((inCart.qty + 1) > (p.stock ?? Infinity)) return;
                                  changeQty(p._id, +1);
                                }}
                                style={{ 
                                  padding: "6px 12px",
                                  background: "#f3f4f6",
                                  border: "none",
                                  borderRadius: 6,
                                  cursor: "pointer",
                                  fontWeight: 600
                                }}
                                title={p.stock ? `Max ${p.stock}` : undefined}
                              >
                                +
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ 
                padding: 40, 
                textAlign: "center", 
                background: "#f9fafb", 
                borderRadius: 12,
                gridColumn: "1 / -1"
              }}>
                <div style={{ fontSize: 16, color: "#666" }}>No products available at the moment.</div>
              </div>
            )}
          </div>
        </div>

        {/* Cart sidebar - moves to bottom on mobile */}
        {(!isMobile || cart.length > 0 || showCheckout) && (
          <div style={{ 
            width: isMobile ? "100%" : 360,
            position: isMobile ? "static" : "sticky",
            top: 20,
            background: "#fff",
            borderRadius: 12,
            border: "1px solid #f0f0f0",
            boxShadow: isMobile ? "0 -2px 8px rgba(0,0,0,0.04)" : "0 2px 12px rgba(0,0,0,0.04)",
            padding: isMobile ? 16 : 20
          }}>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              marginBottom: 20,
              paddingBottom: 16,
              borderBottom: "1px solid #f0f0f0"
            }}>
              <h2 style={{ margin: 0, fontSize: isMobile ? 16 : 18, fontWeight: 600 }}>Your Order</h2>
              <div style={{ 
                fontSize: 14, 
                color: "#666",
                display: "flex",
                alignItems: "center",
                gap: 6
              }}>
                <span>{totalItems} item{totalItems === 1 ? "" : "s"}</span>
              </div>
            </div>

            {cart.length === 0 ? (
              <div style={{ 
                padding: "24px 0", 
                textAlign: "center",
                color: "#666"
              }}>
                <div style={{ marginBottom: 8 }}>🛒</div>
                <div>Your cart is empty</div>
              </div>
            ) : (
              <>
                <div style={{ 
                  maxHeight: isMobile ? "none" : 400,
                  overflowY: "auto",
                  marginBottom: 20,
                  paddingRight: 8
                }}>
                  {cart.map((item) => (
                    <div 
                      key={item._id} 
                      style={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "center",
                        padding: "12px 0",
                        borderBottom: "1px solid #f5f5f5"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{
                          width: 40,
                          height: 40,
                          borderRadius: 8,
                          background: "#f5f5f5",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 12,
                          color: "#666"
                        }}>{item.qty}x</div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: isMobile ? 13 : 14 }}>{item.name}</div>
                          <div style={{ fontSize: isMobile ? 12 : 13, color: "#666" }}>₹{item.price} each</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ fontWeight: 700, fontSize: isMobile ? 14 : 15 }}>₹{item.price * item.qty}</div>
                        <button 
                          onClick={() => removeLine(item._id)} 
                          style={{ 
                            padding: "4px 8px",
                            background: "none",
                            border: "none",
                            color: "#666",
                            cursor: "pointer",
                            fontSize: 12
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  marginBottom: 20,
                  padding: "12px 0",
                  borderTop: "1px solid #f0f0f0",
                  borderBottom: "1px solid #f0f0f0"
                }}>
                  <div style={{ fontWeight: 600 }}>Total</div>
                  <div style={{ fontSize: isMobile ? 16 : 18, fontWeight: 800, color: "#4f46e5" }}>₹{totalAmount}</div>
                </div>

                {/* Checkout form */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center",
                    marginBottom: 16
                  }}>
                    <h3 style={{ margin: 0, fontSize: isMobile ? 15 : 16 }}>Customer details</h3>
                    <button 
                      onClick={() => setShowCheckout((s) => !s)} 
                      style={{ 
                        padding: "6px 10px",
                        background: "none",
                        border: "1px solid #e5e7eb",
                        borderRadius: 6,
                        cursor: "pointer",
                        fontSize: 13,
                        color: "#4f46e5"
                      }}
                    >
                      {showCheckout ? "Hide" : "Edit"}
                    </button>
                  </div>

                  {showCheckout && (
                    <div style={{ display: "grid", gap: 16, marginBottom: 20 }}>
                      <div style={{ display: "grid", gap: 8 }}>
                        <label htmlFor="name" style={{ fontSize: 14, fontWeight: 500 }}>Your Name</label>
                        <input
                          id="name"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="Full name"
                          style={{ 
                            padding: "10px 12px",
                            borderRadius: 8,
                            border: "1px solid #e5e7eb",
                            fontSize: 14,
                            ":focus": {
                              outline: "none",
                              borderColor: "#4f46e5",
                              boxShadow: "0 0 0 2px rgba(79, 70, 229, 0.1)"
                            }
                          }}
                        />
                      </div>
                      <div style={{ display: "grid", gap: 8 }}>
                        <label htmlFor="phone" style={{ fontSize: 14, fontWeight: 500 }}>Phone Number</label>
                        <input
                          id="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="10-digit number"
                          inputMode="numeric"
                          style={{ 
                            padding: "10px 12px",
                            borderRadius: 8,
                            border: "1px solid #e5e7eb",
                            fontSize: 14,
                            ":focus": {
                              outline: "none",
                              borderColor: "#4f46e5",
                              boxShadow: "0 0 0 2px rgba(79, 70, 229, 0.1)"
                            }
                          }}
                        />
                        {!phoneLooksOk && phone.length > 0 && (
                          <div style={{ fontSize: 12, color: "#ef4444" }}>Please enter a valid 10-digit phone number</div>
                        )}
                      </div>

                        <div style={{ display: "grid", gap: 8 }}>
                        <label htmlFor="name" style={{ fontSize: 14, fontWeight: 500 }}>Table Number</label>
                        <input
                          id="table_number"
                          value={tableNumber}
                          onChange={(e) => setTableNumber(e.target.value)}
                          placeholder="Table Number"
                          style={{ 
                            padding: "10px 12px",
                            borderRadius: 8,
                            border: "1px solid #e5e7eb",
                            fontSize: 14,
                            ":focus": {
                              outline: "none",
                              borderColor: "#4f46e5",
                              boxShadow: "0 0 0 2px rgba(79, 70, 229, 0.1)"
                            }
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handlePayment}
                    disabled={loading || cart.length === 0}
                    style={{
                      width: "100%",
                      padding: isMobile ? "12px" : "14px",
                      borderRadius: 10,
                      background: loading ? "#9ca3af" : "#4f46e5",
                      color: "white",
                      border: "none",
                      cursor: loading ? "not-allowed" : "pointer",
                      fontWeight: 600,
                      fontSize: isMobile ? 14 : 15,
                      transition: "background 0.2s",
                      marginBottom: 12
                    }}
                  >
                    {loading ? (
                      <span>Processing...</span>
                    ) : (
                      <span>Proceed to Payment</span>
                    )}
                  </button>
                  <div style={{ 
                    fontSize: 12, 
                    color: "#666", 
                    textAlign: "center",
                    lineHeight: 1.5
                  }}>
                    <div>100% secure payment</div>
                    <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 8 }}>
                      <div style={{ width: 40, height: 24, background: "#f0f0f0", borderRadius: 4 }}></div>
                      <div style={{ width: 40, height: 24, background: "#f0f0f0", borderRadius: 4 }}></div>
                      <div style={{ width: 40, height: 24, background: "#f0f0f0", borderRadius: 4 }}></div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Payment section: backend message above QR */}
      {(orderMessage || qrCode) && (
        <div style={{ 
          marginTop: 40, 
          paddingTop: 40,
          borderTop: "1px solid #f0f0f0",
          textAlign: "center",
          maxWidth: 600,
          marginLeft: "auto",
          marginRight: "auto",
          padding: isMobile ? "0 16px" : 0
        }}>
          <div style={{ 
            background: "#f5f3ff",
            borderRadius: 12,
            padding: isMobile ? 16 : 24,
            marginBottom: 32
          }}>
            {orderMessage && <h3 style={{ margin: "0 0 16px 0", fontSize: isMobile ? 16 : 18 }}>{orderMessage}</h3>}
            {orderId && (
              <div style={{ 
                marginBottom: 16, 
                fontSize: 14,
                background: "#ede9fe",
                display: "inline-block",
                padding: "8px 16px",
                borderRadius: 20,
                color: "#4f46e5",
                fontWeight: 500
              }}>
                Order ID: <strong>{orderId}</strong>
              </div>
            )}
            {qrCode && (
              <>
                <h2 style={{ margin: "24px 0 16px", fontSize: isMobile ? 18 : 20 }}>Scan to Pay via UPI</h2>
                <div style={{
                  display: "inline-block",
                  padding: 16,
                  background: "white",
                  borderRadius: 12,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  marginBottom: 20
                }}>
                  <img 
                    src={qrCode} 
                    alt="UPI QR Code" 
                    style={{ 
                      width: isMobile ? 180 : 220, 
                      height: isMobile ? 180 : 220,
                      display: "block"
                    }} 
                  />
                </div>
                <div style={{ marginTop: 16 }}>
                  <button 
                    onClick={downloadQR} 
                    style={{ 
                      padding: "10px 16px",
                      background: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: 8,
                      cursor: "pointer",
                      fontWeight: 500,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8
                    }}
                  >
                    <span>Download QR</span>
                    <span>↓</span>
                  </button>
                </div>
                <div style={{ 
                  marginTop: 24,
                  padding: 16,
                  background: "#f0fdf4",
                  borderRadius: 8,
                  fontSize: 14,
                  color: "#166534"
                }}>
                  After payment, your order will be verified and processed.
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{
        marginTop: 60,
        paddingTop: 40,
        borderTop: "1px solid #f0f0f0",
        textAlign: "center",
        color: "#666",
        fontSize: 14,
        padding: isMobile ? "0 16px" : 0
      }}>
        <div style={{ marginBottom: 16 }}>
          © {new Date().getFullYear()} ShopName. All rights reserved.
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
          <a href="#" style={{ color: "#4f46e5" }}>Terms</a>
          <a href="#" style={{ color: "#4f46e5" }}>Privacy</a>
          <a href="#" style={{ color: "#4f46e5" }}>Contact</a>
        </div>
      </footer>
    </div>
  );
};

export default PublicShop;