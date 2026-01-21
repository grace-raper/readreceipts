# 📚 Read Receipts

**Transform your reading list into a beautiful, shareable receipt.**

[![Live Demo](https://img.shields.io/badge/demo-readreceipts.xyz-orange)](https://readreceipts.xyz)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Read Receipts is a free web app that turns your Goodreads or StoryGraph reading data into stunning receipt-style visualizations. Perfect for sharing your year in books, tracking reading goals, or just celebrating your literary journey.

🔗 **[Try it live at readreceipts.xyz](https://readreceipts.xyz)**

---

## ✨ Features

### 📥 Multiple Import Methods
- **Goodreads CSV Import** - Export your library and upload
- **StoryGraph CSV Import** - Import from StoryGraph exports
- **Manual Entry** - Add books one by one with a simple form

### 🎨 Beautiful Receipt Templates
- **Standard Receipt** - Classic receipt format with all your books
- **Year in Review** - Highlight your reading year with stats and insights
- **Monthly Receipt** - Focus on a specific month's reading
- **Seasonal Receipt** - Capture your reading by season
- **Currently Reading** - Showcase books you're actively reading
- **TBR (To Be Read)** - Display your reading wishlist

### 📊 Rich Statistics
- Total books read, pages consumed, estimated reading hours
- Average ratings and reading pace
- Monthly reading patterns and streaks
- Reading goal progress tracking
- Longest/shortest books, five-star favorites

### 🎯 Customization Options
- Filter by date range (year, month, season, custom)
- Show/hide specific stats sections
- Adjust pages-per-hour reading speed
- Customize receipt date and customer name
- Control number of books displayed

### 🔒 Privacy-First Design
- **No account required** - Use instantly without signing up
- **Local storage only** - Data stored on your device in browser
- **Respects Do Not Track** - Analytics disabled if DNT is enabled
- **Cookie consent** - Full control over analytics cookies

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/grace-raper/readreceipts.git
   cd readreceipts
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your PostHog API key (optional, for analytics):
   ```
   VITE_POSTHOG_API_KEY=your_posthog_api_key_here
   VITE_POSTHOG_HOST=https://app.posthog.com
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
npm run preview
```

---

## 🛠️ Tech Stack

- **Frontend Framework:** React 19
- **Build Tool:** Vite 6
- **Styling:** Custom CSS with responsive design
- **CSV Parsing:** PapaParse
- **Icons:** Lucide React
- **Image Export:** html2canvas
- **Analytics:** PostHog (optional)
- **Deployment:** AWS S3 + CloudFront via GitHub Actions

---

## 📖 How to Use

### Importing from Goodreads
1. Go to [Goodreads Import/Export](https://www.goodreads.com/review/import)
2. Click "Export Library" and download your CSV
3. Upload the CSV to Read Receipts
4. Customize and download your receipt!

### Importing from StoryGraph
1. Visit [StoryGraph Export](https://app.thestorygraph.com/user-export)
2. Click "Export your library" → "Generate your Export"
3. Upload the CSV to Read Receipts
4. Create your receipt!

### Manual Entry
1. Click "Manual Import" on the welcome page
2. Fill in book details (title and author required)
3. Add multiple books as needed
4. Generate your receipt!

---

## 🤝 Contributing

Contributions are welcome! Whether it's bug fixes, new features, or documentation improvements, feel free to open an issue or submit a pull request.

### Development Guidelines
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Use functional React components with hooks
- Follow existing CSS naming conventions (`.rrg-*` prefix)
- Keep components modular and reusable
- Add comments for complex logic
- Test on mobile and desktop viewports

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 💖 Support

If you enjoy Read Receipts and want to support its development:

- ⭐ **Star this repository** on GitHub
- 📣 **Share it** with fellow book lovers
- ☕ **[Buy me a coffee](https://buymeacoffee.com/hk46zntm5pq)** to fuel development
- 📚 **Follow me** on [Goodreads](https://www.goodreads.com/graceraper) or [StoryGraph](https://app.thestorygraph.com/profile/graceraper)

---

## 📧 Contact

- **Email:** readreceipts@graceraper.com
- **GitHub:** [@grace-raper](https://github.com/grace-raper)
- **Website:** [https://graceraper.com](https://graceraper.com)

---

## 🙏 Acknowledgments

- Built with ❤️ by [Grace Raper](https://github.com/grace-raper)

---

**Happy Reading! 📖✨**
