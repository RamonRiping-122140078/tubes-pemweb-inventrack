import pytest
from invenbackend.models import Barang, Supplier, User

def test_my_view_success(testapp, dbsession):
    # Tambah Supplier
    supplier = Supplier(nama_supplier='Test Supplier', kontak='08123456789')
    dbsession.add(supplier)
    dbsession.flush()
    # Tambah Barang
    barang = Barang(
        nama_barang='Test Barang',
        kategori='Elektronik',
        stok=10,
        harga=100000,
        id_supplier=supplier.id_supplier
    )
    dbsession.add(barang)
    # Tambah User
    import bcrypt
    hashed_pw = bcrypt.hashpw("secret".encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    user = User(username='Test User', password_hash=hashed_pw, role='admin')
    dbsession.add(user)

    dbsession.flush()

    res = testapp.get("/", status=200)

    # Cek konten barang, supplier, user muncul di HTML
    assert b'Test Barang' in res.body
    assert b'Test Supplier' in res.body
    assert b'Test User' in res.body


def test_my_view_empty(testapp):
    res = testapp.get("/", status=200)
    # Pastikan muncul fallback message untuk kosong
    assert b'Tidak ada data barang.' in res.body or b'Tidak ada data supplier.' in res.body or b'Tidak ada data user.' in res.body
