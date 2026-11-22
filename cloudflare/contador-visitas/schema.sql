-- Contador de visitas de Sangre Carbayona (Cloudflare D1)
-- Solo se guardan totales agregados: ni IPs, ni cookies, ni nada que
-- identifique a nadie. El país lo pone Cloudflare (código ISO de 2 letras).

CREATE TABLE IF NOT EXISTS visitas_pais (
  pais  TEXT PRIMARY KEY,          -- 'ES', 'AR', 'MX'... ('XX' = desconocido)
  total INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS visitas_dia (
  dia   TEXT PRIMARY KEY,          -- 'AAAA-MM-DD' (hora de Madrid)
  total INTEGER NOT NULL DEFAULT 0
);
