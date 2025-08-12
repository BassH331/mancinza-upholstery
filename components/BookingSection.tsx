// BookingEstimator.tsx
// -------------------------------------------------------------
// Minimal: Catalog → Estimate → Invoice Preview → Print/PDF + WhatsApp message
// Now with strong input validation & newbie guidance
// No backend. Tailwind assumed.
// -------------------------------------------------------------

import React, { useMemo, useState, useEffect } from "react";
import { Calendar, AlertTriangle, CheckCircle2 } from "lucide-react";

type Category = "furniture" | "decor";

type CatalogItem = {
  id: string;
  name: string;
  category: Category;
  price?: number;
  priceMin?: number;
  priceMax?: number;
  image?: string;
  subtitle?: string;
};

type BasketItem = { id: string; qty: number };

const CATALOG: CatalogItem[] = [
  // Furniture
  { id: "queen-hb-ped", name: "Queen Headboard + Pedestals", category: "furniture", price: 3200, subtitle: "Headboard & pedestals", image: "https://i.postimg.cc/qM2fnbRw/Queen-Silver-Stripes.jpg" },
  { id: "queen-hb-wood", name: "Queen + Wooden Pedestals", category: "furniture", price: 4200, subtitle: "With wooden pedestals", image: "https://i.postimg.cc/qM2fnbRw/Queen-Silver-Stripes.jpg" },
  { id: "queen", name: "Queen", category: "furniture", price: 2500, image: "https://i.postimg.cc/qM2fnbRw/Queen-Silver-Stripes.jpg" },
  { id: "queen-silver", name: "Queen (Silver Stripes)", category: "furniture", price: 3500, image: "https://i.postimg.cc/qM2fnbRw/Queen-Silver-Stripes.jpg" },
  { id: "dining-chairs", name: "Genuine Leather Dining Chairs", category: "furniture", price: 3000, subtitle: "Per pair", image: "https://i.postimg.cc/yN2Xmzvr/leather-chair.jpg" },
  { id: "exclusive-couch", name: "Exclusive Bedroom Couch", category: "furniture", price: 4800, image: "https://i.postimg.cc/qM2fnbRw/Queen-Silver-Stripes.jpg" },
  { id: "queen-set", name: "Queen HB + Base Cover & Pedestals", category: "furniture", price: 7000 },
  { id: "queen-hb-base", name: "Queen HB & Base Cover", category: "furniture", price: 5000, image: "https://i.postimg.cc/kgTF1SXZ/Queen-base.jpg" },
  { id: "queen-pedestals", name: "Queen + Pedestals", category: "furniture", price: 3500 },
  { id: "l-shape", name: "L‑Shape Couch", category: "furniture", price: 7000, image: "https://i.postimg.cc/8czRDP5c/L-shaaped-sofa.jpg" },
  { id: "single-hb", name: "Single Bed Headboard", category: "furniture", price: 1500, image: "https://i.postimg.cc/dt7WT4s1/single.jpg" },
  { id: "queen-full", name: "Queen HB + Base + Pedestals", category: "furniture", price: 7000 },
  { id: "bedroom-couch", name: "Bedroom Couch", category: "furniture", price: 2500 },
  { id: "king-set", name: "King HB + Base + (Just?)", category: "furniture", price: 12000 },
  { id: "mixed-item-range", name: "Item (Range)", category: "furniture", priceMin: 700, priceMax: 4200, subtitle: "Item from R700 to R4200" },

  // Decor
  { id: "decor-package", name: "Event Decor Package", category: "decor", price: 2500, subtitle: "Standard decor package", image: "https://i.postimg.cc/PNGFqw8K/decor-full.jpg" },
  { id: "table-decor", name: "Table Decor", category: "decor", price: 300, subtitle: "Per table", image: "https://i.postimg.cc/4dDrYMDz/table-decor.jpg" },
];

const ZAR = (n: number) =>
  new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(n);

// --- Branding ---
const brand = {
  name: "Mancinza Upholstery",
  email: "sales@mancinzaupholstery.site",
  phone: "+27 79 733 4244",
  address: "Mbombela, Mpumalanga, South Africa",
  logoUrl: "/Logo(light).png", // ensure this file exists in /public
};

