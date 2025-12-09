-- Hotel & Resort features
INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT '0da28428-6eef-4f3b-9400-ec2643b16e00'::uuid as id) v
CROSS JOIN (VALUES ('Air Conditioning'), ('Wi-Fi'), ('Parking'), ('Catering Kitchen'), ('Sound System'), ('Stage/Platform'), ('Dance Floor'), ('Pool'), ('Gym/Fitness Center'), ('Valet Parking')) AS f(feature);

INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT '6c272543-35c7-442c-8443-feeba4c0adaf'::uuid as id) v
CROSS JOIN (VALUES ('Air Conditioning'), ('Wi-Fi'), ('Parking'), ('Catering Kitchen'), ('Sound System'), ('Pool'), ('Garden/Terrace'), ('Valet Parking')) AS f(feature);

INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT '42365ea7-8637-4822-9a3b-0b8ce9c1b383'::uuid as id) v
CROSS JOIN (VALUES ('Air Conditioning'), ('Wi-Fi'), ('Parking'), ('Catering Kitchen'), ('Sound System'), ('Pool'), ('Outdoor Space'), ('Garden/Terrace')) AS f(feature);

INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT 'f0456ecb-5007-4e53-a8b1-3271f34ca7e9'::uuid as id) v
CROSS JOIN (VALUES ('Air Conditioning'), ('Wi-Fi'), ('Parking'), ('Projector/Screen'), ('Sound System'), ('Wheelchair Accessible')) AS f(feature);

INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT '3b9b9e6f-9644-4ecb-b9cd-29c3863a725d'::uuid as id) v
CROSS JOIN (VALUES ('Air Conditioning'), ('Wi-Fi'), ('Parking'), ('Catering Kitchen'), ('Sound System'), ('Stage/Platform'), ('Dance Floor'), ('Pool'), ('Gym/Fitness Center'), ('Valet Parking'), ('Security System')) AS f(feature);

INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT 'f615bc4e-1e6e-47b6-a274-c8bca5597790'::uuid as id) v
CROSS JOIN (VALUES ('Air Conditioning'), ('Wi-Fi'), ('Parking'), ('Projector/Screen'), ('Sound System')) AS f(feature);

INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT '03e24bc9-0df1-4e08-8c96-cdd22d0ac704'::uuid as id) v
CROSS JOIN (VALUES ('Air Conditioning'), ('Wi-Fi'), ('Parking'), ('Catering Kitchen'), ('Sound System'), ('Garden/Terrace'), ('Pool')) AS f(feature);

INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT '17d1e708-245d-42fc-b520-7d6dc563fb82'::uuid as id) v
CROSS JOIN (VALUES ('Air Conditioning'), ('Wi-Fi'), ('Parking'), ('Catering Kitchen'), ('Sound System'), ('Outdoor Space'), ('Pool'), ('Garden/Terrace')) AS f(feature);

-- Private Villa features
INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT 'b8136397-2d69-48a3-9432-b273b0f61bb8'::uuid as id) v
CROSS JOIN (VALUES ('Air Conditioning'), ('Wi-Fi'), ('Parking'), ('Catering Kitchen'), ('Garden/Terrace'), ('Security System')) AS f(feature);

INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT '4dec77e6-433a-4726-8b66-4ac494bbd89c'::uuid as id) v
CROSS JOIN (VALUES ('Air Conditioning'), ('Wi-Fi'), ('Parking'), ('Pool'), ('Garden/Terrace'), ('Outdoor Space')) AS f(feature);

INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT 'd9b14a08-0c33-4a6c-883a-6e0d27d0becf'::uuid as id) v
CROSS JOIN (VALUES ('Air Conditioning'), ('Wi-Fi'), ('Parking'), ('Catering Kitchen'), ('Garden/Terrace'), ('Sound System')) AS f(feature);

INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT '9bba6fe5-2272-4f52-b622-256c4c5fa0d7'::uuid as id) v
CROSS JOIN (VALUES ('Wi-Fi'), ('Parking'), ('Garden/Terrace'), ('Outdoor Space')) AS f(feature);

INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT 'a555e90a-eb09-456a-9f54-5d4f7c0c2446'::uuid as id) v
CROSS JOIN (VALUES ('Air Conditioning'), ('Wi-Fi'), ('Parking'), ('Catering Kitchen'), ('Pool'), ('Garden/Terrace'), ('Outdoor Space'), ('Security System')) AS f(feature);

INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT '3f1457ae-823a-4ecf-a0bb-63829ed74755'::uuid as id) v
CROSS JOIN (VALUES ('Air Conditioning'), ('Wi-Fi'), ('Parking'), ('Pool'), ('Garden/Terrace'), ('Outdoor Space')) AS f(feature);

INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT '9c30302f-2f9a-481e-bd2d-02f0e6a59071'::uuid as id) v
CROSS JOIN (VALUES ('Air Conditioning'), ('Wi-Fi'), ('Parking'), ('Garden/Terrace'), ('Outdoor Space')) AS f(feature);

INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT '97adb481-2d8e-49ca-8857-277fe42cf7dc'::uuid as id) v
CROSS JOIN (VALUES ('Air Conditioning'), ('Wi-Fi'), ('Parking'), ('Pool'), ('Garden/Terrace'), ('Outdoor Space'), ('Security System')) AS f(feature);

-- Rooftop & Terrace features
INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT '4753f488-d40f-4f41-9707-ab3c9bf8ea50'::uuid as id) v
CROSS JOIN (VALUES ('Air Conditioning'), ('Wi-Fi'), ('Sound System'), ('Bar Area'), ('Dance Floor'), ('Outdoor Space')) AS f(feature);

INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT '7770a0b0-e0d7-4d52-9776-f22db96aaced'::uuid as id) v
CROSS JOIN (VALUES ('Wi-Fi'), ('Sound System'), ('Bar Area'), ('Outdoor Space'), ('Garden/Terrace')) AS f(feature);

INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT '1ea72b3a-2587-4c66-904a-62f5c58ed12f'::uuid as id) v
CROSS JOIN (VALUES ('Wi-Fi'), ('Sound System'), ('Bar Area'), ('Outdoor Space'), ('Garden/Terrace')) AS f(feature);

INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT '4846f985-8325-4286-94bd-7a0003af6398'::uuid as id) v
CROSS JOIN (VALUES ('Air Conditioning'), ('Wi-Fi'), ('Sound System'), ('Bar Area'), ('Dance Floor'), ('Outdoor Space'), ('Valet Parking')) AS f(feature);

INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT 'f7504c86-e00f-402b-80b7-e38754021ca0'::uuid as id) v
CROSS JOIN (VALUES ('Wi-Fi'), ('Parking'), ('Sound System'), ('Bar Area'), ('Outdoor Space')) AS f(feature);

INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT 'e742b800-e687-4635-9e90-3abdeeef5e93'::uuid as id) v
CROSS JOIN (VALUES ('Wi-Fi'), ('Parking'), ('Catering Kitchen'), ('Bar Area'), ('Outdoor Space'), ('Garden/Terrace')) AS f(feature);

INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT '186a54e0-a09d-4cb2-995a-37221e43c2c6'::uuid as id) v
CROSS JOIN (VALUES ('Wi-Fi'), ('Parking'), ('Sound System'), ('Bar Area'), ('Outdoor Space'), ('Garden/Terrace')) AS f(feature);

-- Event Center features
INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT 'c378f7c4-1dfe-4c21-87f6-1e6fe8bda475'::uuid as id) v
CROSS JOIN (VALUES ('Air Conditioning'), ('Wi-Fi'), ('Parking'), ('Projector/Screen'), ('Sound System'), ('Stage/Platform'), ('Wheelchair Accessible'), ('Security System')) AS f(feature);

INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT '52aa318b-5d80-4289-b5b9-1a8d7fde0ed2'::uuid as id) v
CROSS JOIN (VALUES ('Air Conditioning'), ('Wi-Fi'), ('Parking'), ('Projector/Screen'), ('Sound System'), ('Stage/Platform'), ('Wheelchair Accessible')) AS f(feature);

INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT '18370277-0223-4d77-bd74-06a2a2ba2ece'::uuid as id) v
CROSS JOIN (VALUES ('Air Conditioning'), ('Wi-Fi'), ('Parking'), ('Projector/Screen'), ('Sound System'), ('Stage/Platform'), ('Wheelchair Accessible'), ('Security System')) AS f(feature);

INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT '4b6c1e37-769b-4e48-919a-9a99125f11c5'::uuid as id) v
CROSS JOIN (VALUES ('Air Conditioning'), ('Wi-Fi'), ('Parking'), ('Projector/Screen'), ('Sound System'), ('Wheelchair Accessible')) AS f(feature);

INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT '2452ddfc-d785-4f67-bd44-727e1b4f1273'::uuid as id) v
CROSS JOIN (VALUES ('Air Conditioning'), ('Wi-Fi'), ('Parking'), ('Projector/Screen'), ('Sound System'), ('Stage/Platform')) AS f(feature);

INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT 'b6ea75b2-e0ff-4b1c-b3c4-b369928e15ab'::uuid as id) v
CROSS JOIN (VALUES ('Air Conditioning'), ('Wi-Fi'), ('Parking'), ('Projector/Screen'), ('Sound System'), ('Stage/Platform'), ('Wheelchair Accessible')) AS f(feature);

INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT 'a5fae3a5-4412-4c7c-95a0-411fb440344f'::uuid as id) v
CROSS JOIN (VALUES ('Air Conditioning'), ('Wi-Fi'), ('Parking'), ('Sound System'), ('Stage/Platform'), ('Wheelchair Accessible')) AS f(feature);

INSERT INTO venue_features (venue_id, feature_name) 
SELECT id, feature FROM 
(SELECT 'd4623f90-a971-465a-9c22-b474fac66366'::uuid as id) v
CROSS JOIN (VALUES ('Air Conditioning'), ('Wi-Fi'), ('Parking'), ('Projector/Screen'), ('Sound System'), ('Stage/Platform'), ('Garden/Terrace'), ('Wheelchair Accessible')) AS f(feature);