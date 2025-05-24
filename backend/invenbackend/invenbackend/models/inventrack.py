from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Date,
    Float,
    ForeignKey,
)
from sqlalchemy.orm import relationship
from .meta import Base


# Supplier model
class Supplier(Base):
    __tablename__ = 'supplier'

    id_supplier = Column(Integer, primary_key=True)
    nama_supplier = Column(String, nullable=False)
    kontak = Column(String)
    alamat = Column(Text)

    barangs = relationship("Barang", back_populates="supplier")

    def to_dict(self):
        return {
            'id_supplier': self.id_supplier,
            'nama_supplier': self.nama_supplier,
            'kontak': self.kontak,
            'alamat': self.alamat,
        }


# Barang model
class Barang(Base):
    __tablename__ = 'barang'

    id_barang = Column(Integer, primary_key=True)
    nama_barang = Column(String, nullable=False)
    kategori = Column(String)
    stok = Column(Integer)
    harga = Column(Float)
    tanggal_masuk = Column(Date)

    id_supplier = Column(Integer, ForeignKey('supplier.id_supplier'))
    supplier = relationship("Supplier", back_populates="barangs")

    def to_dict(self):
        return {
            'id_barang': self.id_barang,
            'nama_barang': self.nama_barang,
            'kategori': self.kategori,
            'stok': self.stok,
            'harga': self.harga,
            'tanggal_masuk': self.tanggal_masuk.isoformat() if self.tanggal_masuk else None,
            'id_supplier': self.id_supplier,
        }


# User model
class User(Base):
    __tablename__ = 'users'

    id_user = Column(Integer, primary_key=True)
    username = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, default="admin")

    def to_dict(self):
        return {
            'id_user': self.id_user,
            'username': self.username,
            'role': self.role,
        }
