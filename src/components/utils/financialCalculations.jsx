/**
 * Calcula o total de receita de projetos
 */
export function calculateTotalRevenue(projects) {
  return projects.reduce((sum, p) => sum + (p.contracted_value || 0), 0);
}

/**
 * Calcula o total de custos de mão de obra
 */
export function calculateTotalLabor(timeEntries) {
  return timeEntries.reduce(
    (sum, t) => sum + ((t.hours || 0) * (t.hourly_rate || 0)), 
    0
  );
}

/**
 * Calcula o total de despesas
 */
export function calculateTotalExpenses(expenses) {
  return expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
}

/**
 * Calcula o total de horas trabalhadas
 */
export function calculateTotalHours(timeEntries) {
  return timeEntries.reduce((sum, t) => sum + (t.hours || 0), 0);
}

/**
 * Calcula o lucro líquido
 */
export function calculateProfit(revenue, labor, expenses) {
  return revenue - labor - expenses;
}

/**
 * Calcula a margem de lucro em percentual
 */
export function calculateProfitMargin(profit, revenue) {
  return revenue > 0 ? (profit / revenue) * 100 : 0;
}

/**
 * Calcula métricas financeiras completas
 */
export function calculateFinancialMetrics(projects, timeEntries, expenses) {
  const revenue = calculateTotalRevenue(projects);
  const labor = calculateTotalLabor(timeEntries);
  const totalExpenses = calculateTotalExpenses(expenses);
  const hours = calculateTotalHours(timeEntries);
  const profit = calculateProfit(revenue, labor, totalExpenses);
  const margin = calculateProfitMargin(profit, revenue);
  
  return {
    revenue,
    labor,
    expenses: totalExpenses,
    hours,
    profit,
    margin,
    hourlyMargin: hours > 0 ? profit / hours : 0
  };
}

/**
 * Calcula rentabilidade por projeto
 */
export function calculateProjectProfitability(project, timeEntries, expenses) {
  const projectHours = timeEntries.filter(t => t.project_id === project.id);
  const projectExpenses = expenses.filter(e => e.project_id === project.id);
  
  const labor = calculateTotalLabor(projectHours);
  const exp = calculateTotalExpenses(projectExpenses);
  const revenue = project.contracted_value || 0;
  const profit = calculateProfit(revenue, labor, exp);
  const margin = calculateProfitMargin(profit, revenue);
  const hours = calculateTotalHours(projectHours);
  
  return {
    id: project.id,
    name: project.name,
    revenue,
    labor,
    expenses: exp,
    profit,
    margin,
    hours
  };
}