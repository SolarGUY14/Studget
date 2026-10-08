"""FastAPI application entry point."""

from fastapi import FastAPI

app = FastAPI(title="Studget API")


@app.get("/health")
def health() -> dict[str, str]:
    """Report whether the API service is healthy."""
    return {"status": "healthy"}
