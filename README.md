# HarborMesh Cloud — Static Website

A production-ready static website for a Hong Kong-based distributed GPU cloud / virtual datacenter business.

Brand used in this package: **HarborMesh Cloud**  
Suggested domain to check: **harbormeshcloud.com**  
Other domain ideas to check: **gpuhaiku.com**, **nodeharbor.cloud**, **computeharbor.com**, **gpumeshhk.com**

## What is included

- Landing page
- HKD pricing plans
- GPU tier guide
- Enterprise daily-capacity plan from HK$60,000/day
- Dedicated virtual datacenter plan from HK$120,000/day
- Provider acquisition section
- Payment-link-ready buttons
- Quote request modal
- Terms of Service
- Privacy Policy
- Refund Policy
- Success / Cancel pages for payment providers
- `vercel.json`
- `netlify.toml`

## Required edits before PG submission

Open `site-config.js` and replace:

```js
companyName: "YOUR HONG KONG COMPANY LIMITED",
businessRegistrationNumber: "YOUR BR NUMBER",
registeredOffice: "YOUR REGISTERED OFFICE ADDRESS, HONG KONG",
supportEmail: "support@harbormeshcloud.com",
salesEmail: "sales@harbormeshcloud.com",
legalEmail: "legal@harbormeshcloud.com",
```

Then add your payment links:

```js
checkoutLinks: {
  starter: "https://YOUR_PAYMENT_LINK",
  builder: "https://YOUR_PAYMENT_LINK",
  scale: "https://YOUR_PAYMENT_LINK",
  enterprise: "",
  dedicated: ""
}
```

For high-value plans, keep the button as quote request unless the PG approves direct payment.

## Deploy on GitHub + Vercel

```bash
git init
git add .
git commit -m "Initial HarborMesh Cloud site"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/harbormesh-cloud-site.git
git push -u origin main
```

Then import the repo into Vercel.

- Framework Preset: Other
- Build Command: leave empty
- Output Directory: leave empty
- Root Directory: repository root

## Deploy on Netlify

Upload this folder, or connect the GitHub repo.

- Build command: leave empty
- Publish directory: `.`
- Forms: not required because this site uses `mailto:` fallback

## Payment provider setup notes

This website avoids regulated/crypto language. It positions the service as:

> Distributed GPU cloud capacity for AI inference, image/video generation, rendering, and batch compute workloads.

It also states that HarborMesh Cloud does **not** provide:

- cryptocurrency exchange
- payment processing for third parties
- remittance
- investment products
- custody
- mining-as-a-service

## Legal note

The included Terms, Privacy Policy, and Refund Policy are commercial drafts designed for PG onboarding and website launch. They should be reviewed by Hong Kong counsel before high-volume processing or enterprise contracts.
