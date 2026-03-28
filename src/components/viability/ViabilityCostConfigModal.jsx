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
    custoPorKm: formatNumberToMoneyBRInput(config.custoPorKm),
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
      custoPorKm: parseMoneyBRToNumber(form.custoPorKm),
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
        </DialogHeader>

        <div className="space-y-3 py-2">
          <div>
            <label className="text-sm font-medium text-slate-700">Valor hora consultor (R$)</label>
            <MoneyInput
              className={inputClass}
              value={form.valorHoraConsultor}
              onChange={(v) => setForm((f) => ({ ...f, valorHoraConsultor: v }))}
              required
              disabled={saving}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Custo hospedagem diária (R$)</label>
            <MoneyInput
              className={inputClass}
              value={form.custoHospedagemDiaria}
              onChange={(v) => setForm((f) => ({ ...f, custoHospedagemDiaria: v }))}
              required
              disabled={saving}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Custo alimentação diária (R$)</label>
            <MoneyInput
              className={inputClass}
              value={form.custoAlimentacaoDiaria}
              onChange={(v) => setForm((f) => ({ ...f, custoAlimentacaoDiaria: v }))}
              required
              disabled={saving}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Custo por km (R$)</label>
            <MoneyInput
              className={inputClass}
              value={form.custoPorKm}
              onChange={(v) => setForm((f) => ({ ...f, custoPorKm: v }))}
              required
              disabled={saving}
            />
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
