backend-test:
	cd backend && python -m pytest -q

build-frontend:
	cd frontend && npm run build
