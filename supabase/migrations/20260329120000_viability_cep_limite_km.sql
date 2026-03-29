-- CEP base e limite de km para regra bate-volta vs pernoite (motor de viabilidade).

ALTER TABLE public.viability_cost_config
  ADD COLUMN IF NOT EXISTS cep_origem VARCHAR(12) NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS limite_km_bate_volta NUMERIC(10, 2) NOT NULL DEFAULT 0;

COMMENT ON COLUMN public.viability_cost_config.cep_origem IS 'CEP da base do consultor (origem).';
COMMENT ON COLUMN public.viability_cost_config.limite_km_bate_volta IS 'Km máximo (ida) para cenário bate-volta no mesmo dia.';
