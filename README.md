# Julius Frontend

Personal finance management web application. Modern React UI for tracking expenses, income, and wallets.

## Features

- User authentication (Firebase)
- Wallet management and balance tracking
- Monthly expense tracking with categories
- Income/revenue tracking
- Expense categorization and visualization
- Financial objectives
- Bank account management
- Responsive design (Bootstrap)

## Tech Stack

- **Framework**: React 18.2.0
- **Routing**: React Router DOM 6.18.0
- **UI**: Bootstrap 5.3.2 + React Bootstrap 2.9.1
- **Charts**: Chart.js + react-chartjs-2
- **Icons**: React Bootstrap Icons
- **Build**: Create React App

## Quick Start

### Installation

```bash
npm install
```

### Development Server

```bash
npm run start-react
```

App runs on `http://localhost:3001`

### Production Build

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── CadastroForm.js
│   ├── LoginForm.js
│   ├── DespesaForm.js
│   ├── MonthExpenseList.js
│   ├── WalletResume.js
│   └── ...
├── pages/              # Page components
│   ├── LoginPage.js
│   ├── CadastroPage.js
│   ├── CarteiraPage.js
│   └── ConfiguracaoPage.js
├── styles/             # CSS modules
├── App.js              # Root component
└── index.js            # Entry point
```

## API Integration

Frontend connects to backend at `http://localhost:3000`

### Key Endpoints Used

- `POST /users/createUser` - Register
- `POST /users/loginUser` - Login
- `GET /users/getUserById/:id` - Get user
- `GET /wallets/getCarteiraByUserId/:id` - List wallets
- `POST /expense/createDespesa/:walletId` - Create expense
- `GET /expense/getDespesasMensaisList/:carteiraId` - List expenses

## Dependencies

See [package.json](package.json) for full list.

Key packages:
- React & React DOM
- React Router
- Bootstrap & React Bootstrap
- Chart.js for expense analytics
- Firebase for auth

## Notes

- Ensure backend is running on port 3000
- Firebase config is embedded in components (consider moving to .env)
- Environment variables should be in `.env` file (not committed)

