import { useState } from "react";

const sieves = [
  { id: "53", label: "53 mm" },
  { id: "37.5", label: "37.5 mm" },
  { id: "31.5", label: "31.5 mm" },
  { id: "26.5", label: "26.5 mm" },
  { id: "19", label: "19.0 mm" },
  { id: "13.2", label: "13.2 mm" },
  { id: "4.75", label: "4.75 mm" },
  { id: "2.36", label: "2.36 mm" },
  { id: "0.425", label: "0.425 mm (425 µm)" },
  { id: "0.075", label: "0.075 mm (75 µm)" },
];

// 各製品の粒度規格（min, max）。規定なしのふるいはキー自体を持たせない
const products = [
  {
    id: "HMS-25",
    name: "HMS-25（25〜0）",
    limits: {
      "31.5": [100, 100],
      "26.5": [95, 100],
      "13.2": [60, 80],
      "4.75": [35, 60],
      "2.36": [25, 45],
      "0.425": [10, 25],
      "0.075": [3, 10],
    },
  },
  {
    id: "MS-25",
    name: "MS-25（25〜0）",
    limits: {
      "31.5": [100, 100],
      "26.5": [95, 100],
      "13.2": [55, 85],
      "4.75": [30, 65],
      "2.36": [20, 50],
      "0.425": [10, 30],
      "0.075": [2, 10],
    },
  },
  {
    id: "CS-40",
    name: "CS-40（40〜0）",
    limits: {
      "53": [100, 100],
      "37.5": [95, 100],
      "19": [50, 80],
      "4.75": [15, 40],
      "2.36": [5, 25],
    },
  },
  {
    id: "CS-30",
    name: "CS-30（30〜0）",
    limits: {
      "37.5": [100, 100],
      "31.5": [95, 100],
      "19": [55, 85],
      "4.75": [15, 45],
      "2.36": [5, 30],
    },
  },
  {
    id: "CS-20",
    name: "CS-20（20〜0）",
    limits: {
      "26.5": [100, 100],
      "19": [95, 100],
      "13.2": [60, 90],
      "4.75": [20, 50],
      "2.36": [10, 35],
    },
  },
  {
    id: "RC-40",
    name: "RC-40（40〜0）",
    limits: {
      "53": [100, 100],
      "37.5": [95, 100],
      "19": [50, 80],
      "4.75": [15, 40],
      "2.36": [5, 25],
    },
  },
  {
    id: "RC-30",
    name: "RC-30（30〜0）",
    limits: {
      "37.5": [100, 100],
      "31.5": [95, 100],
      "19": [55, 85],
      "4.75": [15, 45],
      "2.36": [5, 30],
    },
  },
  {
    id: "RC-20",
    name: "RC-20（20〜0）",
    limits: {
      "26.5": [100, 100],
      "19": [95, 100],
      "13.2": [60, 90],
      "4.75": [20, 50],
      "2.36": [10, 35],
    },
  },
  {
    id: "RM-40",
    name: "RM-40（40〜0）",
    limits: {
      "53": [100, 100],
      "37.5": [95, 100],
      "19": [60, 90],
      "4.75": [30, 65],
      "2.36": [20, 50],
      "0.425": [10, 30],
      "0.075": [2, 10],
    },
  },
  {
    id: "RM-30",
    name: "RM-30（30〜0）",
    limits: {
      "37.5": [100, 100],
      "31.5": [95, 100],
      "19": [60, 90],
      "4.75": [30, 65],
      "2.36": [20, 50],
      "0.425": [10, 30],
      "0.075": [2, 10],
    },
  },
  {
    id: "RM-25",
    name: "RM-25（25〜0）",
    limits: {
      "31.5": [100, 100],
      "26.5": [95, 100],
      "13.2": [55, 85],
      "4.75": [30, 65],
      "2.36": [20, 50],
      "0.425": [10, 30],
      "0.075": [2, 10],
    },
  },
  {
    id: "KATAMA-SP",
    name: "カタマSP（30〜0）",
    limits: {
      "31.5": [100, 100],
      "26.5": [95, 100],
      "19": [80, 100],
      "13.2": [60, 100],
      "4.75": [35, 80],
      "2.36": [25, 60],
      "0.425": [5, 25],
      "0.075": [1, 10],
    },
  },
];

const sieveLabelMap = {};
sieves.forEach((s) => {
  sieveLabelMap[s.id] = s.label;
});

