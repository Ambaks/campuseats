from google.cloud import storage

storage_client = storage.Client.from_service_account_json(
    "/Users/naiahoard/Desktop/CampusEats_MVP/backend/campuseats-bf7cc-firebase-adminsdk-fbsvc-07e06423b7.json"
)

buckets = list(storage_client.list_buckets())
print("Buckets in project:")
for b in buckets:
    print(b.name)

bucket = storage_client.bucket("campuseats-bf7cc.firebasestorage.app")
if not bucket.exists():
    print("Bucket does not exist!")
else:
    print("Bucket exists and is accessible!")
