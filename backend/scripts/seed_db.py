import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from app.database import SessionLocal
from app.seed import seed_demo_data


def main():
    db = SessionLocal()
    try:
        seed_demo_data(db)
        print("Database seeded")
    finally:
        db.close()


if __name__ == "__main__":
    main()
