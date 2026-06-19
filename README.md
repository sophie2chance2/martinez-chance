# Sophie & Ubaldo

Standalone guest-facing wedding website for April 3, 2027 at The Lane in San Diego.

## Local preview

```bash
cp .env.example .env.local
npm run dev
```

Open `http://127.0.0.1:4173`.

## Vercel

Import this repository as a new Vercel project.

For live RSVP-to-Google-Sheets support, add:

- `GOOGLE_SHEET_ID`
- `GOOGLE_SERVICE_ACCOUNT_JSON`
- `RSVP_PASSWORD` (defaults to `Mia`)
- `RSVP_SHEET_NAME` (currently `RSVP`)
- `GUEST_SHEET_NAME` (currently `Guest List`)

For Vercel, paste the compact service-account JSON into `GOOGLE_SERVICE_ACCOUNT_JSON`. Local development can use the same variable or `GOOGLE_SERVICE_ACCOUNT_FILE`.

Share the Google Sheet with the service account email. The response tab is `RSVP`; its headers match `data/google-sheets-template.csv`.

Guest lookup uses the `Guest List` tab:

```text
Group,First Name,Last Name,Meal Type
```

The local server and Vercel function both read the guest list and write responses through the Google Sheets API.

## Images

Selected web-ready engagement photos live in `images/engagement/selected`. Update the image paths in `pages.js` when replacing them.
