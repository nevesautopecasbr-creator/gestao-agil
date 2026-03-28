-- Parâmetros globais de custo para análise de viabilidade (valores em R$).

CREATE TABLE IF NOT EXISTS public.viability_cost_config (
    id                        VARCHAR(32)  PRIMARY KEY,
    created_date              TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_date              TIMESTAMP    NOT NULL DEFAULT NOW(),
    created_by                VARCHAR(100),
    valor_hora_consultor      NUMERIC(15,2) NOT NULL DEFAULT 0,
    custo_hospedagem_diaria   NUMERIC(15,2) NOT NULL DEFAULT 0,
    custo_alimentacao_diaria  NUMERIC(15,2) NOT NULL DEFAULT 0,
    custo_por_km              NUMERIC(15,2) NOT NULL DEFAULT 0
);

COMMENT ON TABLE public.viability_cost_config IS 'Configuração global de custos operacionais para cálculos de viabilidade.';

INSERT INTO public.viability_cost_config (
    id,
    created_date,
    updated_date,
    created_by,
    valor_hora_consultor,
    custo_hospedagem_diaria,
    custo_alimentacao_diaria,
    custo_por_km
) VALUES (
    'viability_cost_cfg_row_000000001',
    NOW(),
    NOW(),
    'system',
    0,
    0,
    0,
    0
)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.viability_cost_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS viability_cost_config_select ON public.viability_cost_config;
CREATE POLICY viability_cost_config_select
ON public.viability_cost_config
FOR SELECT
TO authenticated
USING (public.current_user_type() IN ('admin', 'consultant'));

DROP POLICY IF EXISTS viability_cost_config_admin_write ON public.viability_cost_config;
CREATE POLICY viability_cost_config_admin_write
ON public.viability_cost_config
FOR ALL
TO authenticated
USING (public.current_user_type() = 'admin')
WITH CHECK (public.current_user_type() = 'admin');
