import pandas as pd

def load_data(file):
    try:
        df = pd.read_csv(file)
        # Optional: Data validation can go here
        return df.to_dict(orient='records')
    except Exception as e:
        print(f"Error loading data: {e}")
        return None
