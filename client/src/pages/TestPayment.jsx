import { useState } from "react";

const API = "http://localhost:4000";

const TestPayment = () => {
  const [log, setLog] = useState([]);
  const [url, setUrl] = useState("");

  const addLog = (msg, color = "#fff") =>
    setLog((p) => [{ msg: typeof msg === "object" ? JSON.stringify(msg, null, 2) : msg, color, ts: new Date().toLocaleTimeString() }, ...p]);

  const handleTest = async () => {
    addLog("▶ Gọi GET /api/payments/test-url ...", "#60a5fa");
    try {
      const res = await fetch(`${API}/api/payments/test-url`);
      const data = await res.json();
      if (data.paymentUrl) {
        addLog(`✅ URL OK — txnRef: ${data.txnRef}`, "#4ade80");
        addLog(data.paymentUrl, "#a78bfa");
        setUrl(data.paymentUrl);
      } else {
        addLog(`❌ ${JSON.stringify(data)}`, "#f87171");
      }
    } catch (e) {
      addLog(`❌ fetch lỗi: ${e.message}`, "#f87171");
    }
  };

  return (
    <div style={{ fontFamily: "monospace", padding: 32, maxWidth: 860, margin: "0 auto" }}>
      <h2 style={{ marginBottom: 8 }}>🧪 VNPay Test</h2>

      {/* Thẻ test */}
      <div style={{ background: "#fef9c3", border: "1px solid #fde047", borderRadius: 8, padding: 14, marginBottom: 20, fontSize: 13 }}>
        <b>Thẻ NCB test:</b> &nbsp;
        <code>9704198526191432198</code> &nbsp;|&nbsp;
        Tên: <code>NGUYEN VAN A</code> &nbsp;|&nbsp;
        PH: <code>07/15</code> &nbsp;|&nbsp;
        OTP: <code>123456</code>
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <button onClick={handleTest}
          style={{ padding: "10px 24px", background: "#7c3aed", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: "bold", fontSize: 14 }}>
          🚀 Lấy URL VNPay (10.000đ)
        </button>

        {url && (
          <a href={url} target="_blank" rel="noreferrer"
            style={{ padding: "10px 24px", background: "#0ea5e9", color: "#fff", borderRadius: 8, textDecoration: "none", fontWeight: "bold", fontSize: 14, display: "inline-flex", alignItems: "center" }}>
            💳 Mở trang thanh toán VNPay →
          </a>
        )}

        <button onClick={() => setLog([])}
          style={{ padding: "10px 16px", background: "#e5e7eb", borderRadius: 8, border: "none", cursor: "pointer" }}>
          Clear
        </button>
      </div>

      {/* Log */}
      <div style={{ background: "#0f172a", borderRadius: 10, padding: 16, minHeight: 200, maxHeight: 460, overflowY: "auto" }}>
        {log.length === 0
          ? <p style={{ color: "#475569", fontSize: 13 }}>Nhấn nút để bắt đầu...</p>
          : log.map((e, i) => (
            <div key={i} style={{ marginBottom: 5, fontSize: 12 }}>
              <span style={{ color: "#475569" }}>[{e.ts}] </span>
              <span style={{ color: e.color, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{e.msg}</span>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default TestPayment;
