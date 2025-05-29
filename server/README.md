# NosisChallenge API Backend

A modern, high-performance book discovery API built with **Hono** and **Cloudflare Workers**. This backend aggregates book data from multiple sources including the New York Times Bestsellers API and Google Books API to provide rich book information and recommendations.

## 🚀 Features

- **📚 Top Books Aggregation**: Weekly, monthly, and random book recommendations
- **🔍 Book Details**: Comprehensive book information with cover images and descriptions
- **📑 Category-based Discovery**: Browse books by genre and category
- **⚡ Lightning Fast**: Powered by Cloudflare Workers for global edge performance
- **🌐 CORS Enabled**: Ready for frontend integration
- **📊 Reading Time Calculation**: Smart estimation based on page count
- **🔄 Multiple Data Sources**: NYT Bestsellers + Google Books APIs
- **💪 TypeScript**: Fully typed for better development experience

## 📋 API Routes

### 🏠 Root Endpoint

```
GET /
```

Returns API information and available endpoints.

### 🔍 Health & Status

```
GET /api/health          # Health check
GET /api/version         # API version
```

### 📚 Top Books

```
GET /top-books/week      # Current week's NYT bestsellers
GET /top-books/month     # Monthly aggregated bestsellers
GET /top-books/random    # Random book recommendations
```

### 📖 Book Details

```
GET /details/:id         # Detailed book information by Google Books ID
```

### 🏷️ Category Browse

```
GET /category/:category  # Books by category (e.g., fiction, mystery, science)
```

## 📊 Response Format

All endpoints return consistent JSON responses:

```json
{
  "success": true,
  "data": {
    "books": [
      {
        "id": "google-books-id",
        "title": "Book Title",
        "coverImage": "https://covers.googleapis.com/...",
        "authorName": "Author Name",
        "readingTime": "6h 30m",
        "rank": 1,
        "weeksOnList": 5,
        "description": "Book description...",
        "pageCount": 320,
        "categories": ["Fiction", "Thriller"],
        "publishedDate": "2024-01-01"
      }
    ],
    "totalBooks": 15,
    "source": "Data source information",
    "lastUpdated": "2025-05-29T..."
  },
  "message": "Success message"
}
```

## 🛠️ Tech Stack

- **Runtime**: [Cloudflare Workers](https://workers.cloudflare.com/)
- **Framework**: [Hono](https://hono.dev/) - Ultra-fast web framework
- **Language**: TypeScript
- **APIs**: NYT Books API, Google Books API
- **Deployment**: Wrangler CLI

## 🔧 Setup & Development

### Prerequisites

- Node.js 18+
- Cloudflare account
- NYT Books API key
- Google Books API key (optional but recommended)

### 1. Clone & Install

```bash
git clone <your-repo>
cd NosisChallenge-Server
pnpm install
```

### 2. Environment Configuration

#### For Local Development

Create a `.env` file:

```env
NYT_API_KEY=your-nyt-api-key
GOOGLE_BOOKS_API_KEY=your-google-books-api-key
```

#### For Production

Update [`wrangler.jsonc`](wrangler.jsonc):

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "nosischallenge-server",
  "main": "src/index.ts",
  "compatibility_date": "2025-05-28",
  "vars": {
    "NYT_API_KEY": "your-production-nyt-api-key",
    "GOOGLE_BOOKS_API_KEY": "your-production-google-api-key"
  }
}
```

### 3. Get API Keys

#### NYT Books API

1. Visit [NYT Developer Portal](https://developer.nytimes.com/)
2. Create an account and new app
3. Enable "Books API"
4. Copy your API key

#### Google Books API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create/select a project
3. Enable the "Books API"
4. Create credentials (API key)
5. Copy your API key

### 4. Development

```bash
# Start development server
pnpm run dev

# The API will be available at http://localhost:8787
```

## 🚀 Deployment

### Authenticate with Cloudflare

```bash
pnpm dlx wrangler login
```

### Deploy to Production

```bash
pnpm run deploy
```

Your API will be deployed to:

```
https://nosischallenge-server.your-subdomain.workers.dev
```

### Generate Types (Optional)

```bash
pnpm run cf-typegen
```

## 🌐 Custom Domain Setup

1. Add your domain to Cloudflare
2. In Cloudflare dashboard → Workers & Pages
3. Select your worker → Settings → Triggers
4. Add a custom domain

## 📁 Project Structure

```
k:\NosisChallenge-Server\
├── src/
│   ├── index.ts              # Main application entry
│   ├── routes/
│   │   ├── index.ts          # Route aggregator
│   │   ├── top-books.ts      # Books endpoints
│   │   ├── details.ts        # Book details endpoint
│   │   ├── category.ts       # Category browsing
│   │   └── api.ts            # Health/status endpoints
│   ├── middleware/
│   │   └── cors.ts           # CORS configuration
│   ├── utils/
│   │   ├── response.ts       # Response helpers
│   │   └── helpers.ts        # Utility functions
│   └── types/
│       ├── env.ts            # Environment types
│       └── api.ts            # API response types
├── wrangler.jsonc            # Cloudflare Workers config
├── package.json              # Dependencies & scripts
└── README.md                 # This file
```

## 🎯 Example Usage

### Fetch Weekly Bestsellers

```javascript
const response = await fetch("https://your-api.workers.dev/top-books/week");
const data = await response.json();
console.log(data.data.books);
```

### Get Book Details

```javascript
const bookId = "google-books-id";
const response = await fetch(`https://your-api.workers.dev/details/${bookId}`);
const bookDetails = await response.json();
```

### Browse by Category

```javascript
const response = await fetch("https://your-api.workers.dev/category/fiction");
const fictionBooks = await response.json();
```

## ⚡ Performance

- **Global Edge**: Deployed on Cloudflare's global network
- **Cold Start**: ~10ms typical cold start time
- **Response Time**: Sub-100ms responses globally
- **Caching**: Automatic edge caching for static responses

## 🔒 Security

- **CORS Protection**: Configurable origin restrictions
- **Rate Limiting**: Cloudflare's built-in DDoS protection
- **API Key Management**: Secure environment variable handling
- **Input Validation**: Type-safe request handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally with `pnpm run dev`
5. Submit a pull request

## 📝 License

MIT License - feel free to use this project for your own applications.

## 🆘 Troubleshooting

### Common Issues

**API Key Errors**

- Ensure your NYT API key is valid and has Books API access
- Check environment variables are properly set

**CORS Issues**

- Update [`cors.ts`](src/middleware/cors.ts) with your frontend domain
- Verify preflight requests are handled

**Deployment Failures**

- Run `wrangler login` to authenticate
- Check your `wrangler.jsonc` configuration

### Getting Help

- Check the [Hono documentation](https://hono.dev/)
- Review [Cloudflare Workers docs](https://developers.cloudflare.com/workers/)
- Open an issue in this repository

## 🔗 Links

- **Live API**: `https://your-api.workers.dev`
- **NYT Books API**: [Documentation](https://developer.nytimes.com/docs/books-product/1/overview)
- **Google Books API**: [Documentation](https://developers.google.com/books)
- **Cloudflare Workers**: [Platform](https://workers.cloudflare.com/)

---

**Built with ❤️ by kunalshah017**