// Build a simple invoice number like MANC-YYYYMMDD-XXXX
const makeInvoiceNumber = () => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const ymd = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
  const rnd = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `MANC-${ymd}-${rnd}`;
};

// -------------------- Validation helpers --------------------
const DISPOSABLE_EMAILS = new Set([
  "mailinator.com","10minutemail.com","tempmail.com","temp-mail.org","guerrillamail.com","yopmail.com","trashmail.com",
]);

const nameLooksReal = (value: string) => {
  // Two words min, letters/spaces/-, each >= 2 chars
  const cleaned = value.trim().replace(/\s+/g, " ");
  if (cleaned.length < 5) return false;
  const parts = cleaned.split(" ");
  if (parts.length < 2) return false;
  if (!/^[A-Za-z][A-Za-z\-\s']+$/.test(cleaned)) return false;
  return parts.every(p => p.length >= 2);
};

const emailLooksReal = (value: string) => {
  const basic = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
  if (!basic) return false;
  try {
    const domain = value.split("@")[1].toLowerCase();
    if (DISPOSABLE_EMAILS.has(domain)) return false;
  } catch {}
  return true;
};

const notPastDate = (yyyyMmDd: string) => {
  if (!yyyyMmDd) return true; // optional
  const sel = new Date(yyyyMmDd + "T00:00:00");
  const today = new Date();
  today.setHours(0,0,0,0);
  return sel >= today;
};

export default function BookingEstimator() {
  const [activeTab, setActiveTab] = useState<Category>("furniture");
  const [query, setQuery] = useState("");
  const [distanceKm, setDistanceKm] = useState<number | "">("");
  const [includeSetup, setIncludeSetup] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");

  const [basket, setBasket] = useState<Record<string, BasketItem>>({});
  const [rangePrice, setRangePrice] = useState<Record<string, number>>({});

  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState<string>(makeInvoiceNumber());

  // Validation UI state
  const [touched, setTouched] = useState<{name?:boolean; email?:boolean; date?:boolean; distance?:boolean}>({});
  const [hardBlockBanner, setHardBlockBanner] = useState<string | null>(null);

  // ---- Catalog calc ----
  const filtered = useMemo(() => {
    return CATALOG.filter((p) => p.category === activeTab && p.name.toLowerCase().includes(query.toLowerCase()));
  }, [activeTab, query]);

  const add = (id: string) =>
    setBasket((b) => {
      const next = { ...(b[id] ?? { id, qty: 0 }), qty: (b[id]?.qty ?? 0) + 1 };
      return { ...b, [id]: next };
    });

  const dec = (id: string) =>
    setBasket((b) => {
      const current = b[id];
      if (!current) return b;
      const qty = Math.max(0, current.qty - 1);
      const copy = { ...b };
      if (qty === 0) delete copy[id];
      else copy[id] = { id, qty };
      return copy;
    });

  const setQty = (id: string, qty: number) =>
    setBasket((b) => {
      if (qty <= 0) {
        const copy = { ...b };
        delete copy[id];
        return copy;
      }
      return { ...b, [id]: { id, qty } };
    });

  const itemsInBasket = useMemo(() => {
    const getItemUnitPrice = (item: CatalogItem) => {
      if (item.price != null) return item.price;
      const chosen = rangePrice[item.id];
      if (chosen != null) return chosen;
      if (item.priceMin != null && item.priceMax != null) return Math.round((item.priceMin + item.priceMax) / 2);
      return 0;
    };
    return Object.values(basket)
      .map((b) => {
        const item = CATALOG.find((c) => c.id === b.id)!;
        const unit = getItemUnitPrice(item);
        const lineTotal = unit * b.qty;
        return { item, qty: b.qty, unit, lineTotal };
      })
      .sort((a, b) => a.item.name.localeCompare(b.item.name));
  }, [basket, rangePrice]);

  const furnitureSubtotal = itemsInBasket.filter((x) => x.item.category === "furniture").reduce((s, x) => s + x.lineTotal, 0);
  const decorSubtotal = itemsInBasket.filter((x) => x.item.category === "decor").reduce((s, x) => s + x.lineTotal, 0);

  // Delivery & setup
  const delivery = distanceKm === "" ? 0 : 150 + 8 * Number(distanceKm);
  const setup = includeSetup ? 250 : 0;

  // Discount rule
  const merchandiseSubtotal = furnitureSubtotal + decorSubtotal;
  const discount = merchandiseSubtotal >= 5000 ? Math.round(merchandiseSubtotal * 0.05) : 0;

  const estimateTotal = Math.max(0, merchandiseSubtotal - discount) + delivery + setup;

  // -------------------- Derived validation --------------------
  const hasItems = itemsInBasket.length > 0;
  const nameValid = nameLooksReal(name);
  const emailValid = emailLooksReal(email);
  const dateValid = notPastDate(date);
  const distanceValid = distanceKm === "" || (typeof distanceKm === "number" && distanceKm <= 500);

  const formValid = hasItems && nameValid && emailValid && dateValid && distanceValid;

  useEffect(() => {
    // show a friendly "why disabled" banner if user tries to open without valid inputs
    setHardBlockBanner(null);
  }, [name, email, date, distanceKm, itemsInBasket.length]);

  // -------------------- WhatsApp message --------------------
  const buildWhatsAppText = () => {
    const lines = itemsInBasket.map(({ item, qty, lineTotal }) =>
      `${qty}× ${item.name} – ${ZAR(lineTotal)}`
    );
    const parts = [
      `Hi ${name || ""}, this is your invoice from ${brand.name}.`,
      `Invoice: ${invoiceNumber}`,
      date ? `Event date: ${new Date(date).toLocaleDateString("en-ZA")}` : null,
      "",
      ...lines,
      "",
      `Furniture: ${ZAR(furnitureSubtotal)}`,
      `Decor: ${ZAR(decorSubtotal)}`,
      discount > 0 ? `Discount: -${ZAR(discount)}` : null,
      `Delivery: ${ZAR(delivery)}`,
      includeSetup ? `Setup: ${ZAR(setup)}` : null,
      `Total: ${ZAR(estimateTotal)}`,
      "",
      "I will attach the PDF in this chat now. Thank you!"
    ].filter(Boolean);
    return parts.join("\n");
  };

  const whatsappShare = () => {
    const text = buildWhatsAppText();
    const url = `https://wa.me/27679972425?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  // -------------------- Print / Save as PDF (with guidance) --------------------
  const printInvoice = () => {
    const win = window.open("", "_blank", "width=900,height=1200");
    if (!win) return;
    const today = new Date().toLocaleDateString("en-ZA");

    const rows = itemsInBasket
      .map(
        (r) => `
      <tr>
        <td>${r.item.name}</td>
        <td style="text-align:center">${r.qty}</td>
        <td style="text-align:right">${ZAR(r.unit)}</td>
        <td style="text-align:right">${ZAR(r.lineTotal)}</td>
      </tr>`
      )
      .join("");

    const discountRow = discount
      ? `<tr><td colspan="3" style="text-align:right">Discount</td><td style="text-align:right">-${ZAR(discount)}</td></tr>`
      : "";

    const setupRow = includeSetup
      ? `<tr><td colspan="3" style="text-align:right">Setup</td><td style="text-align:right">${ZAR(setup)}</td></tr>`
      : "";

    const html = `
<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>Invoice ${invoiceNumber}</title>
<style>
  @media print { @page { size: A4; margin: 18mm; } }
  body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial; color:#0f172a; }
  .brand { display:flex; align-items:center; gap:12px; }
  .brand h1 { font-size: 20px; margin:0; }
  .muted { color:#64748b; }
  .pill { padding:4px 10px; border:1px solid #e2e8f0; border-radius:999px; font-size:12px; }
  .header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:18px; }
  .box { border:1px solid #e2e8f0; border-radius:12px; padding:12px; }
  table { width:100%; border-collapse: collapse; margin-top:12px; }
  th, td { padding:10px 8px; border-bottom:1px solid #e2e8f0; font-size:14px; }
  th { background:#f8fafc; text-align:left; }
  .right { text-align:right; }
  .total { font-weight:700; font-size:16px; }
  .footer { margin-top:24px; font-size:12px; color:#64748b; }
</style>
</head>
<body>
  <div class="header">
    <div class="brand">
      ${brand.logoUrl ? `<img src="${brand.logoUrl}" alt="logo" style="height:40px;border-radius:8px" />` : ""}
      <div>
        <h1>${brand.name}</h1>
        <div class="muted">${brand.address}</div>
        <div class="muted">${brand.email} • ${brand.phone}</div>
      </div>
    </div>
    <div style="text-align:right">
      <div class="pill">INVOICE</div>
      <div style="margin-top:6px"><strong>No:</strong> ${invoiceNumber}</div>
      <div><strong>Date:</strong> ${today}</div>
      ${date ? `<div><strong>Event:</strong> ${new Date(date).toLocaleDateString("en-ZA")}</div>` : ""}
    </div>
  </div>

  <div class="box" style="margin-bottom:12px">
    <div><strong>Bill To:</strong> ${name || "—"}</div>
    <div class="muted">${email || ""}</div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Item</th>
        <th style="text-align:center">Qty</th>
        <th class="right">Unit</th>
        <th class="right">Line Total</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
      <tr><td colspan="3" class="right">Furniture</td><td class="right">${ZAR(furnitureSubtotal)}</td></tr>
      <tr><td colspan="3" class="right">Decor</td><td class="right">${ZAR(decorSubtotal)}</td></tr>
      ${discountRow}
      <tr><td colspan="3" class="right">Delivery</td><td class="right">${ZAR(delivery)}</td></tr>
      ${setupRow}
      <tr><td colspan="3" class="right total">Total</td><td class="right total">${ZAR(estimateTotal)}</td></tr>
    </tbody>
  </table>

  <div class="footer">
    * This is a computer-generated invoice. Prices are estimates unless otherwise stated. Final amounts can vary based on fabrics, access, or special requests.
  </div>
</body>
</html>`.trim();

    win.document.open();
    win.document.write(html);
    win.document.close();

    // Give images a moment to load before printing
    setTimeout(() => {
      win.print();
      setTimeout(() => {
        alert("✅ Saved! Now tap the green WhatsApp button to open WhatsApp.\n\nStep 1: Tap the WhatsApp button.\nStep 2: Paste/confirm the pre-filled message.\nStep 3: Attach the saved PDF to the chat.\nStep 4: Send to the client.");
      }, 300);
    }, 400);
  };

  // -------------------- Generate invoice (gate with validation) --------------------
  const onGenerateInvoice = (e: React.FormEvent) => {
    e.preventDefault();

    // mark fields as touched so errors show
    setTouched({ name: true, email: true, date: true, distance: true });

    if (!hasItems) {
      setHardBlockBanner("Add at least one item to the estimate before generating an invoice.");
      return;
    }
    if (!nameValid) {
      setHardBlockBanner("Please enter a real full name (e.g. 'John Mthembu'). No single letters or symbols.");
      return;
    }
    if (!emailValid) {
      setHardBlockBanner("Enter a valid email (no temporary email providers).");
      return;
    }
    if (!dateValid) {
      setHardBlockBanner("Event date cannot be in the past.");
      return;
    }
    if (!distanceValid) {
      setHardBlockBanner("Delivery distance seems too large. Please check the value (max 500 km).");
      return;
    }

    setInvoiceNumber(makeInvoiceNumber());
    setShowInvoice(true);
  };

  // -------------------- UI helpers --------------------
  const errorText = {
    name: touched.name && !nameValid ? "Enter your full name (at least 2 words, letters only)." : "",
    email: touched.email && !emailValid ? "Enter a valid email (no temporary email providers)." : "",
    date: touched.date && !dateValid ? "Date cannot be in the past." : "",
    distance: touched.distance && !distanceValid ? "Please enter a distance up to 500 km." : "",
  };

  const disabledReason = !hasItems
    ? "Add at least one item"
    : !nameValid
    ? "Enter a real full name"
    : !emailValid
    ? "Enter a valid email"
    : !dateValid
    ? "Invalid date"
    : !distanceValid
    ? "Distance too large"
    : undefined;

  return (
    <section id="booking" className="py-16">
      <div className="container mx-auto max-w-6xl px-4">
        <header className="mb-8 text-center">
          <h2 className="text-3xl font-semibold">Book Furniture & Decor</h2>
          <p className="text-muted-foreground">Choose items, pick quantities, and generate a clean invoice instantly.</p>
        </header>

        {hardBlockBanner && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 p-3 text-amber-800">
            <AlertTriangle className="mt-0.5 h-5 w-5" />
            <div className="text-sm">
              <div className="font-semibold">Please fix before continuing</div>
              <div>{hardBlockBanner}</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          {/* LEFT: Catalog */}
          <CatalogGrid
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            query={query}
            setQuery={setQuery}
            filtered={filtered}
            basket={basket}
            add={add}
            dec={dec}
            setQty={setQty}
            rangePrice={rangePrice}
            setRangePrice={setRangePrice}
          />

          {/* RIGHT: Estimate + Invoice */}
          <aside className="lg:sticky lg:top-4 h-fit">
            <form onSubmit={onGenerateInvoice} className="rounded-xl border border-border bg-card p-5 space-y-5">
              <h3 className="text-xl font-semibold">Estimate</h3>

              {/* Date & contact */}
              <div className="grid grid-cols-1 gap-3">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    onBlur={() => setTouched(t => ({...t, date:true}))}
                    className={`w-full pl-10 pr-3 py-2 rounded-lg border ${errorText.date ? "border-red-400" : "border-border"} bg-input-background`}
                  />
                  {errorText.date && <p className="mt-1 text-xs text-red-600">{errorText.date}</p>}
                </div>
                <div>
                  <input
                    placeholder="Client full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => setTouched(t => ({...t, name:true}))}
                    className={`w-full px-3 py-2 rounded-lg border ${errorText.name ? "border-red-400" : "border-border"} bg-input-background`}
                  />
                  {errorText.name && <p className="mt-1 text-xs text-red-600">{errorText.name}</p>}
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Client email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setTouched(t => ({...t, email:true}))}
                    className={`w-full px-3 py-2 rounded-lg border ${errorText.email ? "border-red-400" : "border-border"} bg-input-background`}
                  />
                  {errorText.email && <p className="mt-1 text-xs text-red-600">{errorText.email}</p>}
                </div>
              </div>

              {/* Delivery & setup */}
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-sm mb-1">Delivery distance (km)</label>
                  <input
                    type="number"
                    min={0}
                    value={distanceKm}
                    onChange={(e) => setDistanceKm(e.target.value === "" ? "" : Math.max(0, Number(e.target.value)))}
                    onBlur={() => setTouched(t => ({...t, distance:true}))}
                    className={`w-full px-3 py-2 rounded-lg border ${errorText.distance ? "border-red-400" : "border-border"} bg-input-background`}
                    placeholder="e.g. 10"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Calc: R150 base + R8 per km (max 500 km).</p>
                  {errorText.distance && <p className="mt-1 text-xs text-red-600">{errorText.distance}</p>}
                </div>

                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={includeSetup}
                    onChange={(e) => setIncludeSetup(e.target.checked)}
                    className="h-4 w-4"
                  />
                  Include setup (R250)
                </label>
              </div>

              {/* Breakdown */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Furniture</span><span>{ZAR(furnitureSubtotal)}</span></div>
                <div className="flex justify-between"><span>Decor</span><span>{ZAR(decorSubtotal)}</span></div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Bulk discount (5% ≥ R5,000)</span><span>-{ZAR(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between"><span>Delivery</span><span>{ZAR(delivery)}</span></div>
                {includeSetup && (
                  <div className="flex justify-between"><span>Setup</span><span>{ZAR(setup)}</span></div>
                )}
                <hr className="my-2 border-border" />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Estimated Total</span><span>{ZAR(estimateTotal)}</span>
                </div>
              </div>

              {/* Basket lines */}
              {itemsInBasket.length > 0 && (
                <div className="border border-border rounded-lg p-3">
                  <div className="text-sm font-semibold mb-2">Your items</div>
                  <ul className="space-y-1 text-sm">
                    {itemsInBasket.map(({ item, qty, lineTotal }) => (
                      <li key={item.id} className="flex justify-between">
                        <span>{qty}× {item.name}</span>
                        <span>{ZAR(lineTotal)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Generate Invoice */}
              <button
                type="submit"
                className={`w-full py-3 px-6 rounded-lg transition text-white ${formValid ? "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:opacity-90" : "bg-gray-300 cursor-not-allowed"}`}
                disabled={!formValid}
                title={disabledReason || "Open invoice preview"}
              >
                Generate Invoice
              </button>

              <p className="text-xs text-muted-foreground">
                This is an estimate. Final invoice may vary based on custom fabrics, special requests, access & setup conditions.
              </p>
            </form>
          </aside>
        </div>
      </div>

      {/* Invoice Modal */}
      {showInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowInvoice(false)} />
          <div className="relative z-10 w-[95vw] max-w-3xl max-h-[90vh] overflow-auto rounded-2xl border border-white/10 bg-white shadow-2xl">
            {/* Onboarding ribbon for new users */}
            <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-3 text-sm text-emerald-900 flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5" />
              <div>
                <div className="font-semibold">Almost done!</div>
                <ol className="list-decimal pl-5 space-y-0.5">
                  <li>Tap <strong>Print / Save PDF</strong> to save the invoice to your phone.</li>
                  <li>Tap <strong>WhatsApp client</strong> to open WhatsApp with a pre‑filled message.</li>
                  <li>Attach the saved PDF to the chat and press <strong>Send</strong>.</li>
                </ol>
              </div>
            </div>

            <div className="sticky top-[52px] z-20 flex items-center justify-between gap-2 border-b bg-white/90 px-4 py-3">
              <div className="text-sm font-semibold">Invoice Preview — {invoiceNumber}</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={whatsappShare}
                  className="px-4 py-1.5 rounded-full text-sm text-white bg-green-600 hover:opacity-90"
                  type="button"
                >
                  WhatsApp client
                </button>
                <button
                  onClick={printInvoice}
                  className="px-4 py-1.5 rounded-full text-sm text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90"
                >
                  Print / Save PDF
                </button>
                <button
                  onClick={() => setShowInvoice(false)}
                  className="px-3 py-1.5 rounded-full text-sm bg-black/5 hover:bg-black/10"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Pretty, printable content mirrors the print window */}
            <div className="p-6 text-slate-800">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {brand.logoUrl && <img src={brand.logoUrl} alt="logo" className="h-10 rounded-lg" />}
                  <div>
                    <div className="text-lg font-semibold">{brand.name}</div>
                    <div className="text-sm text-slate-500">{brand.address}</div>
                    <div className="text-sm text-slate-500">{brand.email} • {brand.phone}</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 rounded-full border text-xs">INVOICE</span>
                  <div className="text-sm"><span className="font-medium">No:</span> {invoiceNumber}</div>
                  <div className="text-sm"><span className="font-medium">Date:</span> {new Date().toLocaleDateString("en-ZA")}</div>
                  {date && <div className="text-sm"><span className="font-medium">Event:</span> {new Date(date).toLocaleDateString("en-ZA")}</div>}
                </div>
              </div>

              <div className="rounded-xl border p-4 mb-4">
                <div className="text-sm"><span className="font-medium">Bill To:</span> {name || "—"}</div>
                <div className="text-xs text-slate-500">{email || ""}</div>
              </div>

              <div className="overflow-x-auto rounded-xl border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-left">
                      <th className="p-3">Item</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Unit</th>
                      <th className="p-3 text-right">Line Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {itemsInBasket.map((r) => (
                      <tr key={r.item.id} className="border-t">
                        <td className="p-3">{r.item.name}</td>
                        <td className="p-3 text-center">{r.qty}</td>
                        <td className="p-3 text-right">{ZAR(r.unit)}</td>
                        <td className="p-3 text-right">{ZAR(r.lineTotal)}</td>
                      </tr>
                    ))}

                    <tr className="border-t">
                      <td className="p-3 text-right font-medium" colSpan={3}>Furniture</td>
                      <td className="p-3 text-right">{ZAR(furnitureSubtotal)}</td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-3 text-right font-medium" colSpan={3}>Decor</td>
                      <td className="p-3 text-right">{ZAR(decorSubtotal)}</td>
                    </tr>
                    {discount > 0 && (
                      <tr className="border-t text-emerald-600">
                        <td className="p-3 text-right font-medium" colSpan={3}>Discount</td>
                        <td className="p-3 text-right">-{ZAR(discount)}</td>
                      </tr>
                    )}
                    <tr className="border-t">
                      <td className="p-3 text-right font-medium" colSpan={3}>Delivery</td>
                      <td className="p-3 text-right">{ZAR(delivery)}</td>
                    </tr>
                    {includeSetup && (
                      <tr className="border-t">
                        <td className="p-3 text-right font-medium" colSpan={3}>Setup</td>
                        <td className="p-3 text-right">{ZAR(setup)}</td>
                      </tr>
                    )}

                    <tr className="border-t">
                      <td className="p-3 text-right font-bold text-base" colSpan={3}>Total</td>
                      <td className="p-3 text-right font-bold text-base">{ZAR(estimateTotal)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-xs text-slate-500 mt-4">
                * This is a computer-generated invoice. Prices are estimates unless otherwise stated. Final amounts can vary based on fabrics, access, or special requests.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ---------- Extracted Catalog Grid (kept same look/feel) ---------- */
function CatalogGrid(props: {
  activeTab: Category;
  setActiveTab: (c: Category) => void;
  query: string;
  setQuery: (s: string) => void;
  filtered: CatalogItem[];
  basket: Record<string, BasketItem>;
  add: (id: string) => void;
  dec: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  rangePrice: Record<string, number>;
  setRangePrice: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}) {
  const { activeTab, setActiveTab, query, setQuery, filtered, basket, add, dec, setQty, rangePrice, setRangePrice } = props;

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="flex gap-2">
        {(["furniture", "decor"] as Category[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
              activeTab === tab
                ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-transparent"
                : "bg-white/10 text-black border-gray-300 hover:bg-white/20 backdrop-blur"
            }`}
          >
            {tab === "furniture" ? "Furniture" : "Decor"}
          </button>
        ))}
      </div>

      {/* Search */}
      <div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${activeTab === "furniture" ? "furniture" : "decor"}…`}
          className="w-full px-4 py-3 rounded-lg border border-border bg-input-background"
        />
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((p) => {
          const inBasket = basket[p.id]?.qty ?? 0;
          const isRanged = p.price == null && p.priceMin != null && p.priceMax != null;
          const chosen =
            rangePrice[p.id] ?? (isRanged ? Math.round((p.priceMin! + p.priceMax!) / 2) : p.price ?? 0);

          return (
            <article key={p.id} className="rounded-xl border border-border bg-card overflow-hidden flex flex-col">
              {/* Thumbnail */}
              <div className="h-32 bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-800 dark:to-neutral-700 flex items-center justify-center">
                {p.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs text-muted-foreground">No image</span>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-semibold">{p.name}</h3>
                {p.subtitle && <p className="text-sm text-muted-foreground">{p.subtitle}</p>}

                {/* Price / Range selector */}
                <div className="mt-2">
                  {isRanged ? (
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">
                        {ZAR(p.priceMin!)} – {ZAR(p.priceMax!)}
                      </div>
                      <input
                        type="range"
                        min={p.priceMin}
                        max={p.priceMax}
                        step={50}
                        value={chosen}
                        onChange={(e) =>
                          setRangePrice((rp) => ({ ...rp, [p.id]: Number((e.target as HTMLInputElement).value) }))
                        }
                        className="w-full"
                      />
                      <div className="text-xs text-muted-foreground mt-1">Selected: {ZAR(chosen)}</div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">{ZAR(p.price!)}</div>
                  )}
                </div>

                {/* Qty controls */}
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => dec(p.id)}
                    className="px-3 py-2 rounded-md border border-border hover:bg-accent"
                    aria-label={`Decrease ${p.name}`}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min={0}
                    value={inBasket}
                    onChange={(e) => setQty(p.id, Number((e.target as HTMLInputElement).value) || 0)}
                    className="w-16 text-center rounded-md border border-border bg-input-background py-2"
                  />
                  <button
                    onClick={() => add(p.id)}
                    className="px-3 py-2 rounded-md border border-transparent bg-gradient-to-r from-emerald-500 to-cyan-500 text-white"
                    aria-label={`Increase ${p.name}`}
                  >
                    +
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}