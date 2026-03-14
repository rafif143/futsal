You are a senior frontend engineer.

Your task is to build a **frontend prototype UI** for a **Futsal Tournament Management System**.

The project already has **Next.js (App Router) and TailwindCSS installed**.

This project is **frontend-only**. Do NOT implement backend, database, authentication, or API logic.

Use **mock data only**.

The goal is to create a **clean, professional sports tournament dashboard prototype**.

---

# Tech Stack Requirements

Framework:
Next.js (App Router)

Styling:
TailwindCSS

Component Library:
shadcn/ui

Icons:
lucide-react

Font:
Poppins

State:
React useState only (no global state library needed)

---

# UI Design Principles

Design must feel like a **professional sports event dashboard**.

Style guidelines:

Minimalist
Modern
Clean
Professional
Sports themed

Avoid visual clutter.

No emoji.

Use lucide icons.

Use **card based layout**.

Consistent padding and spacing.

Rounded corners.

---

# Color Theme

Primary (Deep Soft Green)

#1F7A63

Primary Hover

#16624F

Secondary

#E8F5F1

Background

#F7FAF9

Card Background

#FFFFFF

Border

#E5E7EB

Text Primary

#111827

Text Secondary

#6B7280

---

# Global Typography

Use **Poppins font globally**.

Font weights used:

400 regular
500 medium
600 semi-bold
700 bold

---

# Project Folder Structure

Create this folder structure:

app
dashboard
page.tsx

registration
page.tsx

public-view
page.tsx

layout.tsx

components

ui
team-card.tsx
match-card.tsx
standings-table.tsx
knockout-bracket.tsx
sidebar.tsx
header.tsx
player-event-item.tsx
modal-info.tsx

features

drawing
drawing-board.tsx
group-card.tsx

matches
match-table.tsx
match-input.tsx

registration
registration-form.tsx
payment-modal.tsx

data

mock-teams.ts
mock-players.ts
mock-groups.ts
mock-matches.ts
mock-knockout.ts

lib

utils.ts

---

# Global Layout

Create a **dashboard layout** with:

Left Sidebar
Top Header
Main Content Area

Sidebar must be collapsible on mobile.

---

# Sidebar Menu

Use lucide icons.

Menu:

Dashboard
Registration Management
Teams
Players
Drawing Table
Matches
Standings
Knockout Stage
Public View
Reports

---

# Header

Top header contains:

Page title
Breadcrumb
Admin avatar placeholder

---

# Dashboard Page

Show statistic cards:

Total Teams
Total Players
Total Matches
Matches Played

Use responsive grid layout.

---

# Registration Page (Public)

Team registration form.

Fields:

Team Name / School Name
Team Logo Upload
Official Name
Contact Number

Players section:

Dynamic player input rows.

Fields:

Player Name
Jersey Number
Student Card Upload

Buttons:

Submit Registration

Contact Admin via WhatsApp

WhatsApp button opens:

https://wa.me/{admin-number}

Message template:

Hello admin, we have registered our team and want to confirm payment.

---

# Payment Instructions

Add button:

Payment Instructions

Opens modal with:

Bank account info
Payment steps
Confirmation instructions

---

# Registration Management (Admin)

Table columns:

Team Logo
Team Name
School
Official Name
Contact
Payment Status
Actions

Actions:

View
Approve
Reject

---

# Teams Page

Table:

Logo
Team Name
School
Player Count
Actions

---

# Players Page

Table:

Player Name
Jersey Number
Team
Goals
Yellow Cards
Red Cards

---

# Drawing Table Page

Full screen layout.

Purpose:

Randomize group stage.

Grid layout:

8 groups.

Group card example:

Group A

Team logo
Team name

Each group contains 4 teams.

Buttons:

Randomize Groups
Generate Matches
Confirm Drawing

---

# After Drawing

Show generated match list.

Example:

Group A

Match 1
Team A vs Team B

Match 2
Team C vs Team D

Match 3
Team A vs Team C

Match 4
Team B vs Team D

Match 5
Team A vs Team D

Match 6
Team B vs Team C

---

# Generate PDF

Add button:

Generate Match PDF

Show printable preview layout.

No real export needed.

---

# Matches Page

Tabs:

Group Matches
Knockout Matches

Table columns:

Match Name
Stage
Teams
Score
Status
Actions

---

# Match Input Page

Responsive layout.

Two team cards.

Team A vs Team B

Score inputs.

Event input:

Player
Minute
Event Type

Event types:

Goal
Yellow Card
Red Card

Timeline UI:

12' Goal – Player A
25' Yellow Card – Player B

---

# Standings Page

Group standings table.

Columns:

Team
Played
Win
Draw
Loss
Goals For
Goals Against
Goal Difference
Points
Yellow Cards
Red Cards

Sorting:

Points
Goal Difference
Goals For

---

# Knockout Stage Page

Bracket layout.

Rounds:

Round of 16
Quarter Final
Semi Final
Final

Knockout matches are **manually entered by admin**.

Admin selects teams for Round of 16.

Bracket automatically renders structure.

Semi final losers are labeled:

3rd Place (Shared)

---

# Public View Page

Read only.

Tabs:

Group Standings
Knockout Bracket
Match Results

Design must look **clean and spectator friendly**.

---

# Reports Page

Buttons:

Generate Match Schedule PDF
Generate Knockout Bracket PDF
Generate Standings PDF

Only UI preview needed.

---

# Mock Data

Create mock data for:

32 teams.

Example team:

{
id: 1,
name: "SMPN 1 Surabaya",
logo: "/logos/team1.png"
}

Players:

10 players per team.

Groups:

8 groups A-H.

Matches:

Auto generated group matches.

Knockout:

Round of 16 bracket structure.

---

# Responsive Design

Important pages must work well on mobile:

Match Input
Registration Form
Standings

Sidebar becomes drawer.

Tables become scrollable.

---

# Reusable Components

Create reusable components:

TeamCard
MatchCard
StandingsTable
KnockoutBracket
RegistrationForm
Sidebar
Header
ModalInfo

---

# UX Goals

Fast navigation
Clear sports data layout
Professional tournament feel
Minimal UI clutter

---

# Output

Generate a complete frontend UI prototype with:

Pages
Components
Mock data
Dashboard layout

Do not implement backend.

Focus on **clean UI architecture and component structure**.
 Use shadcn components wherever possible.
Use cards, tables, dialogs, tabs, and badges.

Ensure all pages use consistent spacing and layout.

Create reusable UI components instead of duplicating code.

Follow modern Next.js best practices.