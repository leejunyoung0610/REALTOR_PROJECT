export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid #eee",
        padding: "24px 0",
        fontSize: 13,
        color: "#5ba1b1",
        background: "#fff",
        marginTop: "auto", // Flex container에서 하단에 고정
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 20px",
        }}
      >
        <div style={{ marginBottom: 4, fontWeight: 600 }}>베리굿 부동산</div>
        <div style={{ marginBottom: 4 }}>충남 천안시 서북구 불당동</div>
        <div>☎ 010-1234-5678</div>
      </div>
    </footer>
  );
}
