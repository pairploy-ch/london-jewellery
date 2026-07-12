import type { ReportData } from "./supabase/config";

/* Escapes user-entered text before it is dropped into the report HTML.
   Newlines become <br/> so multi-line notes render as separate lines. */
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br/>");
}

const RESULT_COPY: Record<
  ReportData["result"],
  { title: string; desc: string }
> = {
  verified: {
    title: "Verified",
    desc: "Based on the images provided, the design, markings, and characteristics conform to the established standards of the brand.",
  },
  unable: {
    title: "Unable to Verify",
    desc: "Based on the images provided, there is insufficient visual evidence to definitively confirm the authenticity of this item.",
  },
  more_info: {
    title: "Further Information Required",
    desc: "The assessment cannot be completed because the submitted photographs are blurry, unclear, or taken from inadequate angles. Additional high-resolution images or supporting documentation (e.g., certificates, receipts) are required for a conclusive review.",
  },
};

function checkbox(result: ReportData["result"], key: ReportData["result"]) {
  return `<span class="checkbox${result === key ? " checked" : ""}"></span>`;
}

function option(result: ReportData["result"], key: ReportData["result"]) {
  const copy = RESULT_COPY[key];
  return `
    <div class="option">
      ${checkbox(result, key)}
      <div>
        <p class="option-title">${copy.title}</p>
        <p class="option-desc">${copy.desc}</p>
      </div>
    </div>`;
}

/* Renders the Authentication Assessment Report as a standalone HTML document,
   ready to be printed to PDF. Layout/design mirrors report-template.html. */
