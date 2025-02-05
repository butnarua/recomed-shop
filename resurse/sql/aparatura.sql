DROP TYPE IF EXISTS categ_aparatura;
DROP TYPE IF EXISTS tipuri_aparatura;
DROP TYPE IF EXISTS material_exterior_produse;

CREATE TYPE categ_aparatura AS ENUM('fizioterapie', 'kinetoterapie', 'masaj_si_wellness', 'accesorii');
CREATE TYPE tipuri_aparatura AS ENUM('electrostimulare', 'sonde', 'gimnastica', 'gantere', 'minge', 'aparate_masaj', 'uleiuri_masaj', 'scaun_rotile', 'ventuze', 'tensiometre');
CREATE TYPE material_exterior_produse AS ENUM('plastic', 'metal', 'textil', 'silicon', 'lemn');

CREATE TABLE IF NOT EXISTS aparatura (
   id serial PRIMARY KEY,
   nume VARCHAR(100) UNIQUE NOT NULL,
   descriere TEXT,
   imagine VARCHAR(300),
   categorie categ_aparatura DEFAULT 'fizioterapie',
   tip_produs tipuri_aparatura DEFAULT 'electrostimulare',
   pret NUMERIC(10,2) NOT NULL,
   dimensiuni VARCHAR(50),
   data_adaugare TIMESTAMP DEFAULT current_timestamp,
   material_produs material_exterior_produse DEFAULT 'plastic',
   toate_materialele VARCHAR [],
   reducere BOOLEAN NOT NULL DEFAULT FALSE
);

INSERT INTO aparatura (nume, descriere, imagine, categorie, tip_produs, pret, dimensiuni, material_produs, toate_materialele, reducere) VALUES 
('Aparat masaj cu bambus', 'Dispozitiv pentru masaj profund', 'aparate_masaj_1_640.jpg', 'masaj_si_wellness', 'aparate_masaj', 1800, '30x20x15 cm', 'lemn', '{"lemn", "metal"}', FALSE),
('Aparat masaj spate', 'Masaj prin caldura', 'aparate_masaj_2_640.jpg', 'masaj_si_wellness', 'aparate_masaj', 2000, '25x18x12 cm', 'plastic', '{"plastic", "metal"}', FALSE),
('Aparat diffuser', 'Dispozitiv profesional pentru purificarea aerului', 'aparate_masaj_3_640.jpg', 'masaj_si_wellness', 'aparate_masaj', 2500, '35x25x18 cm', 'metal', '{"metal", "plastic"}', TRUE),
('Electrostimulator musculatura', 'Aparat pentru stimulare musculară', 'electrostimulare_1_640.jpg', 'fizioterapie', 'electrostimulare', 1500, '30x20x10 cm', 'plastic', '{"plastic", "metal"}', FALSE),
('Electrostimulator portabil', 'Dispozitiv de electrostimulare portabil', 'electrostimulare_2_640.jpg', 'fizioterapie', 'electrostimulare', 1800, '28x18x12 cm', 'metal', '{"metal", "plastic"}', FALSE),
('Electrostimulator prin vibratii', 'Aparat de recuperare prin electrostimulare', 'electrostimulare_3_640.jpg', 'fizioterapie', 'electrostimulare', 2200, '32x22x14 cm', 'plastic', '{"plastic", "metal"}', TRUE),
('Gantere diverse greutati', 'Ganteră din cauciuc de pana la 5kg', 'gantere_1_640.jpg', 'kinetoterapie', 'gantere', 100, '5kg', 'metal', '{"metal", "silicon"}', FALSE),
('Gantere 2kg', 'Set gantere 2x2kg', 'gantere_2_640.jpg', 'kinetoterapie', 'gantere', 250, '2kg fiecare', 'metal', '{"metal", "silicon"}', FALSE),
('Benzi elastice pentru gimnastica', 'Banda elastică pentru exerciții', 'gimnastica_1_640.jpg', 'kinetoterapie', 'gimnastica', 120, '200x15 cm', 'silicon', '{"silicon"}', FALSE),
('Benzi kinesio tape', 'Benzi pentru sportivi', 'gimnastica_2_640.jpg', 'kinetoterapie', 'gimnastica', 180, '180x60 cm', 'textil', '{"textil"}', FALSE),
('Placa echilibru', 'Placa pentru reeducarea echilibrului', 'gimnastica_3_640.jpg', 'kinetoterapie', 'gimnastica', 150, '65 cm diametru', 'plastic', '{"plastic"}', FALSE),
('Minge kinetoterapie', 'Minge pentru exerciții', 'minge_1_640.jpg', 'kinetoterapie', 'minge', 200, '75 cm diametru', 'silicon', '{"silicon"}', FALSE),
('Minge kinetoterapie mana', 'Minge mică pentru recuperarea mainii', 'minge_2_640.jpg', 'kinetoterapie', 'minge', 120, '45 cm diametru', 'silicon', '{"silicon"}', FALSE),
('Scaun cu rotile gri', 'Scaun cu rotile pliabil', 'scaun_1_640.jpg', 'accesorii', 'scaun_rotile', 5000, '100x60x90 cm', 'metal', '{"metal", "textil"}', TRUE),
('Scaun cu rotile negru', 'Scaun cu rotile electric', 'scaun_2_640.jpg', 'accesorii', 'scaun_rotile', 10000, '110x65x95 cm', 'metal', '{"metal", "textil"}', TRUE),
('Sondă aparat tecar', 'Sondă pentru terapii speciale', 'sonda_1_640.jpg', 'fizioterapie', 'sonde', 700, '15 cm', 'silicon', '{"silicon"}', FALSE),
('Sondă aparat ultrasunet', 'Sondă medicală profesională', 'sonda_2_640.jpg', 'fizioterapie', 'sonde', 1200, '20 cm', 'silicon', '{"silicon"}', FALSE),
('Tensiometru', 'Aparat pentru măsurarea tensiunii', 'tensiometru_1_640.jpg', 'accesorii', 'tensiometre', 300, '12x8 cm', 'plastic', '{"plastic"}', FALSE),
('Ulei masaj', 'Ulei esențial pentru relaxare', 'ulei_masaj_640.jpg', 'masaj_si_wellness', 'uleiuri_masaj', 80, '500ml', 'plastic', '{"plastic"}', FALSE),
('Ventuze terapie', 'Set ventuze silicon pentru masaj', 'ventuze_1_640.jpg', 'masaj_si_wellness', 'ventuze', 150, 'Diverse dimensiuni', 'silicon', '{"silicon"}', FALSE),
('Ventuze recuperare', 'Ventuze vacuum pentru terapie', 'ventuze_2_640.jpg', 'masaj_si_wellness', 'ventuze', 180, 'Diverse dimensiuni', 'silicon', '{"silicon"}', FALSE);