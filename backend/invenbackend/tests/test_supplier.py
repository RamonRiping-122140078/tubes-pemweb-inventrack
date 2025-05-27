# test_supplier.py
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
    secret = os.environ.get("JWT_SECRET", "changeme")  # Ganti sesuai dengan JWT secret di aplikasimu
    token = jwt.encode(payload, secret, algorithm="HS256")
    return token if isinstance(token, str) else token.decode()

# Fixture untuk menyusun headers Authorization
@pytest.fixture
def dummy_admin_headers(dummy_admin_token):
    return {
        'Authorization': f'Bearer {dummy_admin_token}'
    }

# Test create supplier
def test_create_supplier(testapp, dummy_admin_headers):
    res = testapp.post_json('/api/supplier', {
        'nama_supplier': 'PT ABC',
        'kontak': '08123456789',
        'alamat': 'Jl. Mawar 123'
    }, headers=dummy_admin_headers)

    assert res.status_code == 200
    assert res.json['success'] is True
    assert res.json['supplier']['nama_supplier'] == 'PT ABC'

# Test get all supplier
def test_get_supplier(testapp, dummy_admin_headers):
    post = testapp.post_json('/api/supplier', {
        'nama_supplier': 'PT XYZ',
        'kontak': '08234567890',
        'alamat': 'Jl. Melati 456'
    }, headers=dummy_admin_headers)
    id_supplier = post.json['supplier']['id_supplier']

    res = testapp.get('/api/supplier', headers=dummy_admin_headers)
    assert res.status_code == 200
    assert any(s['id_supplier'] == id_supplier for s in res.json['suppliers'])

# Test get supplier by ID
def test_get_supplier_by_id(testapp, dummy_admin_headers):
    post = testapp.post_json('/api/supplier', {
        'nama_supplier': 'PT DEF',
        'kontak': '08345678901',
        'alamat': 'Jl. Kenanga 789'
    }, headers=dummy_admin_headers)
    id_supplier = post.json['supplier']['id_supplier']

    res = testapp.get(f'/api/supplier/{id_supplier}', headers=dummy_admin_headers)
    assert res.status_code == 200
    assert res.json['supplier']['id_supplier'] == id_supplier

# Test update supplier
def test_update_supplier(testapp, dummy_admin_headers):
    post = testapp.post_json('/api/supplier', {
        'nama_supplier': 'PT OLD',
        'kontak': '08987654321',
        'alamat': 'Jl. Lama'
    }, headers=dummy_admin_headers)
    id_supplier = post.json['supplier']['id_supplier']

    update = testapp.put_json(f'/api/supplier/{id_supplier}', {
        'nama_supplier': 'PT NEW',
        'alamat': 'Jl. Baru'
    }, headers=dummy_admin_headers)

    assert update.status_code == 200
    assert update.json['supplier']['nama_supplier'] == 'PT NEW'
    assert update.json['supplier']['alamat'] == 'Jl. Baru'

# Test delete supplier
def test_delete_supplier(testapp, dummy_admin_headers):
    post = testapp.post_json('/api/supplier', {
        'nama_supplier': 'PT DELETE',
        'kontak': '0888888888',
        'alamat': 'Jl. Hapus'
    }, headers=dummy_admin_headers)
    id_supplier = post.json['supplier']['id_supplier']

    delete = testapp.delete(f'/api/supplier/{id_supplier}', headers=dummy_admin_headers)
    assert delete.status_code == 200
    assert delete.json['success'] is True