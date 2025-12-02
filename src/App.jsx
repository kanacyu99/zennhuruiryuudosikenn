import React, { useState } from "react";

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
  // 粒度試験の入力値
  const [inputs, setInputs] = useState(() => {
    const init = {};
    sieves.forEach((s) => {
      init[s.id] = "";
    });
    return init;
  });

  // 試料情報
  const [sampleInfo, setSampleInfo] = useState({
    testName: "",
    sampleName: "",
    collectedDate: "",
    testDate: "",
    tester: "",
    note: "",
  });

  const [results, setResults] = useState(null);

  const handleChange = (id, value) => {
    setInputs((prev) => ({ ...prev, [id]: value }));
  };

  const handleSampleInfoChange = (field, value) => {
    setSampleInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleJudge = () => {
    const passed = [];
    const failed = [];

    products.forEach((product) => {
      const reasons = [];
      let ok = true;

      Object.entries(product.limits).forEach(([sieveId, range]) => {
        const [min, max] = range;
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

  // 規格値の文字列表示（min〜max か －）
  const formatLimit = (product, sieveId) => {
    const range = product.limits[sieveId];
    if (!range) return "－";
    const [min, max] = range;
    if (min === max) return `${min}`;
    return `${min}〜${max}`;
  };

  return (
    <>
      {/* 印刷＆共通レイアウト調整 */}
      <style>
        {`
          /* 画面表示時の共通スタイル */
          .text-input,
          .sieve-input,
          .note-input {
            width: 100%;
            max-width: 100%;
            box-sizing: border-box;
          }

          .sieve-grid {
            display: grid;
            grid-template-columns: 1.2fr 1fr;
            gap: 6px 12px;
          }

          .sieve-label-cell {
            text-align: right;
            font-size: 0.85rem;
            color: #555;
          }

          .sieve-input-cell {
            text-align: left;
          }

          @media print {
            html, body {
              margin: 0;
              padding: 0;
            }

            #root {
              max-width: none !important;
              margin: 0 !important;
              padding: 0 !important;
            }

            .page-root {
              background: #ffffff !important;
              padding: 0 !important;
            }

            /* A4 より少し小さい幅にして右端が切れないようにする */
            .page-card {
              box-shadow: none !important;
              border-radius: 0 !important;
              margin: 0 auto !important;
              width: 190mm !important;
              max-width: 190mm !important;
            }

            .no-print {
              display: none !important;
            }

            /* 入力欄を少し細く＆小さくして紙面に収めやすくする */
            .text-input,
            .note-input {
              font-size: 0.8rem !important;
              padding: 3px 4px !important;
            }

            .sieve-input {
              font-size: 0.8rem !important;
              padding: 2px 3px !important;
            }

            /* ページ分割：1ページ目 → 入力、2ページ目 → 判定結果、3ページ目 → 規格表 */
            .page-block {
              page-break-after: always;
            }
            .page-block:last-of-type {
              page-break-after: auto;
            }

            .results-block {
              page-break-before: always;
            }

            .spec-block {
              page-break-before: always;
            }
          }
        `}
      </style>

      <div className="print-container">
        <div
          className="page-root"
          style={{
            minHeight: "100vh",
            background: "#f5f5f5",
            padding: "16px",
          }}
        >
          <div
            className="page-card"
            style={{
              maxWidth: "960px",
              margin: "0 auto",
              background: "#ffffff",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              padding: "16px",
            }}
          >
            {/* ===== 1ページ目：ヘッダー ＋ 試験情報 ＋ 粒度入力 ===== */}
            <div className="page-block">
              {/* ヘッダー＋印刷ボタン */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "8px",
                  marginBottom: "8px",
                }}
              >
                <div style={{ flex: 1 }}>
                  <h1
                    style={{
                      fontSize: "1.4rem",
                      margin: "0 0 4px 0",
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
                      margin: 0,
                    }}
                  >
                    JIS 粒度試験の通過質量百分率（％）を入力すると、HMS・MS・CS・RC・RM・カタマSP
                    の各規格に対して合否判定します。※「規定なし」のふるいは自動でスキップします。
                  </p>
                </div>

                <div className="no-print" style={{ textAlign: "right" }}>
                  <button
                    onClick={() => window.print()}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "999px",
                      border: "1px solid #1976d2",
                      background: "#fff",
                      color: "#1976d2",
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    🖨 印刷 / PDF
                  </button>
                </div>
              </div>

              {/* 試験情報 */}
              <div
                style={{
                  marginBottom: "16px",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  background: "#fafafa",
                  border: "1px solid #e0e0e0",
                }}
              >
                <h2
                  style={{
                    fontSize: "1rem",
                    margin: "0 0 8px 0",
                    color: "#333",
                  }}
                >
                  試験情報
                </h2>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "8px 12px",
                  }}
                >
                  <div>
                    <label
                      style={{
                        fontSize: "0.8rem",
                        color: "#555",
                        display: "block",
                        marginBottom: "2px",
                      }}
                    >
                      試験名
                    </label>
                    <input
                      type="text"
                      className="text-input"
                      value={sampleInfo.testName}
                      onChange={(e) =>
                        handleSampleInfoChange("testName", e.target.value)
                      }
                      style={{
                        padding: "4px 6px",
                        fontSize: "0.9rem",
                      }}
                      placeholder="例：路盤材 粒度試験"
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        fontSize: "0.8rem",
                        color: "#555",
                        display: "block",
                        marginBottom: "2px",
                      }}
                    >
                      試料名
                    </label>
                    <input
                      type="text"
                      className="text-input"
                      value={sampleInfo.sampleName}
                      onChange={(e) =>
                        handleSampleInfoChange("sampleName", e.target.value)
                      }
                      style={{
                        padding: "4px 6px",
                        fontSize: "0.9rem",
                      }}
                      placeholder="例：CS-40 八幡 ○○ロット"
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        fontSize: "0.8rem",
                        color: "#555",
                        display: "block",
                        marginBottom: "2px",
                      }}
                    >
                      試料採取日
                    </label>
                    <input
                      type="date"
                      className="text-input"
                      value={sampleInfo.collectedDate}
                      onChange={(e) =>
                        handleSampleInfoChange("collectedDate", e.target.value)
                      }
                      style={{
                        padding: "4px 6px",
                        fontSize: "0.9rem",
                      }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        fontSize: "0.8rem",
                        color: "#555",
                        display: "block",
                        marginBottom: "2px",
                      }}
                    >
                      試験年月日
                    </label>
                    <input
                      type="date"
                      className="text-input"
                      value={sampleInfo.testDate}
                      onChange={(e) =>
                        handleSampleInfoChange("testDate", e.target.value)
                      }
                      style={{
                        padding: "4px 6px",
                        fontSize: "0.9rem",
                      }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        fontSize: "0.8rem",
                        color: "#555",
                        display: "block",
                        marginBottom: "2px",
                      }}
                    >
                      試験者
                    </label>
                    <input
                      type="text"
                      className="text-input"
                      value={sampleInfo.tester}
                      onChange={(e) =>
                        handleSampleInfoChange("tester", e.target.value)
                      }
                      style={{
                        padding: "4px 6px",
                        fontSize: "0.9rem",
                      }}
                      placeholder="例：入江"
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        fontSize: "0.8rem",
                        color: "#555",
                        display: "block",
                        marginBottom: "2px",
                      }}
                    >
                      備考
                    </label>
                    <input
                      type="text"
                      className="note-input"
                      value={sampleInfo.note}
                      onChange={(e) =>
                        handleSampleInfoChange("note", e.target.value)
                      }
                      style={{
                        padding: "4px 6px",
                        fontSize: "0.9rem",
                      }}
                      placeholder="例：備考や注意点など"
                    />
                  </div>
                </div>
              </div>

              {/* 粒度入力：縦レイアウト */}
              <div
                style={{
                  marginBottom: "16px",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  background: "#fafafa",
                  border: "1px solid #e0e0e0",
                }}
              >
                <h2
                  style={{
                    fontSize: "1rem",
                    margin: "0 0 8px 0",
                    color: "#333",
                  }}
                >
                  粒度試験結果入力（通過質量百分率％）
                </h2>

                <div className="sieve-grid">
                  {sieves.map((sieve) => (
                    <React.Fragment key={sieve.id}>
                      <div className="sieve-label-cell">
                        {sieve.label}
                      </div>
                      <div className="sieve-input-cell">
                        <input
                          type="number"
                          className="sieve-input"
                          inputMode="decimal"
                          value={inputs[sieve.id]}
                          onChange={(e) =>
                            handleChange(sieve.id, e.target.value)
                          }
                          style={{
                            padding: "4px 6px",
                            fontSize: "0.9rem",
                          }}
                          min={0}
                          max={100}
                        />
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* ボタン（画面のみ） */}
              <div
                className="no-print"
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
                  入力をクリア（粒度のみ）
                </button>
              </div>
            </div>
            {/* ===== 1ページ目ここまで ===== */}

            {/* ===== 2ページ目：判定結果 ===== */}
            <div className="page-block results-block">
              {results && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gap: "12px",
                    marginBottom: "16px",
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
            {/* ===== 2ページ目ここまで ===== */}

            {/* ===== 3ページ目：規格表 ===== */}
            <div className="page-block spec-block">
              <div
                style={{
                  marginTop: "8px",
                  paddingTop: "8px",
                  borderTop: "1px dashed #ccc",
                }}
              >
                <h2
                  style={{
                    fontSize: "1rem",
                    margin: "4px 0 4px 0",
                    color: "#333",
                  }}
                >
                  📘 規格表（各製品の通過質量百分率・参考）
                </h2>
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "#666",
                    marginBottom: "6px",
                  }}
                >
                  単位：％　／　「－」はそのふるいに規定がないことを表します。
                </p>
                <div
                  style={{
                    overflowX: "auto",
                  }}
                >
                  <table
                    style={{
                      borderCollapse: "collapse",
                      minWidth: "700px",
                      fontSize: "0.78rem",
                    }}
                  >
                    <thead>
                      <tr>
                        <th
                          style={{
                            border: "1px solid #ccc",
                            padding: "4px",
                            whiteSpace: "nowrap",
                            background: "#f0f0f0",
                          }}
                        >
                          製品名
                        </th>
                        {sieves.map((sieve) => (
                          <th
                            key={sieve.id}
                            style={{
                              border: "1px solid #ccc",
                              padding: "4px",
                              whiteSpace: "nowrap",
                              background: "#f0f0f0",
                            }}
                          >
                            {sieve.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td
                            style={{
                              border: "1px solid #ddd",
                              padding: "4px",
                              whiteSpace: "nowrap",
                              fontWeight: 600,
                              background: "#fafafa",
                            }}
                          >
                            {product.name}
                          </td>
                          {sieves.map((sieve) => (
                            <td
                              key={sieve.id}
                              style={{
                                border: "1px solid #ddd",
                                padding: "4px",
                                textAlign: "center",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {formatLimit(product, sieve.id)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {/* ===== 3ページ目ここまで ===== */}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
