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
   ready to be printed to PDF. */
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
    width:148mm;
    min-height:210mm;
    margin:0 auto;
    background:var(--soft-white);
    padding:10mm;
    position:relative;
    display:flex;
    flex-direction:column;
  }
  .header-logo{display:flex;justify-content:center;}
  .logo{width:56px;height:56px;}
  .rule{border:0;border-top:1px solid var(--line);margin:8px 0 12px;}
  .title-block{text-align:center;}
  .report-title{
    font-family:"Playfair Display",serif;font-weight:600;font-size:17px;
    letter-spacing:.10em;text-transform:uppercase;margin:0;color:var(--ink);
  }
  .report-sub{
    font-family:"Jost",sans-serif;letter-spacing:.3em;text-transform:uppercase;
    font-size:9px;color:var(--gold);margin:6px 0 0;
  }
  .meta-line{display:flex;justify-content:center;align-items:center;gap:14px;margin:10px 0 0;flex-wrap:wrap;}
  .meta-item{display:flex;flex-direction:column;align-items:center;gap:3px;}
  .meta-label{
    font-family:"Jost",sans-serif;text-transform:uppercase;letter-spacing:.15em;
    font-size:8px;font-weight:500;color:var(--ink-soft);
  }
  .meta-value{font-family:"Cormorant Garamond",serif;font-style:italic;font-size:11.5px;color:var(--ink);}
  .meta-divider{width:1px;height:18px;background:var(--line);}
  .disclaimer{
    font-family:"Cormorant Garamond",serif;font-style:italic;font-size:10.5px;
    line-height:1.35;color:var(--muted);text-align:center;max-width:128mm;margin:10px auto 0;
  }
  .notes{
    background:var(--lavender);border:1px solid var(--lavender-border);
    border-radius:4px;padding:9px 12px;margin:10px 0 6px;
  }
  .notes-head{
    font-family:"Jost",sans-serif;text-transform:uppercase;letter-spacing:.18em;
    font-size:9px;font-weight:500;color:var(--lavender-ink);margin:0 0 6px;
    display:flex;align-items:center;gap:8px;
  }
  .notes ul{margin:0;padding:0;list-style:none;}
  .notes li{
    font-family:"Cormorant Garamond",serif;font-size:10.5px;line-height:1.3;
    color:var(--ink-soft);padding-left:14px;position:relative;margin-bottom:4px;
  }
  .notes li:last-child{margin-bottom:0;}
  .notes li::before{content:"•";position:absolute;left:2px;color:var(--lavender-ink);}
  .columns{display:flex;gap:0;margin-top:10px;}
  .col{flex:1;min-width:0;}
  .col-left{padding-right:12px;}
  .col-right{padding-left:12px;border-left:1px solid var(--line);}
  .section-head{
    font-family:"Jost",sans-serif;text-transform:uppercase;letter-spacing:.16em;
    font-size:9.5px;font-weight:500;color:var(--ink-soft);margin:0 0 4px;
  }
  .section-rule{border:0;border-top:1px solid var(--line);margin:0 0 8px;}
  .info-row{
    display:flex;flex-direction:column;gap:1px;padding:5px 0;
    border-bottom:1px dotted var(--line);
  }
  .info-label{
    font-family:"Jost",sans-serif;text-transform:uppercase;letter-spacing:.1em;
    font-size:8.5px;font-weight:500;color:var(--ink);line-height:1.3;
  }
  .info-value{font-family:"Cormorant Garamond",serif;font-style:italic;font-size:11px;color:var(--muted);}
  .option{display:flex;gap:8px;margin-bottom:10px;}
  .checkbox{
    width:13px;height:13px;flex-shrink:0;margin-top:2px;border:1.4px solid var(--ink-soft);
    border-radius:2px;display:flex;align-items:center;justify-content:center;
    font-size:10px;line-height:1;color:var(--gold);
  }
  .checkbox.checked::after{content:"\\2665";}
  .option-title{font-family:"Playfair Display",serif;font-weight:600;font-size:11px;letter-spacing:.01em;color:var(--ink);margin:0 0 3px;}
  .option-desc{font-family:"Cormorant Garamond",serif;font-size:9.5px;line-height:1.3;color:var(--ink-soft);margin:0;}
  .footer{margin-top:auto;padding-top:8px;border-top:1px solid var(--line);display:flex;flex-direction:column;align-items:center;gap:6px;text-align:center;}
  .footer-thanks{font-family:"Cormorant Garamond",serif;font-style:italic;font-size:10.5px;color:var(--muted);}
  .footer-contact{font-family:"Jost",sans-serif;font-size:9px;color:var(--ink-soft);display:flex;align-items:center;gap:6px;flex-wrap:wrap;justify-content:center;}
  .footer-contact svg{width:14px;height:14px;color:var(--gold);}
  .footer-contact .sep{color:var(--line);margin:0 4px;}
</style>
</head>
<body>
  <div class="page">
    <div class="header-logo">
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
    </div>

    <hr class="rule" />

    <div class="title-block">
      <h2 class="report-title">Authentication Assessment Report</h2>
      <p class="report-sub">Independent Expert Opinion</p>
      <div class="meta-line">
        <span class="meta-item">
          <span class="meta-label">Reference Number</span>
          <span class="meta-value">${esc(data.referenceNumber) || "—"}</span>
        </span>
        <span class="meta-divider"></span>
        <span class="meta-item">
          <span class="meta-label">Date of Assessment</span>
          <span class="meta-value">${esc(data.dateOfAssessment) || "—"}</span>
        </span>
      </div>
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
        <div class="info-row"><span class="info-label">Brand Submitted</span><span class="info-value">${esc(data.brand) || "—"}</span></div>
        <div class="info-row"><span class="info-label">Item Type</span><span class="info-value">${esc(data.itemType) || "—"}</span></div>
        <div class="info-row"><span class="info-label">Collection</span><span class="info-value">${esc(data.collection) || "—"}</span></div>
        <div class="info-row"><span class="info-label">Material</span><span class="info-value">${esc(data.material) || "—"}</span></div>
        <div class="info-row"><span class="info-label">Serial / Marking</span><span class="info-value">${esc(data.serial) || "—"}</span></div>
        <div class="info-row"><span class="info-label">Additional Details</span><span class="info-value">${esc(data.additionalDetails) || "—"}</span></div>
      </div>

      <div class="col col-right">
        <h3 class="section-head">Assessment Result</h3>
        <hr class="section-rule" />
        ${option(data.result, "verified")}
        ${option(data.result, "unable")}
        ${option(data.result, "more_info")}
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