function App() {
  const [inputs, setInputs] = useState(() => {
    const init = {};
    sieves.forEach((s) => {
      init[s.id] = "";
    });
    return init;
  });

  const [results, setResults] = useState(null);

  const handleChange = (id, value) => {
    setInputs((prev) => ({ ...prev, [id]: value }));
  };

  const handleJudge = () => {
    const passed = [];
    const failed = [];

    products.forEach((product) => {
      const reasons = [];
      let ok = true;

      Object.entries(product.limits).forEach(([sieveId, range]) => {
        const min = range[0];
        const max = range[1];
        const raw = inputs[sieveId];
        const value = parseFloat(raw);

        if (raw === "" || Number.isNaN(value)) {
          ok = false;
          reasons.push(`${sieveLabelMap[sieveId]}：値が未入力です。`);
          return;
        }

        if (value < min || value > max) {
          ok = false;
          const rangeText = min === max ? `${min}` : `${min}〜${max}`;
          reasons.push(
            `${sieveLabelMap[sieveId]}：${value}（規格 ${rangeText}）`
          );
        }
      });

      if (ok) {
        passed.push(product.name);
      } else {
        failed.push({ name: product.name, reasons });
      }
    });

    setResults({ passed, failed });
  };

  const handleClear = () => {
    const init = {};
    sieves.forEach((s) => {
      init[s.id] = "";
    });
    setInputs(init);
    setResults(null);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        padding: "16px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "960px",
          margin: "0 auto",
          background: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          padding: "16px",
        }}
      >
        <h1
          style={{
            fontSize: "1.4rem",
            marginBottom: "8px",
            textAlign: "center",
          }}
        >
          路盤材 粒度試験結果 自動判定ツール
        </h1>
        <p
          style={{
            fontSize: "0.9rem",
            color: "#555",
            textAlign: "center",
            marginBottom: "16px",
          }}
        >
          JIS 粒度試験の通過質量百分率（％）を入力すると、HMS・MS・CS・RC・RM・カタマSP
          の各規格に対して合否判定します。※「規定なし」のふるいは自動でスキップします。
        </p>

        {/* 入力フォーム */}
        <div
          style={{
            overflowX: "auto",
            marginBottom: "16px",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.85rem",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    borderBottom: "1px solid #ddd",
                    padding: "4px",
                    textAlign: "left",
                    whiteSpace: "nowrap",
                  }}
                >
                  ふるい
                </th>
                <th
                  style={{
                    borderBottom: "1px solid #ddd",
                    padding: "4px",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  通過質量百分率（％）
                </th>
              </tr>
            </thead>
            <tbody>
              {sieves.map((sieve) => (
                <tr key={sieve.id}>
                  <td
                    style={{
                      borderBottom: "1px solid #eee",
                      padding: "4px",
                      whiteSpace: "nowrap",
                      fontWeight: 600,
                    }}
                  >
                    {sieve.label}
                  </td>
                  <td
                    style={{
                      borderBottom: "1px solid #eee",
                      padding: "4px",
                    }}
                  >
                    <input
                      type="number"
                      inputMode="decimal"
                      value={inputs[sieve.id]}
                      onChange={(e) =>
                        handleChange(sieve.id, e.target.value)
                      }
                      placeholder={sieve.label} // ★ここで篩サイズを表示
                      style={{
                        width: "100%",
                        maxWidth: "140px",
                        padding: "4px 6px",
                        fontSize: "0.9rem",
                        boxSizing: "border-box",
                      }}
                      min={0}
                      max={100}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ボタン */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            justifyContent: "center",
            marginBottom: "16px",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={handleJudge}
            style={{
              padding: "8px 16px",
              borderRadius: "999px",
              border: "none",
              background: "#1976d2",
              color: "#fff",
              fontSize: "0.95rem",
              cursor: "pointer",
            }}
          >
            判定する
          </button>
          <button
            onClick={handleClear}
            style={{
              padding: "8px 16px",
              borderRadius: "999px",
              border: "1px solid #ccc",
              background: "#fff",
              color: "#333",
              fontSize: "0.9rem",
              cursor: "pointer",
            }}
          >
            入力をクリア
          </button>
        </div>

        {/* 結果表示 */}
        {results && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "12px",
            }}
          >
            {/* 合格一覧 */}
            <div
              style={{
                borderRadius: "8px",
                border: "1px solid #c8e6c9",
                background: "#e8f5e9",
                padding: "8px 12px",
              }}
            >
              <h2
                style={{
                  fontSize: "1rem",
                  margin: "0 0 4px 0",
                  color: "#2e7d32",
                }}
              >
                ✅ 規格内（合格）の製品
              </h2>
              {results.passed.length === 0 ? (
                <p style={{ fontSize: "0.9rem", margin: 0 }}>
                  合格した製品はありません。
                </p>
              ) : (
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: "20px",
                    fontSize: "0.9rem",
                  }}
                >
                  {results.passed.map((name) => (
                    <li key={name}>{name}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* 不合格の詳細 */}
            <div
              style={{
                borderRadius: "8px",
                border: "1px solid #ffcdd2",
                background: "#ffebee",
                padding: "8px 12px",
              }}
            >
              <h2
                style={{
                  fontSize: "1rem",
                  margin: "0 0 4px 0",
                  color: "#c62828",
                }}
              >
                ❌ 規格外（NG）の製品とNGふるい
              </h2>
              {results.failed.length === 0 ? (
                <p style={{ fontSize: "0.9rem", margin: 0 }}>
                  規格外の製品はありません。
                </p>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    fontSize: "0.9rem",
                  }}
                >
                  {results.failed.map((item) => (
                    <div
                      key={item.name}
                      style={{
                        padding: "6px 8px",
                        borderRadius: "6px",
                        background: "#ffffff",
                        border: "1px solid #ffcdd2",
                      }}
                    >
                      <strong>{item.name}</strong>
                      <ul
                        style={{
                          margin: "4px 0 0 18px",
                          padding: 0,
                        }}
                      >
                        {item.reasons.map((r, idx) => (
                          <li key={idx}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