export function buildReportHtml(data: ReportData): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Authentication Assessment Report — London Jewellery Consult</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Playfair+Display:wght@500;600;700&family=Jost:wght@300;400;500&display=swap" rel="stylesheet" />
<style>
  :root{
    --ink:#1a1510;
    --ink-soft:#3a3128;
    --muted:#8a7f70;
    --gold:#a4854f;
    --line:#e2dccf;
    --line-soft:#ece7dc;
    --soft-white:#fcfbf8;
    --lavender:#efedf5;
    --lavender-border:#dcd8ea;
    --lavender-ink:#4a4566;
  }
  *{box-sizing:border-box;}
  html,body{margin:0;padding:0;}
  body{
    background:#fff;
    font-family:"Jost",ui-sans-serif,system-ui,sans-serif;
    color:var(--ink);
    -webkit-font-smoothing:antialiased;
  }
  .page{
    width:210mm;
    min-height:297mm;
    margin:0 auto;
    background:var(--soft-white);
    padding:18mm 16mm 14mm;
    position:relative;
    display:flex;
    flex-direction:column;
  }
  .header{display:flex;justify-content:space-between;align-items:flex-start;gap:24px;}
  .brand-lockup{display:flex;align-items:center;gap:16px;}
  .logo{width:62px;height:62px;flex-shrink:0;}
  .brand-name{
    font-family:"Playfair Display",serif;font-weight:600;font-size:30px;
    line-height:1.04;letter-spacing:.01em;text-transform:uppercase;color:var(--ink);margin:0;
  }
  .meta{text-align:left;min-width:230px;}
  .meta .label{
    font-family:"Jost",sans-serif;text-transform:uppercase;letter-spacing:.22em;
    font-size:10px;font-weight:500;color:var(--ink-soft);
  }
  .meta .fill{
    font-family:"Cormorant Garamond",serif;font-style:italic;font-size:14px;
    color:var(--ink);border-bottom:1px solid var(--muted);
    height:22px;margin:6px 0 14px;padding-top:2px;
  }
  .meta .fill:last-child{margin-bottom:0;}
  .rule{border:0;border-top:1px solid var(--line);margin:18px 0 24px;}
  .title-block{text-align:center;}
  .report-title{
    font-family:"Playfair Display",serif;font-weight:600;font-size:25px;
    letter-spacing:.20em;text-transform:uppercase;margin:0;color:var(--ink);
  }
  .report-sub{
    font-family:"Jost",sans-serif;letter-spacing:.34em;text-transform:uppercase;
    font-size:11px;color:var(--gold);margin:8px 0 0;
  }
  .disclaimer{
    font-family:"Cormorant Garamond",serif;font-style:italic;font-size:14.5px;
    line-height:1.5;color:var(--muted);text-align:center;max-width:150mm;margin:18px auto 0;
  }
  .notes{
    background:var(--lavender);border:1px solid var(--lavender-border);
    border-radius:4px;padding:16px 22px;margin:24px 0 6px;
  }
  .notes-head{
    font-family:"Jost",sans-serif;text-transform:uppercase;letter-spacing:.2em;
    font-size:11px;font-weight:500;color:var(--lavender-ink);margin:0 0 10px;
    display:flex;align-items:center;gap:8px;
  }
  .notes ul{margin:0;padding:0;list-style:none;}
  .notes li{
    font-family:"Cormorant Garamond",serif;font-size:14px;line-height:1.5;
    color:var(--ink-soft);padding-left:16px;position:relative;margin-bottom:7px;
  }
  .notes li:last-child{margin-bottom:0;}
  .notes li::before{content:"•";position:absolute;left:2px;color:var(--lavender-ink);}
  .columns{display:flex;gap:0;margin-top:26px;flex:1;}
  .col{flex:1;}
  .col-left{padding-right:28px;}
  .col-right{padding-left:28px;border-left:1px solid var(--line);}
  .section-head{
    font-family:"Jost",sans-serif;text-transform:uppercase;letter-spacing:.22em;
    font-size:12px;font-weight:500;color:var(--ink-soft);margin:0 0 4px;
  }
  .section-rule{border:0;border-top:1px solid var(--line);margin:0 0 18px;}
  .info-row{
    display:flex;align-items:baseline;gap:14px;padding:11px 0;
    border-bottom:1px dotted var(--line);
  }
  .info-label{
    font-family:"Jost",sans-serif;text-transform:uppercase;letter-spacing:.12em;
    font-size:11px;font-weight:500;color:var(--ink);width:96px;flex-shrink:0;line-height:1.35;
  }
  .info-value{font-family:"Cormorant Garamond",serif;font-style:italic;font-size:14.5px;color:var(--muted);}
  .option{display:flex;gap:12px;margin-bottom:18px;}
  .checkbox{
    width:16px;height:16px;flex-shrink:0;margin-top:2px;border:1.4px solid var(--ink-soft);
    border-radius:2px;display:flex;align-items:center;justify-content:center;
    font-size:12px;line-height:1;color:var(--gold);
  }
  .checkbox.checked::after{content:"\\2665";}
  .option-title{font-family:"Playfair Display",serif;font-weight:600;font-size:14px;letter-spacing:.02em;color:var(--ink);margin:0 0 4px;}
  .option-desc{font-family:"Cormorant Garamond",serif;font-size:13.5px;line-height:1.45;color:var(--ink-soft);margin:0;}
  .observations{margin-top:30px;}
  .obs-box{border:1px solid var(--line);border-radius:4px;min-height:120px;padding:16px 18px;margin-top:14px;}
  .obs-text{font-family:"Cormorant Garamond",serif;font-size:14px;color:var(--ink-soft);margin:0;line-height:1.5;}
  .obs-placeholder{font-family:"Cormorant Garamond",serif;font-style:italic;font-size:14px;color:var(--muted);margin:0;line-height:1.5;}
  .footer{margin-top:34px;padding-top:16px;border-top:1px solid var(--line);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;}
  .footer-thanks{font-family:"Cormorant Garamond",serif;font-style:italic;font-size:13.5px;color:var(--muted);}
  .footer-contact{font-family:"Jost",sans-serif;font-size:12px;color:var(--ink-soft);display:flex;align-items:center;gap:8px;}
  .footer-contact svg{width:14px;height:14px;color:var(--gold);}
  .footer-contact .sep{color:var(--line);margin:0 4px;}
