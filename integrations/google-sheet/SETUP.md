# Connect the Flow Score to a Google Sheet

About 5 minutes. You only do this once.

## 1. Create the sheet

1. Go to [sheets.new](https://sheets.new) (signed in to the Google account that should own the results).
2. Name it, for example **Flow Score results**.

## 2. Add the script

1. In the sheet, open **Extensions → Apps Script**.
2. Delete the placeholder code, then paste in everything from `Code.gs` (this folder).
3. Click **Save** (the disk icon).

## 3. Check it works

1. In the toolbar's function menu, choose **testSetup**, then click **Run**.
2. Google asks you to authorise the script. Choose your account, then **Advanced → Go to (project name) → Allow**.
   It only asks for access to this spreadsheet.
3. Back in the sheet, a **Flow Score** tab appears with a header row and one test row. You can delete the test row.

## 4. Publish it as a web app

1. Click **Deploy → New deployment**.
2. Click the cog next to "Select type" and choose **Web app**.
3. Set:
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy** and copy the **Web app URL** (it ends in `/exec`).

"Anyone" lets the survey on your website add rows. It does not let anyone see or edit the sheet.

## 5. Connect the survey

Paste the URL into `questionnaire.html`:

```js
const SHEET_URL = 'https://script.google.com/macros/s/…/exec';
```

Once it's set, the survey leaves preview mode: the "Preview" note disappears and every completed Flow Score is added to the sheet.

## Optional: get an email for each new result

In the sheet, open **Tools → Notification settings → Edit notifications**, and choose
**Any changes are made → Email – right away**.

## Changing the script later

After editing the script, use **Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy**.
This keeps the same URL, so the website doesn't need updating.
