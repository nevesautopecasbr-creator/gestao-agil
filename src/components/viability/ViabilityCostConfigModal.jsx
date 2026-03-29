import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import CentavosMoneyInput from '@/components/ui/CentavosMoneyInput';
import {
  reaisToCentavosDigitString,
  validateCentavosDigits,
  centavosDigitsToReais,
  formatCEPInput,
  normalizeCepDigits,
  isValidCepBR,
} from '@/lib/validators';
import { upsertViabilityCostConfig } from '@/api/viabilityCostConfigApi';
import { toast } from '@/components/ui/use-toast';

const emptyForm = () => ({
  valorHoraConsultor: '',
  custoHospedagemDiaria: '',
  custoAlimentacaoDiaria: '',
  custoPorKm: '',
  cepOrigem: '',
  limiteKmBateVolta: '',
});

function configToFormFields(config) {
  if (!config) return emptyForm();
  return {
    valorHoraConsultor: reaisToCentavosDigitString(config.valorHoraConsultor),
    custoHospedagemDiaria: reaisToCentavosDigitString(config.custoHospedagemDiaria),
    custoAlimentacaoDiaria: reaisToCentavosDigitString(config.custoAlimentacaoDiaria),
    custoPorKm: reaisToCentavosDigitString(config.custoPorKm),
    cepOrigem: formatCEPInput(config.cepOrigem || ''),
    limiteKmBateVolta:
      config.limiteKmBateVolta !== null &&
      config.limiteKmBateVolta !== undefined &&
      Number.isFinite(Number(config.limiteKmBateVolta))
        ? String(config.limiteKmBateVolta).replace('.', ',')
        : '',
  };
}

/**
 * @param {Object} props
 * @param {boolean} props.open
 * @param {(open: boolean) => void} props.onOpenChange
 * @param {import('@/api/viabilityCostConfigApi').ViabilityCostConfig | null} props.initialConfig
 * @param {string|null} [props.createdBy]
 * @param {(saved: import('@/api/viabilityCostConfigApi').ViabilityCostConfig) => void} props.onSaved
 */
export default function ViabilityCostConfigModal({
  open,
  onOpenChange,
  initialConfig,
  createdBy,
  onSaved,
}) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(configToFormFields(initialConfig));
    }
  }, [open, initialConfig]);

  const handleSave = async () => {
    const fields = [
      ['valorHoraConsultor', form.valorHoraConsultor],
      ['custoHospedagemDiaria', form.custoHospedagemDiaria],
      ['custoAlimentacaoDiaria', form.custoAlimentacaoDiaria],
      ['custoPorKm', form.custoPorKm],
    ];

    for (const [, digits] of fields) {
      if (!validateCentavosDigits(digits, { min: 0, allowEmpty: false })) {
        toast({
          title: 'Valores inválidos',
          description: 'Preencha todos os campos com valores válidos (use só números; os dois últimos são centavos).',
          variant: 'destructive',
        });
        return;
      }
    }

    if (!isValidCepBR(form.cepOrigem)) {
      toast({
        title: 'CEP inválido',
        description: 'Informe o CEP de origem com 8 dígitos.',
        variant: 'destructive',
      });
      return;
    }

    const limiteStr = String(form.limiteKmBateVolta || '').trim().replace(',', '.');
    const limiteKmBateVolta = Number(limiteStr);
    if (!Number.isFinite(limiteKmBateVolta) || limiteKmBateVolta < 0) {
      toast({
        title: 'Limite de km inválido',
        description: 'Informe um número maior ou igual a zero (km máximo de ida para bate-volta).',
        variant: 'destructive',
      });
      return;
    }

    const payload = {
      valorHoraConsultor: centavosDigitsToReais(form.valorHoraConsultor),
      custoHospedagemDiaria: centavosDigitsToReais(form.custoHospedagemDiaria),
      custoAlimentacaoDiaria: centavosDigitsToReais(form.custoAlimentacaoDiaria),
      custoPorKm: centavosDigitsToReais(form.custoPorKm),
      cepOrigem: normalizeCepDigits(form.cepOrigem),
      limiteKmBateVolta,
      createdBy: createdBy || undefined,
    };

    setSaving(true);
    try {
      const { data, error } = await upsertViabilityCostConfig(payload);
      if (error) {
        toast({
          title: 'Erro ao salvar',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }
      toast({
        title: 'Configurações salvas',
        description: 'Os custos de viabilidade foram atualizados com sucesso.',
      });
      onSaved?.(data);
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  const inputClass = 'text-sm';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Custos operacionais de viabilidade</DialogTitle>
          <p className="text-sm text-muted-foreground font-normal pt-1">
            Digite só números: os <strong>dois últimos dígitos</strong> são sempre centavos depois da vírgula.
            Ex.: <span className="whitespace-nowrap">2345</span> vira{' '}
            <span className="whitespace-nowrap">23,45</span>; <span className="whitespace-nowrap">5</span> vira{' '}
            <span className="whitespace-nowrap">0,05</span>.
          </p>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <div>
            <label className="text-sm font-medium text-slate-700">Valor hora consultor</label>
            <CentavosMoneyInput
              className={inputClass}
              placeholder="0,00"
              value={form.valorHoraConsultor}
              onChange={(v) => setForm((f) => ({ ...f, valorHoraConsultor: v }))}
              required
              disabled={saving}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Custo hospedagem diária</label>
            <CentavosMoneyInput
              className={inputClass}
              placeholder="0,00"
              value={form.custoHospedagemDiaria}
              onChange={(v) => setForm((f) => ({ ...f, custoHospedagemDiaria: v }))}
              required
              disabled={saving}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Custo alimentação diária</label>
            <CentavosMoneyInput
              className={inputClass}
              placeholder="0,00"
              value={form.custoAlimentacaoDiaria}
              onChange={(v) => setForm((f) => ({ ...f, custoAlimentacaoDiaria: v }))}
              required
              disabled={saving}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Custo por km</label>
            <CentavosMoneyInput
              className={inputClass}
              placeholder="0,00"
              value={form.custoPorKm}
              onChange={(v) => setForm((f) => ({ ...f, custoPorKm: v }))}
              required
              disabled={saving}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">CEP origem (base do consultor)</label>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="postal-code"
              placeholder="00000-000"
              className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm ${inputClass}`}
              value={form.cepOrigem}
              onChange={(e) =>
                setForm((f) => ({ ...f, cepOrigem: formatCEPInput(e.target.value) }))
              }
              maxLength={9}
              disabled={saving}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Limite km bate-volta (ida)</label>
            <input
              type="text"
              inputMode="decimal"
              placeholder="Ex.: 120"
              className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm ${inputClass}`}
              value={form.limiteKmBateVolta}
              onChange={(e) => setForm((f) => ({ ...f, limiteKmBateVolta: e.target.value }))}
              disabled={saving}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Se a distância de ida for maior que este valor, o cenário passa a ser pernoite (ida/volta única).
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancelar
          </Button>
          <Button
            type="button"
            className="bg-[#1e3a5f] hover:bg-[#2d4a6f]"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