</style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="brand-lockup">
        <svg class="logo" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="London Jewellery Consult logo">
          <g stroke="#a4854f" stroke-width="1.6" stroke-linecap="round" fill="none">
            <path d="M60 14 C72 22 82 34 86 50"/>
            <path d="M66 21 q9 -4 14 1 q-7 4 -14 -1Z" fill="#a4854f" stroke="none"/>
            <path d="M73 30 q9 -4 14 1 q-7 4 -14 -1Z" fill="#a4854f" stroke="none"/>
            <path d="M79 40 q9 -3 13 2 q-7 3 -13 -2Z" fill="#a4854f" stroke="none"/>
          </g>
          <text x="60" y="88" text-anchor="middle" font-family="'Playfair Display', serif" font-weight="600" font-size="52" letter-spacing="1" fill="#1a1510">LJC</text>
          <path d="M30 98 H90" stroke="#a4854f" stroke-width="1.2" stroke-linecap="round"/>
        </svg>
        <h1 class="brand-name">London<br/>Jewellery<br/>Consult</h1>
      </div>
      <div class="meta">
        <div class="label">Reference Number:</div>
        <div class="fill">${esc(data.referenceNumber)}</div>
        <div class="label">Date of Assessment:</div>
        <div class="fill">${esc(data.dateOfAssessment)}</div>
      </div>
    </div>

    <hr class="rule" />

    <div class="title-block">
      <h2 class="report-title">Authentication Assessment Report</h2>
      <p class="report-sub">Independent Expert Opinion</p>
      <p class="disclaimer">&ldquo;This report reflects the opinion of London Jewellery Consult based strictly on the digital images and information provided by the client. It does not constitute an official certificate of authenticity, a structural guarantee, or a formal financial appraisal. All conclusions are based solely on the visual materials submitted.&rdquo;</p>
    </div>

    <div class="notes">
      <p class="notes-head">⚠ Important Notes</p>
      <ul>
        <li>This assessment is based solely on the digital images and information provided by the client.</li>
        <li>London Jewellery Consult does not examine the item in person unless a physical consultation is separately arranged.</li>
        <li>This report is for informational purposes only; London Jewellery Consult accepts no liability for any financial decisions, transactions, losses, or third-party claims made based upon this document.</li>
      </ul>
    </div>

    <div class="columns">
      <div class="col col-left">
        <h3 class="section-head">Item Information</h3>
        <hr class="section-rule" />
        <div class="info-row"><span class="info-label">Brand<br/>Submitted</span><span class="info-value">${esc(data.brand) || "—"}</span></div>
        <div class="info-row"><span class="info-label">Item Type</span><span class="info-value">${esc(data.itemType) || "—"}</span></div>
        <div class="info-row"><span class="info-label">Collection</span><span class="info-value">${esc(data.collection) || "—"}</span></div>
        <div class="info-row"><span class="info-label">Material</span><span class="info-value">${esc(data.material) || "—"}</span></div>
        <div class="info-row"><span class="info-label">Serial /<br/>Marking</span><span class="info-value">${esc(data.serial) || "—"}</span></div>
        <div class="info-row"><span class="info-label">Additional<br/>Details</span><span class="info-value">${esc(data.additionalDetails) || "—"}</span></div>
      </div>

      <div class="col col-right">
        <h3 class="section-head">Assessment Result</h3>
        <hr class="section-rule" />
        ${option(data.result, "verified")}
        ${option(data.result, "unable")}
        ${option(data.result, "more_info")}
      </div>
    </div>

    <div class="observations">
      <h3 class="section-head">Expert Observations &amp; Notes</h3>
      <hr class="section-rule" />
      <div class="obs-box">
        ${
          data.notes.trim()
            ? `<p class="obs-text">${esc(data.notes)}</p>`
            : `<p class="obs-placeholder">No additional observations recorded.</p>`
        }
      </div>
    </div>

    <div class="footer">
      <span class="footer-thanks">Thank you for trusting London Jewellery Consult.</span>
      <span class="footer-contact">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="4.5" width="19" height="15" rx="2"/><path d="m3 6 9 6 9-6"/></svg>
        contact@londonjewelleryconsult.com
        <span class="sep">|</span>
        www.londonjewelleryconsult.com
      </span>
    </div>
  </div>
</body>
</html>`;
}
