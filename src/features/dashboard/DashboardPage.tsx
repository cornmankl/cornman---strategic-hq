import React, { useState, useCallback, useEffect } from 'react';
import { Header } from '../../components/Header';
import { Section } from '../../components/Section';
import { SmartDashboard } from '../../components/dashboard/SmartDashboard';
import { MobileNavigation } from '../../components/navigation/MobileNavigation';
import { useAppState } from '../../contexts/AppStateContext';
import { generateGeminiContent } from '../../services/geminiService';
import { BASE_PROMPT } from '../../constants';
import type { Sale, InventoryItem, Customer, Invoice, Project } from '../../types';

const PRODUCT_NAMES = ['CRNMN Signature', 'Spicy Sambal', 'Cheesy Cheeza', 'Salted Caramel'];

const getBestSeller = (sales: Sale[]): string => {
  if (sales.length === 0) return 'N/A';
  const counts = sales.reduce(
    (acc, sale) => {
      acc[sale.product] = (acc[sale.product] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
  return Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b));
};

const DashboardPage: React.FC = () => {
  const { 
    state, 
    addSale, 
    addCustomer, 
    addProject, 
    toggleTask, 
    schedulePost, 
    updateAIInsight,
    restockInventory, 
    generateInvoice,
    metrics 
  } = useAppState();

  // Get financial data from state directly
  const totalRevenue = state.totalRevenue;
  const cogs = state.cogs;
  const profit = state.profit;
  const fixedExpenses = state.fixedExpenses;
  const MONTHLY_GOAL = state.monthlyGoal;

  // Simulate real-time sales & inventory reduction using context
  useEffect(() => {
    const salesInterval = setInterval(() => {
      if (state.customers.length === 0) return;
      const randomProduct = PRODUCT_NAMES[Math.floor(Math.random() * PRODUCT_NAMES.length)];
      const randomCustomer = state.customers[Math.floor(Math.random() * state.customers.length)];

      const newSale: Sale = {
        id: `sale-${Date.now()}`,
        product: randomProduct,
        amount: 8.9 + Math.random() * 2,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        customerId: randomCustomer.id,
        items: [{ id: `item-${Date.now()}`, name: randomProduct, quantity: 1, price: 8.9 + Math.random() * 2 }],
        total: 8.9 + Math.random() * 2,
        createdAt: new Date().toISOString(),
        status: 'completed'
      };

      addSale(newSale);
    }, 8000);

    return () => clearInterval(salesInterval);
  }, [state.customers, addSale]);

  // AI Strategic Advisor using context
  useEffect(() => {
    const generateInsight = async () => {
      updateAIInsight('', true); // Set loading state

      const bestSeller = getBestSeller(state.sales);
      const lowStockItems = state.inventory.filter((i) => i.stock < i.threshold);

      const prompt = `
        ${BASE_PROMPT}
        You are the AI Strategic Advisor for CORNMAN.
        Analyze the following real-time business data and provide ONE concise, actionable strategic recommendation in Bahasa Melayu.
        The recommendation should be direct, insightful, and help the user achieve their goal of RM10k/month revenue.

        CURRENT DATA:
        - Total Revenue (Month-to-Date): RM${state.totalRevenue.toFixed(2)}
        - Best-selling item (based on recent sales): ${bestSeller}
        - Low Stock Items: ${lowStockItems.map((i) => `${i.name} (${i.stock} units)`).join(', ') || 'None'}

        Based on this data, what is the SINGLE MOST IMPORTANT thing I should do right now?
        Keep it short (2-3 sentences), like a real-time alert from an advisor. Start with a clear header like 'CADANGAN STRATEGIK:' or 'AMARAN OPERASI:'.
      `;
      
      const insight = await generateGeminiContent(prompt);
      updateAIInsight(insight, false);
    };

    generateInsight(); // Initial call
    const insightInterval = setInterval(generateInsight, 60000); // Update every 60 seconds

    return () => clearInterval(insightInterval);
  }, [state.sales, state.inventory, state.totalRevenue, updateAIInsight]);

  const handleSchedule = useCallback(
    (platform: string, content: string, icon: React.ReactNode) => {
      const newPost = {
        id: `post-${Date.now()}`,
        platform,
        icon,
        content,
        scheduledAt: new Date().toLocaleString('en-US', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
        }),
        status: 'scheduled',
      };
      schedulePost(newPost);
    },
    [schedulePost],
  );

  const handleManualRestock = useCallback((itemId: string) => {
    restockInventory(itemId, 50);
  }, [restockInventory]);

  const handleAutoRestock = useCallback(
    (itemName: string) => {
      const item = state.inventory.find(i => 
        i.name.toLowerCase().includes(itemName.toLowerCase())
      );
      
      if (item) {
        restockInventory(item.id, 50);
        return `Pesanan untuk 50 unit ${itemName} telah dibuat. Stok dikemaskini.`;
      }
      return `Item '${itemName}' tidak dijumpai dalam inventori.`;
    },
    [state.inventory, restockInventory],
  );

  const handleGenerateInvoice = useCallback(
    (sale: Sale) => {
      generateInvoice(sale);
    },
    [generateInvoice],
  );

  const handleAddCustomer = useCallback((name: string, phone: string) => {
    const newCustomer: Customer = {
      id: `cust-${Date.now()}`,
      name,
      phone,
      lastSeen: new Date().toLocaleDateString('en-GB'),
      totalSpent: 0,
    };
    addCustomer(newCustomer);
  }, [addCustomer]);

  const handleAddProject = useCallback((title: string) => {
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      title: title.split('\n')[0].replace('NAMA:', '').trim(), // Extract title
      description: title,
      status: 'Perancangan',
      tasks: [
        { id: 'task1', text: 'Kaji kos bahan & harga jualan', completed: false },
        { id: 'task2', text: 'Reka pembungkusan / visual', completed: false },
        { id: 'task3', text: 'Rancang strategi pelancaran', completed: false },
        { id: 'task4', text: 'Laksanakan pelancaran', completed: false },
      ],
    };
    addProject(newProject);
  }, [addProject]);

  const handleToggleTask = useCallback((projectId: string, taskId: string) => {
    toggleTask(projectId, taskId);
  }, [toggleTask]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Header />

      <main className="space-y-8 sm:space-y-12 lg:space-y-16">
        <Section
          title="STRATEGIC DASHBOARD"
          subtitle="Real-time business intelligence and AI-powered insights"
          titleGradient
        >
          <SmartDashboard
            totalRevenue={state.totalRevenue}
            monthlyGoal={MONTHLY_GOAL}
            aiInsight={state.aiInsight}
            isBriefingLoading={state.isBriefingLoading}
            onRestock={handleManualRestock}
            onAddCustomer={() => handleAddCustomer('', '')}
            onSchedulePost={() => handleSchedule('', '', <></>)}
          />
        </Section>
      </main>
      
      <MobileNavigation />
    </div>
  );
};

export default DashboardPage;
