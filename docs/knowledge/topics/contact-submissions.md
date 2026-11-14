# Company portfolio contact submissions

Source: `techbizz-portfolio@799eb40`, inspected 2026-11-14.

## P0 · API and storage contract

- The client in `src/app/_components/ContactUsComponent.tsx` posts JSON to `/api/googleSheetSubmit`. Expected keys are `name`, `email`, `subject`, and `detail`.
- The Node.js handler in `src/app/api/googleSheetSubmit/route.ts` rejects malformed JSON and missing or whitespace-only strings with 400 and a top-level `message`. Success returns `{ data }` from the Sheets append. Integration exceptions produce 500 with `data.message`.
- The server-only adapter `src/lib/google-sheets.ts` appends raw field strings in the order above using range `A1:D1` and `USER_ENTERED` mode. This mode interprets entries the same way as interactive Sheets input.

## P1 · Configuration

- Runtime variables are `GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY`, and `GOOGLE_SHEET_ID`. The adapter converts literal backslash-n sequences in the key to newlines.
- Enable the Sheets API and give the service account write access to the spreadsheet. See the repo `README.md` for local and Docker env-file syntax. Use a designated test sheet when verifying an append, since success persists a row.

## P2 · Review findings

- **Verified from source.** The client clears name, email, and subject on success. The uncontrolled detail textarea retains the previous submission. The form has no pending-state guard, so concurrent clicks can produce independent append requests.
- **Verified from source.** Server validation checks for nonempty strings. Any changes affecting validation, response shape, or Sheets input mode need to account for the client and downstream spreadsheet behavior together.
- **Unverified.** A live Google Sheets append was outside the review.
