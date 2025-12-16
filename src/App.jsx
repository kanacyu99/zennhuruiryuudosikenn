import React, { useMemo, useState } from "react";

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

function App() {
  const sieveLabelMap = useMemo(() => {
    const m = {};
    sieves.forEach((s) => (m[s.id] = s.label));
    return m;
  }, []);

  // 粒度試験の入力値
  const [inputs, setInputs] = useState(() => {
    const init = {};
    sieves.forEach((s) => (init[s.id] = ""));
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
          reasons.push(`${sieveLabelMap[sieveId]}：${value}（規格 ${rangeText}）`);
        }
      });

      if (ok) passed.push(product.name);
      else failed.push({ name: product.name, reasons });
    });

    setResults({ passed, failed });
  };

  const handleClear = () => {
    const init = {};
    sieves.forEach((s) => (init[s.id] = ""));
    setInputs(init);
    setResults(null);
  };

  // 規格値の文字列表示（min〜max か －）
  const formatLimit = (product, sieveId) => {
    const range = product.limits[sieveId];
    if (!range) return "－";
    const [min, max] = range;
    return min === max ? `${min}` : `${min}〜${max}`;
  };

  return (
    <>
      <style>
        {`
          /* --- 画面用（見た目） --- */
          .wrap {
            min-height: 100vh;
            background: #f5f5f5;
            padding: 16px;
            box-sizing: border-box;
          }
          .card {
            max-width: 960px;
            margin: 0 auto;
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            padding: 16px;
            box-sizing: border-box;
          }
          .muted { color: #555; }
          .no-print { }

          .section {
            margin-bottom: 16px;
            padding: 10px 12px;
            border-radius: 10px;
            background: #fafafa;
            border: 1px solid #e0e0e0;
          }
          .section-title {
            font-size: 1rem;
            margin: 0 0 10px 0;
            color: #333;
          }

          /* 試験情報：枠内に収める（はみ出し対策） */
          .form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px 12px;
          }
          .field label {
            font-size: 0.8rem;
            color: #555;
            display: block;
            margin-bottom: 4px;
          }
          .field input {
            width: 100%;
            box-sizing: border-box;
            padding: 6px 8px;
            font-size: 0.9rem;
            border: 1px solid #cfcfcf;
            border-radius: 6px;
            outline: none;
            background: #fff;
          }
          .field input:focus {
            border-color: #1976d2;
            box-shadow: 0 0 0 3px rgba(25,118,210,0.12);
          }

          /* 粒度入力：表形式を強化（前UI寄せ） */
          .table-like {
            border: 1px solid #d6d6d6;
            border-radius: 10px;
            overflow: hidden;
            background: #fff;
          }
          .table-head {
            display: grid;
            grid-template-columns: 220px 1fr;
            background: #f0f0f0;
            border-bottom: 1px solid #d6d6d6;
            font-weight: 700;
            font-size: 0.9rem;
          }
          .table-head > div {
            padding: 10px 12px;
            box-sizing: border-box;
          }
          .table-rows {
            display: flex;
            flex-direction: column;
          }
          .row {
            display: grid;
            grid-template-columns: 220px 1fr;
            border-bottom: 1px solid #ededed;
            align-items: center;
          }
          .row:nth-child(even) { background: #fbfbfb; }
          .row:last-child { border-bottom: none; }

          .cell-left {
            padding: 10px 12px;
            box-sizing: border-box;
            border-right: 1px solid #ededed;
            font-size: 0.9rem;
            color: #333;
            white-space: nowrap;
          }
          .cell-right {
            padding: 8px 12px;
            box-sizing: border-box;
            display: flex;
            gap: 10px;
            align-items: center;
          }
          .pct {
            min-width: 42px;
            text-align: right;
            color: #666;
            font-size: 0.85rem;
          }
          .sieve-input {
            width: 100%;
            max-width: 520px;
            box-sizing: border-box;
            padding: 8px 10px;
            font-size: 0.95rem;
            border: 1px solid #bdbdbd;
            border-radius: 8px;
            outline: none;
            background: #fff;
          }
          .sieve-input:focus {
            border-color: #1976d2;
            box-shadow: 0 0 0 3px rgba(25,118,210,0.12);
          }

          /* ボタン */
          .btns {
            display: flex;
            gap: 8px;
            justify-content: center;
            margin: 12px 0 16px 0;
            flex-wrap: wrap;
          }
          .btn-primary {
            padding: 9px 16px;
            border-radius: 999px;
            border: none;
            background: #1976d2;
            color: #fff;
            font-size: 0.95rem;
            cursor: pointer;
          }
          .btn-ghost {
            padding: 9px 16px;
            border-radius: 999px;
            border: 1px solid #ccc;
            background: #fff;
            color: #333;
            font-size: 0.9rem;
            cursor: pointer;
          }

          /* 結果表示 */
          .result-ok {
            border-radius: 10px;
            border: 1px solid #c8e6c9;
            background: #e8f5e9;
            padding: 10px 12px;
          }
          .result-ng {
            border-radius: 10px;
            border: 1px solid #ffcdd2;
            background: #ffebee;
            padding: 10px 12px;
          }
          .result-title-ok { color: #2e7d32; margin: 0 0 6px 0; font-size: 1rem; }
          .result-title-ng { color: #c62828; margin: 0 0 6px 0; font-size: 1rem; }

          /* 規格表 */
          .spec-area {
            margin-top: 8px;
            padding-top: 8px;
            border-top: 1px dashed #ccc;
          }
          .spec-table-wrap { overflow-x: auto; }
          .spec-table {
            border-collapse: collapse;
            min-width: 720px;
            font-size: 0.78rem;
          }
          .spec-table th, .spec-table td {
            border: 1px solid #ddd;
            padding: 4px;
            text-align: center;
            white-space: nowrap;
          }
          .spec-table th {
            background: #f0f0f0;
          }
          .spec-table td:first-child {
            text-align: left;
            font-weight: 700;
            background: #fafafa;
          }

          /* --- モバイル最適化 --- */
          @media (max-width: 720px) {
            .form-grid { grid-template-columns: 1fr; }
            .table-head, .row { grid-template-columns: 150px 1fr; }
            .cell-left { font-size: 0.85rem; }
            .sieve-input { max-width: 100%; }
          }

          /* --- 印刷（※とりあえず現状維持。ページ区切りだけ残す） --- */
          @media print {
            html, body { margin: 0; padding: 0; }
            #root { max-width: none !important; margin: 0 !important; padding: 0 !important; }
            .wrap { background: #fff !important; padding: 0 !important; }
            .card { box-shadow: none !important; border-radius: 0 !important; max-width: 100% !important; width: 100% !important; }
            .no-print { display: none !important; }

            /* 規格内/規格外を2ページ目、規格表を3ページ目…にしたい場合は
               ここを使って強制改ページできます（今は spec のみ残してます） */
            .page-break { page-break-before: always; }
            .spec-break { page-break-before: always; }
          }
        `}
      </style>

      <div className="wrap">
        <div className="card">
          {/* ヘッダー＋印刷ボタン */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "8px",
              marginBottom: "10px",
            }}
          >
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: "1.4rem", margin: "0 0 4px 0", textAlign: "center" }}>
                路盤材 粒度試験結果 自動判定ツール
              </h1>
              <p className="muted" style={{ fontSize: "0.9rem", textAlign: "center", margin: 0 }}>
                JIS 粒度試験の通過質量百分率（％）を入力すると、HMS・MS・CS・RC・RM・カタマSP の各規格に対して合否判定します。
                ※「規定なし」のふるいは自動でスキップします。
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
          <div className="section">
            <h2 className="section-title">試験情報</h2>
            <div className="form-grid">
              <div className="field">
                <label>試験名</label>
                <input
                  type="text"
                  value={sampleInfo.testName}
                  onChange={(e) => handleSampleInfoChange("testName", e.target.value)}
                  placeholder="例：路盤材 粒度試験"
                />
              </div>
              <div className="field">
                <label>試料名</label>
                <input
                  type="text"
                  value={sampleInfo.sampleName}
                  onChange={(e) => handleSampleInfoChange("sampleName", e.target.value)}
                  placeholder="例：CS-40 八幡 ○○ロット"
                />
              </div>
              <div className="field">
                <label>試料採取日</label>
                <input
                  type="date"
                  value={sampleInfo.collectedDate}
                  onChange={(e) => handleSampleInfoChange("collectedDate", e.target.value)}
                />
              </div>
              <div className="field">
                <label>試験年月日</label>
                <input
                  type="date"
                  value={sampleInfo.testDate}
                  onChange={(e) => handleSampleInfoChange("testDate", e.target.value)}
                />
              </div>
              <div className="field">
                <label>試験者</label>
                <input
                  type="text"
                  value={sampleInfo.tester}
                  onChange={(e) => handleSampleInfoChange("tester", e.target.value)}
                  placeholder="例：入江"
                />
              </div>
              <div className="field">
                <label>備考</label>
                <input
                  type="text"
                  value={sampleInfo.note}
                  onChange={(e) => handleSampleInfoChange("note", e.target.value)}
                  placeholder="例：備考や注意点など"
                />
              </div>
            </div>
          </div>

          {/* 粒度入力（縦レイアウト×表っぽく） */}
          <div className="section">
            <h2 className="section-title">粒度試験結果入力（通過質量百分率%）</h2>

            <div className="table-like">
              <div className="table-head">
                <div>ふるい</div>
                <div>通過質量百分率（%）</div>
              </div>

              <div className="table-rows">
                {sieves.map((s) => (
                  <div className="row" key={s.id}>
                    <div className="cell-left">{s.label}</div>
                    <div className="cell-right">
                      <span className="pct">%</span>
                      <input
                        className="sieve-input"
                        type="number"
                        inputMode="decimal"
                        min={0}
                        max={100}
                        value={inputs[s.id]}
                        onChange={(e) => handleChange(s.id, e.target.value)}
                        placeholder="例：100"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="btns no-print">
              <button className="btn-primary" onClick={handleJudge}>判定する</button>
              <button className="btn-ghost" onClick={handleClear}>入力をクリア（粒度のみ）</button>
            </div>
          </div>

          {/* 結果表示 */}
          {results && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px", marginBottom: "16px" }}>
              <div className="result-ok">
                <h2 className="result-title-ok">✅ 規格内（合格）の製品</h2>
                {results.passed.length === 0 ? (
                  <p style={{ fontSize: "0.9rem", margin: 0 }}>合格した製品はありません。</p>
                ) : (
                  <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "0.9rem" }}>
                    {results.passed.map((name) => (
                      <li key={name}>{name}</li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="result-ng">
                <h2 className="result-title-ng">❌ 規格外（NG）の製品とNGふるい</h2>
                {results.failed.length === 0 ? (
                  <p style={{ fontSize: "0.9rem", margin: 0 }}>規格外の製品はありません。</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.9rem" }}>
                    {results.failed.map((item) => (
                      <div
                        key={item.name}
                        style={{
                          padding: "8px 10px",
                          borderRadius: "8px",
                          background: "#fff",
                          border: "1px solid #ffcdd2",
                        }}
                      >
                        <strong>{item.name}</strong>
                        <ul style={{ margin: "6px 0 0 18px", padding: 0 }}>
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

          {/* 規格表 */}
          <div className="spec-area spec-break">
            <h2 className="section-title" style={{ marginBottom: "6px" }}>
              📘 規格表（各製品の通過質量百分率・参考）
            </h2>
            <p style={{ fontSize: "0.8rem", color: "#666", margin: "0 0 8px 0" }}>
              単位：％　／　「－」はそのふるいに規定がないことを表します。
            </p>

            <div className="spec-table-wrap">
              <table className="spec-table">
                <thead>
                  <tr>
                    <th>製品名</th>
                    {sieves.map((s) => (
                      <th key={s.id}>{s.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      {sieves.map((s) => (
                        <td key={s.id}>{formatLimit(p, s.id)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default App;
