-- Run inside the postgres container with psql
\i /tmp/lab6_rssi/create_tables.sql

\copy public.b45d5094b2d1 FROM '/tmp/lab6_rssi/csv/b45d5094b2d1.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8')
\copy public.b45d5094b2d0 FROM '/tmp/lab6_rssi/csv/b45d5094b2d0.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8')
\copy public.b45d5094b2d2 FROM '/tmp/lab6_rssi/csv/b45d5094b2d2.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8')
\copy public.b45d5094b2c2 FROM '/tmp/lab6_rssi/csv/b45d5094b2c2.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8')
\copy public.b45d5094b2c1 FROM '/tmp/lab6_rssi/csv/b45d5094b2c1.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8')
