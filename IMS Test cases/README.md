# IMS Test Cases – by Flow (Sheets)

Each CSV file is one **sheet**. Import them into Excel or Google Sheets to get one workbook with separate sheets per flow.

**For QA testers (non-engineers):** Every test has **Detailed Steps** (what to do, click by click) and **Detailed Expected Result** (what you should see at each stage). Follow the steps in order and check that the expected results match. If something different happens, write it in **Spotted Problems**.

## Files (sheets)

| File | Sheet name |
|------|------------|
| `0_Role_Reference.csv` | Role Reference (roles and scope) |
| `1_Identity_Management_Flow.csv` | Identity Management Flow |
| `2_Product_and_Category_Flow.csv` | Product and Category Flow |
| `3_Order_Flow.csv` | Order Flow |
| `4_Membership_Flow.csv` | Membership Flow |
| `5_MFE_Integration.csv` | MFE Integration |
| `6_Issues_or_findings.csv` | Issues or findings |
| `7_Super_Admin_Dashboard_UI.csv` | Super Admin Dashboard UI |

## Columns (all flow sheets except Issues)

- **Test Case** – Short name
- **Detailed Steps** – What to do (click by click)
- **Detailed Expected Result** – What should happen
- **Type** – Happy path / Edge case / Smoke
- **Priority** – P1 / P2 / P3
- **Allowed roles** – Which user role(s) can perform this action (from backend). Use **`0_Role_Reference.md`** for the full role list and scope rules; run the test with a user that has one of the allowed roles.
- **Status** – Not Started / In Progress / Pass / Fail / Blocked
- **Spotted Problems** – Notes during test
- **RESPONSIBLE** – Tester or owner

## Issues sheet

- **ID**, **Flow**, **Summary**, **Description**, **Severity**, **Status**, **Reported Date**, **RESPONSIBLE**

## How to get one workbook with multiple sheets

**Excel:**  
1. Open the first CSV (e.g. `1_Identity_Management_Flow.csv`).  
2. Save As → **Excel Workbook (.xlsx)**.  
3. For each other CSV: Data → Get Data → From File → From Text/CSV, choose the CSV, Load → **Load to** → “Create new sheet”.  
4. Rename sheets to: Role Reference, Identity Management Flow, Product and Category Flow, Order Flow, Membership Flow, MFE Integration, Issues or findings, Super Admin Dashboard UI.

**Google Sheets:**  
1. Create a new spreadsheet.  
2. For each CSV: File → Import → Upload, select the CSV, choose “Insert new sheet(s)”.  
3. Rename each imported sheet as above (Role Reference, Identity Management Flow, …, Super Admin Dashboard UI).
