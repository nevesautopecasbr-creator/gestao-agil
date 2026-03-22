import React, { useState } from 'react';
import {
  LayoutDashboard, FileText, Landmark, BookOpen, TrendingUp, Settings2, Receipt, BarChart2
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PeriodProvider } from '../components/financial/PeriodContext';
import FinancialDashboard from '../components/financial/FinancialDashboard';
import BillingTab from '../components/financial/BillingTab';
import AccountsTab from '../components/financial/AccountsTab';
import ChartOfAccountsTab from '../components/financial/ChartOfAccountsTab';
import DRETab from '../components/financial/DRETab';
import TaxRatesTab from '../components/financial/TaxRatesTab';
import ExpensesTab from '../components/financial/ExpensesTab';
import ReportsTab from '../components/financial/ReportsTab';

export default function Financial() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <PeriodProvider>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Gestão Financeira</h1>
          <p className="text-slate-500 mt-1">Controle completo de receitas, despesas e contas</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-slate-100 flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="dashboard" className="flex items-center gap-1.5">
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" /> A Faturar / Receitas
            </TabsTrigger>
            <TabsTrigger value="accounts" className="flex items-center gap-1.5">
              <Landmark className="w-4 h-4" /> Contas
            </TabsTrigger>
            <TabsTrigger value="dre" className="flex items-center gap-1.5">
              <FileText className="w-4 h-4" /> DRE
            </TabsTrigger>
            <TabsTrigger value="chart" className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" /> Plano de Contas
            </TabsTrigger>
            <TabsTrigger value="expenses" className="flex items-center gap-1.5">
              <Receipt className="w-4 h-4" /> Despesas
            </TabsTrigger>
            <TabsTrigger value="taxes" className="flex items-center gap-1.5">
              <Settings2 className="w-4 h-4" /> Impostos
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4" /> Relatórios
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard"><FinancialDashboard /></TabsContent>
          <TabsContent value="billing"><BillingTab /></TabsContent>
          <TabsContent value="accounts"><AccountsTab /></TabsContent>
          <TabsContent value="dre"><DRETab /></TabsContent>
          <TabsContent value="chart"><ChartOfAccountsTab /></TabsContent>
          <TabsContent value="expenses"><ExpensesTab /></TabsContent>
          <TabsContent value="taxes"><TaxRatesTab /></TabsContent>
          <TabsContent value="reports"><ReportsTab /></TabsContent>
        </Tabs>
      </div>
    </PeriodProvider>
  );
}