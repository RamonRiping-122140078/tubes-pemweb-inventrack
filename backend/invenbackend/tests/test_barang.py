# test_barang.py
import pytest
import jwt
import datetime
import os

# Fixture untuk membuat token admin palsu
@pytest.fixture
def dummy_admin_token():
    payload = {
        "sub": "admin_user_id",
        "role": "admin",
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }
    secret = os.environ.get("JWT_SECRET", "changeme")
    token = jwt.encode(payload, secret, algorithm="HS256")
    return token if isinstance(token, str) else token.decode()

# Fixture untuk header Authorization
@pytest.fixture
def dummy_admin_headers(dummy_admin_token):
    return {
        'Authorization': f'Bearer {dummy_admin_token}'
    }

# Helper untuk membuat supplier terlebih dahulu (karena barang butuh id_supplier)
@pytest.fixture
def dummy_supplier_id(testapp, dummy_admin_headers):
    res = testapp.post_json('/api/supplier', {
        'nama_supplier': 'PT Sumber Sukses',
        'kontak': '081212121212',
        'alamat': 'Jl. Kemakmuran No.1'
    }, headers=dummy_admin_headers)
    return res.json['supplier']['id_supplier']

# Test create barang
def test_create_barang(testapp, dummy_admin_headers, dummy_supplier_id):
    res = testapp.post_json('/api/barang', {
        'nama_barang': 'Laptop Acer',
        'stok': 10,
        'id_supplier': dummy_supplier_id
    }, headers=dummy_admin_headers)

    assert res.status_code == 200
    assert res.json['success'] is True
    assert res.json['barang']['nama_barang'] == 'Laptop Acer'

# Test get all barang
def test_get_all_barang(testapp, dummy_admin_headers, dummy_supplier_id):
    post = testapp.post_json('/api/barang', {
        'nama_barang': 'Mouse Logitech',
        'stok': 5,
        'id_supplier': dummy_supplier_id
    }, headers=dummy_admin_headers)
    id_barang = post.json['barang']['id_barang']

    res = testapp.get('/api/barang', headers=dummy_admin_headers)
    assert res.status_code == 200
    assert any(b['id_barang'] == id_barang for b in res.json['barangs'])  # ✅ perhatikan plural

# Test get barang by ID
def test_get_barang_by_id(testapp, dummy_admin_headers, dummy_supplier_id):
    post = testapp.post_json('/api/barang', {
        'nama_barang': 'Keyboard',
        'stok': 8,
        'id_supplier': dummy_supplier_id
    }, headers=dummy_admin_headers)
    id_barang = post.json['barang']['id_barang']

    res = testapp.get(f'/api/barang/{id_barang}', headers=dummy_admin_headers)
    assert res.status_code == 200
    assert res.json['barang']['id_barang'] == id_barang

# Test update barang
def test_update_barang(testapp, dummy_admin_headers, dummy_supplier_id):
    post = testapp.post_json('/api/barang', {
        'nama_barang': 'Monitor',
        'stok': 3,
        'id_supplier': dummy_supplier_id
    }, headers=dummy_admin_headers)
    id_barang = post.json['barang']['id_barang']

    res = testapp.put_json(f'/api/barang/{id_barang}', {
        'nama_barang': 'Monitor IPS',
        'stok': 6
    }, headers=dummy_admin_headers)

    assert res.status_code == 200
    assert res.json['barang']['nama_barang'] == 'Monitor IPS'
    assert res.json['barang']['stok'] == 6

# Test delete barang
def test_delete_barang(testapp, dummy_admin_headers, dummy_supplier_id):
    post = testapp.post_json('/api/barang', {
        'nama_barang': 'Printer',
        'stok': 2,
        'id_supplier': dummy_supplier_id
    }, headers=dummy_admin_headers)
    id_barang = post.json['barang']['id_barang']

    res = testapp.delete(f'/api/barang/{id_barang}', headers=dummy_admin_headers)
    assert res.status_code == 200
    assert res.json['success'] is True
