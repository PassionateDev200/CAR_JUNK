/** route: src/app/manage/[accessToken]/loading.jsx */

export default function Loading() {
  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes quote-loading-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .quote-loading-spinner {
            animation: quote-loading-spin 1s linear infinite;
          }
        `
      }} />
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#f3f2ef",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          {/* Custom CSS Spinner */}
          <div
            className="quote-loading-spinner"
            style={{
              width: "48px",
              height: "48px",
              border: "4px solid #e0dfdc",
              borderTop: "4px solid #0a66c2",
              borderRadius: "50%",
              margin: "0 auto 16px",
            }}
          />
          <p
            style={{
              color: "#666666",
              fontSize: "0.938rem",
              fontWeight: 500,
              margin: 0,
            }}
          >
            Loading your quote...
          </p>
        </div>
      </div>
    </>
  );
}
