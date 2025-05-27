import pytest
from pyramid.testing import DummyRequest
from invenbackend.views import default, notfound
from invenbackend.models import Barang, Supplier, User

class TestDefaultView:

    def test_my_view_returns_items(self, dbsession):
        # Arrange: tambah sample data semua tabel
        barang = Barang(
            nama_barang="Barang View Test",
            kategori="Elektronik",
            stok=5,
            harga=25000
        )
        supplier = Supplier(
            nama_supplier="Supplier View Test",
            kontak="081234567890"
        )
        import bcrypt
        hashed_pw = bcrypt.hashpw("secret".encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
        user = User(
            username="User View Test",
            password_hash=hashed_pw,
            role="admin"
        )

        dbsession.add_all([barang, supplier, user])
        dbsession.flush()

        request = DummyRequest(dbsession=dbsession)
        response = default.my_view(request)

        # Act + Assert: sekarang response dict harus punya list semua tabel
        assert isinstance(response, dict)
        assert "barang_list" in response
        assert "supplier_list" in response
        assert "user_list" in response

        # Cek isi list
        assert any(b.nama_barang == "Barang View Test" for b in response["barang_list"])
        assert any(s.nama_supplier == "Supplier View Test" for s in response["supplier_list"])
        assert any(u.username == "User View Test" for u in response["user_list"])


def test_notfound_view_returns_404():
    request = DummyRequest()
    response = notfound.notfound_view(request)

    assert isinstance(response, dict)
    assert response.get("message") == "Halaman tidak ditemukan."
