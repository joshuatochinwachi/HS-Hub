"""
Test script for the HollowScan lead capture Apps Script endpoint.

Loads NEXT_PUBLIC_LEAD_CAPTURE_URL and NEXT_PUBLIC_LEAD_CAPTURE_SECRET
from a .env file in the same directory (or pass a path with --env-file).

Usage:
    pip install requests python-dotenv
    python test_lead_capture.py
    python test_lead_capture.py --env-file .env.local
"""

import argparse
import json
import os
import sys

import requests
from dotenv import load_dotenv

parser = argparse.ArgumentParser()
parser.add_argument("--env-file", default=".env", help="Path to the env file (default: .env)")
args = parser.parse_args()

if not os.path.exists(args.env_file):
    print(f"❌ Env file not found: {args.env_file}")
    print("   Pass the right path with --env-file, e.g. --env-file .env.local")
    sys.exit(1)

load_dotenv(args.env_file)

APPS_SCRIPT_URL = os.getenv("NEXT_PUBLIC_LEAD_CAPTURE_URL")
SECRET = os.getenv("NEXT_PUBLIC_LEAD_CAPTURE_SECRET")

if not APPS_SCRIPT_URL or not SECRET:
    print("❌ Missing NEXT_PUBLIC_LEAD_CAPTURE_URL or NEXT_PUBLIC_LEAD_CAPTURE_SECRET")
    print(f"   Checked file: {args.env_file}")
    sys.exit(1)

payload = {
    "name": "Test User",
    "email": "test@example.com",
    "phone": "",
    "secret": SECRET,
    "sourcePage": "/test",
}

response = requests.post(
    APPS_SCRIPT_URL,
    headers={"Content-Type": "application/json"},
    data=json.dumps(payload),
)

print(f"Status code: {response.status_code}")
print(f"Response body: {response.text}")

if response.status_code == 200 and "success" in response.text:
    print("\n✅ Success. Check your Google Sheet for the new row.")
elif "unauthorized" in response.text:
    print("\n❌ Unauthorized. Your SECRET doesn't match what's in the Apps Script code.")
else:
    print("\n⚠️ Unexpected response. Check the URL and that the deployment is live.")