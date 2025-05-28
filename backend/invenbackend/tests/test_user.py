# test_user.py
import pytest
import jwt
from datetime import datetime, timedelta, timezone
import os

# Fixture token admin
@pytest.fixture
def dummy_admin_token():
    payload = {
        "sub": "admin_user_id",
        "role": "admin",
        "exp": datetime.now(timezone.utc) + timedelta(hours=1)
    }
    secret = os.environ.get("JWT_SECRET", "changeme")
    token = jwt.encode(payload, secret, algorithm="HS256")
    return token if isinstance(token, str) else token.decode()

# Fixture header Authorization
@pytest.fixture
def dummy_admin_headers(dummy_admin_token):
    return {
        'Authorization': f'Bearer {dummy_admin_token}'
    }

# Test create user
def test_create_user(testapp, dummy_admin_headers):
    res = testapp.post_json('/api/users', {
        'username': 'johndoe',
        'role': 'user',
        'password': 'secure123'
    }, headers=dummy_admin_headers)

    assert res.status_code == 200
    assert res.json['success'] is True
    assert res.json['user']['username'] == 'johndoe'

# Test get all users
def test_get_all_users(testapp, dummy_admin_headers):
    post = testapp.post_json('/api/users', {
        'username': 'janedoe',
        'role': 'user',
        'password': 'password456'
    }, headers=dummy_admin_headers)
    id_user = post.json['user']['id_user']

    res = testapp.get('/api/users', headers=dummy_admin_headers)
    assert res.status_code == 200
    assert any(u['id_user'] == id_user for u in res.json['users'])

# Test get user by ID
def test_get_user_by_id(testapp, dummy_admin_headers):
    post = testapp.post_json('/api/users', {
        'username': 'johnsmith',
        'role': 'admin',
        'password': 'pass123'
    }, headers=dummy_admin_headers)
    id_user = post.json['user']['id_user']

    res = testapp.get(f'/api/users/{id_user}', headers=dummy_admin_headers)
    assert res.status_code == 200
    assert res.json['user']['id_user'] == id_user

# Test update user
def test_update_user(testapp, dummy_admin_headers):
    post = testapp.post_json('/api/users', {
        'username': 'olduser',
        'role': 'user',
        'password': 'oldpass'
    }, headers=dummy_admin_headers)
    id_user = post.json['user']['id_user']

    res = testapp.put_json(f'/api/users/{id_user}', {
        'username': 'updateduser',    }, headers=dummy_admin_headers)

    assert res.status_code == 200
    assert res.json['user']['username'] == 'updateduser'

# Test delete user
def test_delete_user(testapp, dummy_admin_headers):
    post = testapp.post_json('/api/users', {
        'username': 'tobedeleted',
        'role': 'user',
        'password': 'deletepass'
    }, headers=dummy_admin_headers)
    id_user = post.json['user']['id_user']

    res = testapp.delete(f'/api/users/{id_user}', headers=dummy_admin_headers)
    assert res.status_code == 200
    assert res.json['success'] is True
