# Governance Code Generator

An autonomous governance engine that transforms compliance requirements into executable policy-as-code. Generate OPA Rego, Terraform, HashiCorp Sentinel, and governance frameworks automatically through an intuitive chat interface.

## 🚀 What This Project Does

The Governance Code Generator is a full-stack web application that helps organizations create comprehensive governance policies and compliance frameworks. It provides:

- **Policy-as-Code Generation**: Automatically generates OPA Rego policies, Terraform configurations, and HashiCorp Sentinel rules
- **Interactive Chat Interface**: Natural language input for policy requirements
- **Multi-Platform Support**: Generate policies for GCP, AWS, Azure, and other cloud platforms
- **Compliance Frameworks**: Create governance traces with principles, policies, and controls
- **Real-time Processing**: Live status updates and progress tracking during policy generation
- **Chat History**: Persistent conversation history with localStorage
- **Code Export**: View and export generated policies in YAML format

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS 3
- **Backend**: Express.js + Node.js
- **UI Components**: Radix UI + Lucide React icons
- **Routing**: React Router 6 (SPA mode)
- **State Management**: React Query + React Hooks
- **Deployment**: Netlify Functions + Serverless
- **AI Integration**: Langflow API for policy generation

## 📋 Prerequisites

- **Node.js** 18+ 
- **PNPM** (preferred package manager)
- **Langflow API** access (for policy generation)
- **Git** for version control

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd "Governance 2 code"
pnpm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```bash
# Required: Langflow API configuration
LANGFLOW_API_KEY=your_langflow_api_key_here

# Optional: Custom ping message
PING_MESSAGE=Governance Engine Ready
```

### 3. Development Server

Start the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:5173`

### 4. Production Build

Build for production:

```bash
pnpm build
pnpm start
```

## 🌐 Deployment

### Netlify Deployment

The project is configured for Netlify deployment:

1. **Build Command**: `npm run build:client`
2. **Publish Directory**: `dist/spa`
3. **Functions Directory**: `netlify/functions`

Deploy by connecting your repository to Netlify or using the Netlify CLI:

```bash
netlify deploy --prod
```

### Environment Variables for Production

Set these in your Netlify dashboard:

- `LANGFLOW_API_KEY`: Your Langflow API key
- `PING_MESSAGE`: Custom status message (optional)

## 💡 Usage Examples

### Suggested Policy Types

The application includes pre-built suggestions for common governance scenarios:

- **GCP Data Protection**: "Generate a GCP data-at-rest and in-transit policy"
- **AWS S3 Security**: "Create OPA Rego and Sentinel rules for S3 encryption"
- **TLS Enforcement**: "Enforce TLS 1.2+ on all ingress endpoints"
- **Key Management**: "Require customer-managed keys (CMEK) on storage"
- **Access Control**: "Block public access for model endpoints"

### Custom Policy Generation

You can ask for any governance policy in natural language:

```
"Create a policy that requires multi-factor authentication for all admin users accessing production databases"
```

```
"Generate compliance rules for GDPR data processing with audit logging requirements"
```

## 🏗️ Project Structure

```
├── client/                   # React SPA frontend
│   ├── components/          # UI components
│   │   ├── layouts/         # Layout components
│   │   ├── tech/           # Technical components
│   │   └── ui/             # Reusable UI components
│   ├── pages/              # Route components
│   ├── hooks/              # Custom React hooks
│   └── lib/                # Utility functions
├── server/                 # Express API backend
│   ├── index.ts           # Main server setup
│   └── routes/            # API handlers
├── shared/                # Shared types and interfaces
├── netlify/               # Netlify Functions deployment
└── public/               # Static assets
```

## 🔧 API Endpoints

- `GET /api/ping` - Health check endpoint
- `POST /api/generate` - Generate governance policies (requires Langflow API)

## 🎨 Features

### Interactive Chat Interface
- Real-time policy generation
- Suggested questions for quick start
- Chat history persistence
- Full-screen mode for focused work

### Policy Output
- **Explanation Tab**: Human-readable policy descriptions
- **YAML Tab**: Structured policy-as-code output
- Syntax highlighting for code blocks
- Copy-to-clipboard functionality

### Visual Design
- Cyberpunk-inspired UI with neon accents
- Animated background effects
- Responsive design for all screen sizes
- Dark theme optimized for developer workflows

## 🔒 Security Considerations

- API keys are stored server-side only
- No sensitive data persisted in browser storage
- CORS configured for secure cross-origin requests
- Input validation and sanitization

## 🧪 Testing

Run the test suite:

```bash
pnpm test
```

Type checking:

```bash
pnpm typecheck
```

## 📝 Development Guidelines

- Use **PNPM** as the package manager
- Follow TypeScript best practices
- Use TailwindCSS for styling
- Implement responsive design patterns
- Add proper error handling and loading states

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

**Langflow API Connection Error**
- Verify your `LANGFLOW_API_KEY` is correctly set
- Check that Langflow service is running on `localhost:7860`
- Ensure the API endpoint URL is correct

**Build Failures**
- Clear node_modules and reinstall: `rm -rf node_modules && pnpm install`
- Check Node.js version compatibility
- Verify all environment variables are set

**Deployment Issues**
- Ensure Netlify Functions are properly configured
- Check build command and publish directory settings
- Verify environment variables in Netlify dashboard

## 🔮 Future Enhancements

- Multi-language policy generation
- Integration with more policy engines
- Policy validation and testing
- Collaborative policy editing
- Compliance reporting dashboard
- API rate limiting and usage analytics

---

**Built with ❤️ for the governance and compliance community**
