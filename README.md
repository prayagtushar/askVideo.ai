# AskVideo.ai

> Chat with any YouTube video. Powered by Google Gemini, LangChain, and Pinecone.

![Project Status](https://img.shields.io/badge/Status-Active_Development-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![Tech Stack](https://img.shields.io/badge/Stack-Bun_|_NestJS_|_React_|_Vite-orange)

## Overview

AskVideo.ai transforms passive video consumption into an active retrieval process. Instead of manually searching through timelines, users can query the video content directly. The system ingests YouTube transcripts, indexes them using vector embeddings, and utilizes Large Language Models to provide accurate, context-aware responses.

## Features

- **YouTube Integration**: Direct URL input for immediate video analysis.
- **Contextual Understanding**: Utilizes Google Gemini models to interpret and reason about video content.
- **High Performance**: Engineered with Bun and Vite for fast build and runtime speeds.
- **Vector Search**: Implements Pinecone for semantic search, ensuring answers are grounded in specific video segments.

## Tech Stack

- **Monorepo**: Turborepo
- **Frontend**: React, Vite, TailwindCSS
- **Backend**: NestJS (running on Bun)
- **AI Orchestration**: LangChain
- **Database**: Prisma (PostgreSQL), Pinecone (Vector DB)

## Getting Started

### Prerequisites

- Bun runtime installed.
- API Keys for Google Gemini and Pinecone.
- Local or hosted PostgreSQL instance.

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/prayagtushar/ask-video.git
    cd ask-video
    ```

2.  **Install dependencies**
    ```bash
    bun install
    ```

3.  **Environment Setup**
    Configure your environment variables in `apps/backend/.env` (and `apps/frontend` if applicable):
    ```env
    GOOGLE_API_KEY=your_key
    PINECONE_API_KEY=your_key
    DATABASE_URL=postgres://...
    ```

4.  **Run Development Server**
    ```bash
    bun run dev
    ```

## Project Structure

```text
.
├── apps
│   ├── backend   # NestJS API handling AI logic and DB connections
│   └── frontend  # React + Vite UI
├── packages
│   └── db        # Shared Prisma schema and client
└── README.md
```

## Contributing

Contributions are accessible. Please submit a Pull Request for review.

## License

This project is licensed under the MIT License.