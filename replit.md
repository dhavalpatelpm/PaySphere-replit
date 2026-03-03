# PaySphere - Fintech Super App

## Overview

A full-featured Fintech Super App combining PhonePe-style payments with Blinkit-style quick commerce and a financial marketplace. Built with Expo React Native for mobile-first experience.

## App Structure

### Tabs (4)
- **Home** - Wallet balance, quick actions, promo offers, recent transactions
- **Shop** - Quick commerce (groceries) with cart and checkout
- **Finance** - Investments, insurance, lending, bill payments
- **Profile** - User account, linked banks, settings

### Additional Screens
- `app/send-money.tsx` - 3-step UPI money transfer (contacts → amount → success)
- `app/bill-payment.tsx` - Bill payment flow (category → form → success)
- `app/transaction-history.tsx` - Full transaction list with filters

## Tech Stack

- **Frontend**: Expo Router, React Native
- **State**: React Context + AsyncStorage for persistence
- **UI**: Inter font, Expo Linear Gradient, expo-haptics, @expo/vector-icons
- **Navigation**: NativeTabs (iOS 26 liquid glass) + classic Tabs fallback

## Color Palette

- Primary: `#5C35CC` (deep indigo/purple)
- Accent: `#00C48C` (emerald green)
- Orange: `#FF6B35` (quick commerce)
- Background: `#F4F2FF`
- Text: `#1A0E3D`

## Key Files

- `context/AppContext.tsx` - Global state: balance, transactions, contacts
- `constants/colors.ts` - Design system colors
- `app/_layout.tsx` - Root layout with providers

## Architecture

- Backend: Express.js (port 5000) — API + landing page
- Frontend: Expo (port 8081) — mobile app
- Data: AsyncStorage for local persistence
