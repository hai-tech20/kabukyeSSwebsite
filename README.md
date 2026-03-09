# Kabukye Secondary School Website

A modern, responsive school website built with React, Tailwind CSS, and Framer Motion.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm start
```
Opens development server at `http://localhost:3000`

### Production Build
```bash
npm run build
```
Creates optimized build in `/build` folder

## 📁 Project Structure
```
kabukyeSS website/
├── public/          # Static assets
├── src/            # Source code
│   ├── components/   # Reusable components
│   ├── pages/       # Page components
│   └── supabase.js  # Database config
├── build/           # Production build (generated)
└── package.json     # Dependencies & scripts
```

## 🌐 Deployment

### Static Hosting (Netlify, Vercel, GitHub Pages)
1. Run `npm run build`
2. Upload `build` folder to hosting service
3. Set homepage in package.json if needed

### Server Hosting
1. Run `npm run build`
2. Serve `build` folder with static server
3. Configure server to handle routing

## 📱 Features
- ✅ Responsive design
- ✅ Modern animations
- ✅ Admin dashboard
- ✅ Media gallery
- ✅ Contact forms
- ✅ SEO optimized

## 🔧 Environment Variables
Create `.env` file:
```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📞 Contact
- Email: kabukyesecondaryschool@gmail.com
- Location: Buwaiswa, Kamuli, Uganda
