# Transact Bridge - Enterprise Transaction Monitoring Dashboard

High-availability payment transaction monitoring and settlement analytics dashboard built with the **Transact Bridge** design system and brand palette.

Deployable directly to **[Vercel](https://vercel.com/)** with zero configuration, featuring an **hourly manual Excel/CSV ingestion engine** supporting Transact Bridge's exact 83-column payment gateway schema.

---

## 🎨 Brand Palette
- **Primary Background**: Midnight Navy (`#001626`)
- **Primary Accent**: Electric Blue (`#007aff`)
- **Card Surfaces**: Deep Slate Navy (`#09233a`)
- **Borders**: Navy Accent (`#13395c`)
- **Success State**: Settlement Emerald (`#10b981`)
- **Failure State**: Declined Coral (`#f43f5e`)

---

## 🚀 How to Deploy to Vercel (Live in 2 Minutes)

### Option 1: Deploy via GitHub & Vercel Dashboard (Recommended)
1. Push this directory to your GitHub account:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
   git branch -M main
   git push -u origin main
   ```
2. Go to **[vercel.com/new](https://vercel.com/new)**.
3. Import your GitHub repository.
4. Leave all build settings as default (Framework Preset: **Other**, Build Command: empty, Output Directory: empty).
5. Click **Deploy**. Vercel will deploy your live dashboard with an active HTTPS URL (`https://your-project.vercel.app`)!

### Option 2: Deploy directly via Vercel CLI
If you have Node.js installed on your machine:
```bash
# Run inside this directory
npx vercel
```
- When prompted:
  - *Set up and deploy?* -> **Y**
  - *Which scope?* -> Select your Vercel account
  - *Link to existing project?* -> **N**
  - *What's your project's name?* -> `transact-bridge-monitoring`
  - *In which directory is your code located?* -> `./`
- To deploy to production:
```bash
npx vercel --prod
```

---

## 📤 Hourly Manual Data Upload Engine

The dashboard allows payment operations teams to upload Excel or CSV dumps generated on an hourly basis:

1. Click **"📤 Upload Hourly Data"** in the top navigation bar.
2. Select your file format:
   - **Upload Excel / CSV**: Drag and drop `.xlsx`, `.xls`, `.csv`, or `.tsv` files.
   - **Paste Copied Cells**: Directly paste rows copied from Microsoft Excel or Google Sheets.
3. Configure your batch:
   - **Batch Label**: Automatically defaults to current hour (e.g. `Hour 11:00 - 12:00 | 17-Sep`).
   - **Ingestion Mode**:
     - `Append to today's data`: Accumulates transactions across multiple hours.
     - `Replace current data`: Focuses exclusively on the newly uploaded hour.
4. Click **"Process & Ingest Batch"**:
   - The dashboard immediately recalculates all KPIs, success rates, amounts, merchant performance, failure diagnostics, and payment method charts.
5. **IndexedDB Persistence**: All uploaded hourly batches are stored securely inside the browser's local IndexedDB, so your data persists even if you refresh or restart your browser.
6. **Template Download**: Click **"📄 Download Schema Template"** to get a ready-to-use CSV template matching your exact 83-column structure.

---

## 📋 Exact Supported Schema (83 Columns)
The ingestion parser automatically maps the following columns:
```
_id, merchantId, customerId, status, type, txSubStatus, code, currId, quoteCurrCode,
isSettled, referenceId, billingSessionId, paymentDetails.payMethod, paymentDetails.pgCode,
paymentDetails.pgProvider, paymentDetails.payMethodIdentifier, paymentDetails.payMethodBeneficiary,
paymentDetails.upiChannel, paymentDetails.paymentId, paymentDetails.BankName, paymentDetails.CardName,
paymentDetails.upiAppName, paymentDetails.sourceDevice, paymentDetails.sourceOS,
paymentDetails.sourcePlatform, paymentDetails.payMethodGroup, meta.param1, meta.param2, meta.param3,
remark, txSubType, gstInclusive, isMandate, isBanned, createdDate, updatedDate,
failedInfo.failedState, failedInfo.responseCode, referenceNo, isDirectPacbMerchant, quoteAmt,
quoteAmount, totalTax, amount, totalAmount, txFee, txQuoteFee, txCost, txCostQuoteFee,
rrFee, rrQuoteFee, settleAmount, settleQuoteAmount, fxQuote, mandateRegFee,
mandateRegQuoteFee, mandateExcQuoteFee, mandateExecFee, mandateNotifyQuoteFee, mandateNotifyFee,
midMandateRegFee, midMandateExecFee, subscriptionId, successDate, failedDate, settleId,
refund_txnId, refund_initiatedDate, refund_successDate, refund_status, chargeback_txnId,
chargeback_initiatedDate, chargeback_successDate, chargeback_status, depositSuccessDate,
banDate, email, customerName, returnUrl, pendingUrl, successUrl, failedUrl, legalEntityCode
```

---

## 💻 Local Testing
To test the dashboard locally before deploying to Vercel:
```bash
python3 -m http.server 3000
```
Then open `http://localhost:3000` in your web browser.

---

## 🔐 Enterprise Credentials & Role Permissions

The portal supports password-authenticated role access:

| Role | User ID (Email) | Password | Default Capabilities |
| :--- | :--- | :--- | :--- |
| **👑 Platform Administrator** | `Shreyasth@transactbridge.com` | `Shreyasth@1234` | Full access: File ingestion, SLA threshold customization, alert dispatching, route mitigations, and team permission controls. |
| **👁️ Operations Viewer** | `Ops@transactbridge.com` | `Transact@12` | View-only live telemetry, KPI analysis, and shared team transaction feeds. Capabilities dynamically governed by Admin policy. |

### 🛡️ Admin Permission Control Center
When signed in as **Shreyasth@transactbridge.com**, click **"🛡️ Permissions"** in the top navigation bar or user profile dropdown to configure privileges for Viewer sessions:
1. **Upload Hourly Data** (`canUpload`)
2. **Modify Target SLA Threshold** (`canAdjustSla`)
3. **Configure & Dispatch Alerts** (`canDispatchAlerts`)
4. **Trigger Custom Analysis & Incident Failovers** (`canTriggerAnalysis`)
5. **Export Analytics Reports** (`canExportReports`)
6. **View Financials & Revenue at Risk** (`canViewFinancials`)

Changes are instantly broadcasted to all active team sessions via cloud telemetry!
