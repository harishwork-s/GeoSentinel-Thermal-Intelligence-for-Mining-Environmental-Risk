import os
import sys

def main():
    print("Initializing GeoSentinel Pipeline (Milestone 1)...")
    
    study_area = {
        "name": "Chennampatti Quarry Cluster",
        "bbox": {
            "south": 11.693678,
            "north": 11.700864,
            "west": 77.687078,
            "east": 77.690983
        }
    }
    print(f"Study Area: {study_area['name']}")
    print(f"Bounding Box: {study_area['bbox']}")
    
    data_dir = os.path.join(os.path.dirname(__file__), 'data')
    raw_dir = os.path.join(data_dir, 'raw')
    
    expected_files = [
        "sentinel2_t1_b4.tif",
        "sentinel2_t1_b8.tif",
        "sentinel2_t2_b4.tif",
        "sentinel2_t2_b8.tif",
        "landsat_t2_lst.tif"
    ]
    
    print("\nValidating Expected Data Files...")
    all_exist = True
    
    if not os.path.exists(raw_dir):
        print(f"Warning: {raw_dir} does not exist.")
        all_exist = False
    else:
        for file in expected_files:
            file_path = os.path.join(raw_dir, file)
            if os.path.exists(file_path):
                print(f"[OK] Found {file}")
            else:
                print(f"[MISSING] {file} (Required for Milestone 2)")
                all_exist = False
            
    print("\nUpcoming Processing Stages (Milestone 2):")
    print("- Load real Sentinel-2 and Landsat data.")
    print("- Compute NDVI for T1 and T2.")
    print("- Compute Thermal/LST values.")
    print("- Identify Risk Zones based on actual data changes.")
    
    if not all_exist:
        print("\nNote: Please provide REAL satellite datasets in backend/data/raw to proceed with full processing.")
    
if __name__ == "__main__":
    main()
