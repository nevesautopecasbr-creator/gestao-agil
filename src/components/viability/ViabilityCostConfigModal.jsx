import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import MoneyInput from '@/components/ui/MoneyInput';
import { parseMoneyBRToNumber, validateMoney, formatNumberToMoneyBRInput } from '@/lib/validators';
import { upsertViabilityCostConfig } from '@/api/viabilityCostConfigApi';
import { toast } from '@/components/ui/use-toast';

const emptyForm = () => ({
  valorHoraConsultor: '',
  custoHospedagemDiaria: '',
  custoAlimentacaoDiaria: '',
  custoPorKm: '',
});

function configToFormFields(config) {
  if (!config) return emptyForm();
  return {
    valorHoraConsultor: formatNumberToMoneyBRInput(config.valorHoraConsultor),
    custoHospedagemDiaria: formatNumberToMoneyBRInput(config.custoHospedagemDiaria),
    custoAlimentacaoDiaria: formatNumberToMoneyBRInput(config.custoAlimentacaoDiaria),
    custoPorKm: formatNumberToMoneyBRInput(config.custoPorKm, {
      minFractionDigits: 2,
      maxFractionDigits: 4,
    }),
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

    for (const [, raw] of fields) {
      if (!validateMoney(raw, { min: 0, allowEmpty: false })) {
        toast({
          title: 'Valores inválidos',
          description: 'Preencha todos os campos com valores numéricos válidos (≥ 0).',
          variant: 'destructive',
        });
        return;
      }
    }

    const payload = {
      valorHoraConsultor: parseMoneyBRToNumber(form.valorHoraConsultor),
      custoHospedagemDiaria: parseMoneyBRToNumber(form.custoHospedagemDiaria),
      custoAlimentacaoDiaria: parseMoneyBRToNumber(form.custoAlimentacaoDiaria),
      custoPorKm: Number(parseMoneyBRToNumber(form.custoPorKm).toFixed(2)),
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
            Valores em reais com centavos: use <strong>vírgula</strong> nos decimais e <strong>ponto</strong> nos
            milhares (ex.: <span className="whitespace-nowrap">1.250,75</span> ou <span className="whitespace-nowrap">0,85</span>).
          </p>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <div>
            <label className="text-sm font-medium text-slate-700">Valor hora consultor</label>
            <MoneyInput
              className={inputClass}
              leadingSymbol="R$"
              decimalScale={2}
              placeholder="0,00"
              value={form.valorHoraConsultor}
              onChange={(v) => setForm((f) => ({ ...f, valorHoraConsultor: v }))}
              required
              disabled={saving}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Custo hospedagem diária</label>
            <MoneyInput
              className={inputClass}
              leadingSymbol="R$"
              decimalScale={2}
              placeholder="0,00"
              value={form.custoHospedagemDiaria}
              onChange={(v) => setForm((f) => ({ ...f, custoHospedagemDiaria: v }))}
              required
              disabled={saving}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Custo alimentação diária</label>
            <MoneyInput
              className={inputClass}
              leadingSymbol="R$"
              decimalScale={2}
              placeholder="0,00"
              value={form.custoAlimentacaoDiaria}
              onChange={(v) => setForm((f) => ({ ...f, custoAlimentacaoDiaria: v }))}
              required
              disabled={saving}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Custo por km</label>
            <MoneyInput
              className={inputClass}
              leadingSymbol="R$"
              decimalScale={4}
              placeholder="0,0000"
              value={form.custoPorKm}
              onChange={(v) => setForm((f) => ({ ...f, custoPorKm: v }))}
              required
              disabled={saving}
            />
            <p className="text-xs text-slate-500 mt-1">Até 4 casas decimais (ex.: combustível/km). O valor é arredondado a 2 casas ao guardar.</p>
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
