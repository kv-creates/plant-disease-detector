# Security

Do not open public issues for suspected vulnerabilities.
Email the maintainer via the GitHub profile with steps to reproduce.

- Never commit `.env` or API keys; keys stay server-side only.
- Uploads are verified with Pillow, capped at 10MB, and rate-limited.
- This is decision support, not a certified diagnostic device.
