import chromadb
from chromadb.config import Settings as ChromaSettings
from sentence_transformers import SentenceTransformer
from typing import List, Dict, Any
import os
from app.config import get_settings

settings = get_settings()

_model = None
_client = None


def get_embedding_model():
    global _model
    if _model is None:
        _model = SentenceTransformer("all-MiniLM-L6-v2")
    return _model


def get_chroma_client():
    global _client
    if _client is None:
        os.makedirs(settings.chroma_persist_dir, exist_ok=True)
        _client = chromadb.PersistentClient(
            path=settings.chroma_persist_dir,
            settings=ChromaSettings(anonymized_telemetry=False),
        )
    return _client


def get_or_create_collection(name: str = "knowledge_base"):
    client = get_chroma_client()
    try:
        return client.get_collection(name=name)
    except Exception:
        return client.create_collection(name=name)


def get_embeddings(texts: List[str]) -> List[List[float]]:
    model = get_embedding_model()
    embeddings = model.encode(texts, show_progress_bar=False)
    return embeddings.tolist()


def ingest_document(text: str, metadata: Dict[str, Any], doc_id: str = None):
    collection = get_or_create_collection()
    if doc_id is None:
        doc_id = f"doc_{hash(text)}"

    collection.upsert(documents=[text], metadatas=[metadata], ids=[doc_id])
    return doc_id


def retrieve_context(query: str, k: int = 5) -> List[Dict[str, Any]]:
    collection = get_or_create_collection()

    query_embedding = get_embeddings([query])[0]
    results = collection.query(query_embeddings=[query_embedding], n_results=k)

    context_docs = []
    if results["documents"] and results["documents"][0]:
        for i, doc in enumerate(results["documents"][0]):
            context_docs.append(
                {
                    "content": doc,
                    "metadata": results["metadatas"][0][i]
                    if results["metadatas"]
                    else {},
                    "distance": results["distances"][0][i]
                    if results["distances"]
                    else None,
                }
            )

    return context_docs


def seed_knowledge_base():
    knowledge_articles = [
        {
            "title": "Password Reset",
            "content": """Forgot your password? No worries.

Use the "Forgot Password" link on the login page, enter your email, and check your inbox for a reset link. The link expires after 1 hour.

Make your new password strong—at least 8 characters with a mix of letters and numbers.

If you don't get the email within 5 minutes, check your spam folder.""",
            "category": "account",
        },
        {
            "title": "Creating a Ticket",
            "content": """Need help? Create a support ticket.

Go to the Tickets section in your dashboard and click "New Ticket." Pick a category (Technical, Billing, Account, or General), set the priority, and describe your issue in detail.

Our team typically responds within 24 hours.""",
            "category": "general",
        },
        {
            "title": "Billing Info",
            "content": """We bill monthly on the same day, or annually with a 20% discount.

We accept credit cards, PayPal, and bank transfers for Enterprise plans.

To change your payment method, go to Settings > Billing > Update Payment Method.

Invoices are sent on the 1st of each month.""",
            "category": "billing",
        },
        {
            "title": "Can't Log In?",
            "content": """Login problems happen. Here's what usually works:

Clear your browser cache and cookies, then try again. Make sure Caps Lock is off. Try a different browser. Disable any extensions temporarily.

Error meanings: "Invalid credentials" means wrong email/password. "Account locked" means too many failed attempts—wait 15 minutes. "Session expired" means log out and back in.

Contact support if none of this works.""",
            "category": "technical",
        },
        {
            "title": "Upgrading Your Plan",
            "content": """Ready to upgrade? Here's how:

Settings > Subscription > Change Plan. Pick your new plan and confirm.

You'll be charged the prorated difference right away, and new features activate instantly. Your billing date won't change.

Downgrades take effect at the end of your current billing cycle.""",
            "category": "billing",
        },
        {
            "title": "Two-Factor Authentication",
            "content": """Set up 2FA for extra security:

Settings > Security > Enable 2FA. Download Google Authenticator or Authy, scan the QR code, enter the 6-digit code to verify, and save your backup codes somewhere safe.

2FA is required for Enterprise accounts. If you lose your phone, use those backup codes to get back in.""",
            "category": "account",
        },
        {
            "title": "API Rate Limits",
            "content": """API rate limits by tier:

Free: 100 requests/hour
Pro: 1,000 requests/hour
Enterprise: Unlimited

Tips: Use exponential backoff on errors, cache frequently-requested data, and batch requests when you can.

Error codes: 429 = rate limit, 401 = bad API key, 403 = insufficient permissions.

Need higher limits? Contact support.""",
            "category": "technical",
        },
        {
            "title": "Exporting Your Data",
            "content": """Want your data? Here's the process:

Settings > Data Management > Export Data. Choose what to export (all data, tickets only, or account data), pick JSON or CSV format, then click Generate Export.

Processing takes 5-15 minutes. We'll email you a download link—links expire after 48 hours.""",
            "category": "account",
        },
        {
            "title": "Team Management",
            "content": """Managing your team is easy.

Settings > Team > Invite Member. Enter their email and assign a role: Admin (full access), Member (create/view tickets), or Viewer (view only).

You can assign tickets, set notifications, and transfer ownership from the team page.

To remove someone: Settings > Team > select member > Remove.""",
            "category": "general",
        },
        {
            "title": "Refund Policy",
            "content": """Our refund policy:

First 30 days: full refund, no questions asked.
After 30 days (annual plans): refund within 14 days, or prorated minus 20% fee after that.

To request a refund: Settings > Billing > Request Refund. Select a reason and submit.

Refunds take 5-7 business days to hit your original payment method.""",
            "category": "billing",
        },
    ]

    collection = get_or_create_collection()
    existing = collection.get()

    if len(existing["ids"]) == 0:
        for i, article in enumerate(knowledge_articles):
            ingest_document(
                text=article["content"],
                metadata={"title": article["title"], "category": article["category"]},
                doc_id=f"kb_{i}",
            )
        print(f"Seeded {len(knowledge_articles)} knowledge base articles")
    else:
        print(f"Knowledge base already contains {len(existing['ids'])} documents")
