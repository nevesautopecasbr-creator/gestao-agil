import React from 'react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AlertTriangle, Calendar, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

/**
 * conflictInfo = {
 *   conflictingDates: [{date, projectName}],
 *   suggestedStartDate: string (ISO date),
 * }
 */
export default function ConsultantConflictModal({ open, onClose, onProceedAnyway, onUseNewDate, conflictInfo }) {
  if (!conflictInfo) return null;

  const { conflictingDates, suggestedStartDate } = conflictInfo;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="w-5 h-5" />
            Conflito de Agenda do Consultor
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <p className="text-sm text-slate-600">
            O consultor selecionado já possui sessões agendadas nas seguintes datas que colidem com este projeto:
          </p>

          <div className="max-h-52 overflow-y-auto space-y-1 rounded-lg border border-amber-200 bg-amber-50 p-3">
            {conflictingDates.map((c, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1 text-amber-800 font-medium">
                  <Calendar className="w-3 h-3" />
                  {format(parseISO(c.date), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                </span>
                <span className="text-xs text-amber-600 truncate max-w-[160px]">{c.projectName}</span>
              </div>
            ))}
          </div>

          {suggestedStartDate && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-medium text-blue-700 mb-1">Sugestão de data disponível:</p>
              <div className="flex items-center gap-2 text-blue-800 font-semibold">
                <ArrowRight className="w-4 h-4" />
                {format(parseISO(suggestedStartDate), "dd 'de' MMMM, yyyy", { locale: ptBR })}
              </div>
              <p className="text-xs text-blue-500 mt-1">Primeira data livre após os conflitos</p>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Cancelar
          </Button>
          {suggestedStartDate && (
            <Button
              className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
              onClick={() => onUseNewDate(suggestedStartDate)}
            >
              Usar data sugerida
            </Button>
          )}

        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}