-- Insert venue features for all venues
-- Features: Air Conditioning, Wi-Fi, Parking, Catering Kitchen, Sound System, Projector/Screen, Stage/Platform, Dance Floor, Bar Area, Outdoor Space, Security System, Wheelchair Accessible, Valet Parking, Garden/Terrace

-- Wedding Halls (all features)
INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT '4924803c-360c-490b-b847-1cb5afdeef3f'::uuid as id) v
CROSS JOIN (VALUES ('Air Conditioning'), ('Wi-Fi'), ('Parking'), ('Catering Kitchen'), ('Sound System'), ('Dance Floor'), ('Stage/Platform'), ('Valet Parking')) AS f(feature);

INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT '07dacbb5-6faa-4e18-87b0-7f61907a7dc6'::uuid as id) v
CROSS JOIN (VALUES ('Air Conditioning'), ('Wi-Fi'), ('Parking'), ('Sound System'), ('Dance Floor'), ('Bar Area'), ('Security System')) AS f(feature);

INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT 'bac11483-5a40-4aad-a46f-8b9572f35823'::uuid as id) v
CROSS JOIN (VALUES ('Air Conditioning'), ('Wi-Fi'), ('Parking'), ('Catering Kitchen'), ('Sound System'), ('Stage/Platform'), ('Projector/Screen'), ('Wheelchair Accessible')) AS f(feature);

INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT '197eee31-4550-424c-a9f9-c85b6c2962d0'::uuid as id) v
CROSS JOIN (VALUES ('Wi-Fi'), ('Parking'), ('Catering Kitchen'), ('Sound System'), ('Garden/Terrace'), ('Outdoor Space')) AS f(feature);

INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT '58842709-2814-421a-8035-7879b4dd3c7e'::uuid as id) v
CROSS JOIN (VALUES ('Air Conditioning'), ('Wi-Fi'), ('Parking'), ('Outdoor Space'), ('Garden/Terrace'), ('Dance Floor'), ('Sound System')) AS f(feature);

INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT 'baf8e7a8-fbe4-4c98-9da7-d1f355fc97ad'::uuid as id) v
CROSS JOIN (VALUES ('Air Conditioning'), ('Wi-Fi'), ('Parking'), ('Catering Kitchen'), ('Sound System'), ('Stage/Platform'), ('Dance Floor'), ('Valet Parking')) AS f(feature);

INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT 'ad44c327-d283-4ee4-a7b2-69a14f57ee3c'::uuid as id) v
CROSS JOIN (VALUES ('Wi-Fi'), ('Parking'), ('Catering Kitchen'), ('Sound System'), ('Outdoor Space'), ('Garden/Terrace')) AS f(feature);

INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT 'e3569280-b70d-4707-a46a-32312beb97d4'::uuid as id) v
CROSS JOIN (VALUES ('Air Conditioning'), ('Wi-Fi'), ('Parking'), ('Catering Kitchen'), ('Sound System'), ('Dance Floor'), ('Stage/Platform'), ('Garden/Terrace'), ('Valet Parking')) AS f(feature);

INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT '714ca6bc-c970-4431-a57b-aa92c1a4f586'::uuid as id) v
CROSS JOIN (VALUES ('Air Conditioning'), ('Wi-Fi'), ('Parking'), ('Catering Kitchen'), ('Sound System'), ('Outdoor Space'), ('Garden/Terrace'), ('Security System'), ('Valet Parking')) AS f(feature);

INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT '52fd7624-064c-43d9-8b1d-e57915d893e7'::uuid as id) v
CROSS JOIN (VALUES ('Parking'), ('Outdoor Space'), ('Sound System'), ('Garden/Terrace'), ('Security System')) AS f(feature);

-- Conference Rooms
INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT 'aa400f35-beee-48ff-983b-38cf6c6f38d4'::uuid as id) v
CROSS JOIN (VALUES ('Air Conditioning'), ('Wi-Fi'), ('Parking'), ('Projector/Screen'), ('Sound System'), ('Wheelchair Accessible')) AS f(feature);

INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT 'e312b8d4-ac71-4eba-a93f-91294a1199d8'::uuid as id) v
CROSS JOIN (VALUES ('Air Conditioning'), ('Wi-Fi'), ('Parking'), ('Projector/Screen'), ('Sound System'), ('Security System')) AS f(feature);

INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT '517ca9c7-00ad-498a-8620-508b4c694995'::uuid as id) v
CROSS JOIN (VALUES ('Air Conditioning'), ('Wi-Fi'), ('Parking'), ('Projector/Screen'), ('Sound System'), ('Stage/Platform'), ('Wheelchair Accessible'), ('Valet Parking')) AS f(feature);

INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT '394be73d-dfa7-4b91-afc0-3614cc34c53e'::uuid as id) v
CROSS JOIN (VALUES ('Air Conditioning'), ('Wi-Fi'), ('Parking'), ('Projector/Screen'), ('Sound System'), ('Wheelchair Accessible')) AS f(feature);

INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT 'ecee8887-0f06-47ba-bdef-ff58a473f45e'::uuid as id) v
CROSS JOIN (VALUES ('Air Conditioning'), ('Wi-Fi'), ('Projector/Screen'), ('Sound System'), ('Garden/Terrace')) AS f(feature);

INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT 'c521d56e-b6aa-4200-9507-53177d8850a2'::uuid as id) v
CROSS JOIN (VALUES ('Air Conditioning'), ('Wi-Fi'), ('Parking'), ('Projector/Screen'), ('Sound System')) AS f(feature);

INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT '74601b44-a3c2-40a5-9ee5-62702cf76d21'::uuid as id) v
CROSS JOIN (VALUES ('Air Conditioning'), ('Wi-Fi'), ('Projector/Screen'), ('Sound System'), ('Security System')) AS f(feature);

INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT 'e64d6a53-15ea-4597-85c3-1f04b2e11339'::uuid as id) v
CROSS JOIN (VALUES ('Air Conditioning'), ('Wi-Fi'), ('Parking'), ('Projector/Screen'), ('Sound System'), ('Outdoor Space'), ('Garden/Terrace')) AS f(feature);

-- Restaurant & Café
INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT 'c525bdfb-b061-46d2-a163-7499a01bdbb2'::uuid as id) v
CROSS JOIN (VALUES ('Air Conditioning'), ('Wi-Fi'), ('Catering Kitchen'), ('Sound System'), ('Garden/Terrace'), ('Outdoor Space')) AS f(feature);

INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT '323a0627-4dd1-4494-9bbc-af78c70db56a'::uuid as id) v
CROSS JOIN (VALUES ('Air Conditioning'), ('Wi-Fi'), ('Garden/Terrace'), ('Outdoor Space')) AS f(feature);

INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT 'd5932741-c885-4cc2-a886-7e04a9c28311'::uuid as id) v
CROSS JOIN (VALUES ('Air Conditioning'), ('Wi-Fi'), ('Parking'), ('Catering Kitchen'), ('Bar Area'), ('Sound System')) AS f(feature);

INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT '31f2d7bd-f11d-49b5-9fb5-88238f37c196'::uuid as id) v
CROSS JOIN (VALUES ('Wi-Fi'), ('Parking'), ('Catering Kitchen'), ('Outdoor Space'), ('Garden/Terrace')) AS f(feature);

INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT '35a6a693-7968-498c-a58a-103d4df1f0c7'::uuid as id) v
CROSS JOIN (VALUES ('Air Conditioning'), ('Wi-Fi'), ('Parking'), ('Catering Kitchen'), ('Sound System'), ('Garden/Terrace'), ('Valet Parking')) AS f(feature);

INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT 'f4f6e471-1713-406b-aba5-3b2bb13f129a'::uuid as id) v
CROSS JOIN (VALUES ('Air Conditioning'), ('Wi-Fi'), ('Catering Kitchen')) AS f(feature);

INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT '93f4f101-9377-4b60-a9ab-61e0aced6348'::uuid as id) v
CROSS JOIN (VALUES ('Wi-Fi'), ('Parking'), ('Catering Kitchen'), ('Outdoor Space'), ('Garden/Terrace')) AS f(feature);

INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT '79e00a7f-1958-4d60-ac76-da6e2e6bc7a0'::uuid as id) v
CROSS JOIN (VALUES ('Parking'), ('Catering Kitchen'), ('Outdoor Space'), ('Garden/Terrace')) AS f(feature);

-- Outdoor Garden
INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT '11bb907c-d75d-4ce1-9cfc-e88a839d5f12'::uuid as id) v
CROSS JOIN (VALUES ('Parking'), ('Outdoor Space'), ('Garden/Terrace'), ('Sound System'), ('Wheelchair Accessible')) AS f(feature);

INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT 'b73981ec-b219-41c0-9688-d63fc2f6b53d'::uuid as id) v
CROSS JOIN (VALUES ('Parking'), ('Outdoor Space'), ('Garden/Terrace'), ('Catering Kitchen')) AS f(feature);

INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT '8048af93-8cc6-4d8a-981e-7bb818d3758f'::uuid as id) v
CROSS JOIN (VALUES ('Parking'), ('Outdoor Space'), ('Garden/Terrace'), ('Catering Kitchen'), ('Sound System')) AS f(feature);

INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT 'c133478c-b7f8-4252-b5b7-3f012293e93a'::uuid as id) v
CROSS JOIN (VALUES ('Parking'), ('Outdoor Space'), ('Garden/Terrace'), ('Sound System')) AS f(feature);

INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT '04d8873b-4c55-4e63-aa79-c571b7a7ed9d'::uuid as id) v
CROSS JOIN (VALUES ('Parking'), ('Outdoor Space'), ('Garden/Terrace'), ('Sound System'), ('Security System')) AS f(feature);

INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT '5a2b8faa-648a-40ba-a54e-8f4c3646365f'::uuid as id) v
CROSS JOIN (VALUES ('Parking'), ('Outdoor Space'), ('Garden/Terrace'), ('Sound System'), ('Wheelchair Accessible'), ('Security System')) AS f(feature);

INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT '7fd3c722-c199-46ec-8534-c7117b975992'::uuid as id) v
CROSS JOIN (VALUES ('Parking'), ('Outdoor Space'), ('Garden/Terrace'), ('Sound System'), ('Catering Kitchen')) AS f(feature);