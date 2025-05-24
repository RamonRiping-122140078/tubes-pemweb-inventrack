# scripts/seed_data.py
import os
import transaction

from sqlalchemy import engine_from_config
from sqlalchemy.orm import sessionmaker
from invenbackend.models import Base, Supplier, Barang

from pyramid.paster import get_appsettings, setup_logging

def main():
    settings = get_appsettings('development.ini')
    setup_logging('development.ini')
    engine = engine_from_config(settings, 'sqlalchemy.')
    Session = sessionmaker(bind=engine)
    session = Session()

    with transaction.manager:
        supplier = Supplier(nama_supplier='PT Sumber Makmur', kontak='08123456789', alamat='Jl. Raya No. 123')
        session.add(supplier)
        session.flush()

        barang = Barang(
            nama_barang='Laptop ASUS',
            kategori='Elektronik',
            stok=10,
            harga=7500000,
            tanggal_masuk='2025-05-24',
            id_supplier=supplier.id_supplier
        )
        session.add(barang)

if __name__ == '__main__':
    main()
