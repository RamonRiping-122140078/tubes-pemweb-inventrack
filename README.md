# Inventrack – Sistem Manajemen Inventaris

## Deskripsi
Aplikasi web sederhana untuk mengelola inventaris barang dan supplier menggunakan Python Pyramid (backend) dan React JS (frontend).  
Cocok untuk proyek akademik Pemrograman Web.

---
## Fitur
- CRUD Barang
- CRUD Supplier
- Login Admin (simulasi)
- Guest hanya bisa melihat data
- Tampilan responsif
- Proteksi akses berdasarkan role
---
## Dependensi
### Frontend
- react
- react-router-dom
- axios
- tailwindcss
- react-testing-library

### Backend
- pyramid
- sqlalchemy
- psycopg2
- pyramid_jwt
- pytest

### Lain - lain
- npm
- node.js
- git
---
## Referensi
- [Pyramid Official Documentation](https://docs.pylonsproject.org/projects/pyramid/en/latest/)
- [React Official Documentation](https://react.dev/learn)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
---
## Cara Menjalankan
### 1. Clone repository
```bash
git clone https://github.com/RamonRiping-122140078/tubes-pemweb-inventrack.git 
cd tubes-pemweb-inventrack
```
---
### 2. Jalankan Backend
*Prerequisite*: Python 3.10+, PostgreSQL
```bash
cd backend
python -m venv venv
source venv/bin/activate  # atau venv\Scripts\activate di Windows
pip install -r requirements.txt

# Jalankan database (pastikan sudah ada DB inventrack)
alembic upgrade head

# Jalankan server
pserve development.ini --reload
```
---
### 3. Jalankan Frontend
```bash
cd frontend
npm install
npm run dev
```
---
4. Testing
Backend:
```bash
pytest --cov
```

Frontend:
```bash
npm test
```
---

